const pool = require('../config/database');

exports.getInventory = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT 
        i.InventoryID, 
        b.BookName, 
        b.BookID,
        b.ISBN, 
        i.Quantity, 
        i.WarehouseID,
        w.WarehouseName
      FROM Inventory i
      JOIN Books b ON i.BookID = b.BookID
      LEFT JOIN Warehouses w ON i.WarehouseID = w.WarehouseID
      ORDER BY i.Quantity ASC
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ message: '获取库存失败' });
  }
};

exports.getLowStock = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT 
        i.InventoryID, 
        b.BookName, 
        b.ISBN, 
        i.Quantity, 
        w.WarehouseName
      FROM Inventory i
      JOIN Books b ON i.BookID = b.BookID
      LEFT JOIN Warehouses w ON i.WarehouseID = w.WarehouseID
      WHERE i.Quantity < 10
      ORDER BY i.Quantity ASC
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching low stock:', error);
    res.status(500).json({ message: '获取低库存失败' });
  }
};

exports.getWarehouses = async (req, res) => {
  try {
    const result = await pool.request().query('SELECT * FROM Warehouses ORDER BY WarehouseID ASC');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    res.status(500).json({ message: '获取仓库失败' });
  }
};

exports.addWarehouse = async (req, res) => {
  const { WarehouseName, Location, ContactPerson, ContactPhone } = req.body;
  try {
    const result = await pool.request()
      .input('WarehouseName', WarehouseName)
      .input('Location', Location || '')
      .input('ContactPerson', ContactPerson || '')
      .input('ContactPhone', ContactPhone || '')
      .query(`
        INSERT INTO Warehouses (WarehouseName, Location, ContactPerson, ContactPhone)
        VALUES (@WarehouseName, @Location, @ContactPerson, @ContactPhone)
        SELECT SCOPE_IDENTITY() AS WarehouseID
      `);
    res.json({ success: true, WarehouseID: result.recordset[0].WarehouseID });
  } catch (error) {
    console.error('Error adding warehouse:', error);
    res.status(500).json({ message: '添加仓库失败' });
  }
};

exports.updateWarehouse = async (req, res) => {
  const { WarehouseID, WarehouseName, Location, ContactPerson, ContactPhone } = req.body;
  try {
    await pool.request()
      .input('WarehouseID', WarehouseID).input('WarehouseName', WarehouseName)
      .input('Location', Location || '').input('ContactPerson', ContactPerson || '').input('ContactPhone', ContactPhone || '')
      .query('UPDATE Warehouses SET WarehouseName = @WarehouseName, Location = @Location, ContactPerson = @ContactPerson, ContactPhone = @ContactPhone WHERE WarehouseID = @WarehouseID');
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating warehouse:', error);
    res.status(500).json({ message: '更新仓库失败' });
  }
};

exports.deleteWarehouse = async (req, res) => {
  const { WarehouseID } = req.params;
  try {
    await pool.request().input('WarehouseID', WarehouseID).query('DELETE FROM Warehouses WHERE WarehouseID = @WarehouseID');
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting warehouse:', error);
    res.status(500).json({ message: '删除仓库失败' });
  }
};

exports.getInboundRecords = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT ib.*, b.BookName, w.WarehouseName
      FROM Inbound ib
      JOIN Books b ON ib.BookID = b.BookID
      LEFT JOIN Warehouses w ON ib.WarehouseID = w.WarehouseID
      ORDER BY ib.InboundDate DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching inbound records:', error);
    res.status(500).json({ message: '获取入库记录失败' });
  }
};

exports.addInbound = async (req, res) => {
  const { BookID, WarehouseID, Quantity, InboundDate, Notes } = req.body;
  if (!BookID || !WarehouseID || !Quantity) {
    return res.status(400).json({ message: '缺少必要参数' });
  }
  try {
    const transaction = new pool.Transaction();
    await transaction.begin();
    try {
      const date = InboundDate || new Date().toISOString().slice(0, 10);
      await transaction.request()
        .input('BookID', BookID).input('WarehouseID', WarehouseID)
        .input('Quantity', Quantity).input('InboundDate', date).input('Notes', Notes || '')
        .query('INSERT INTO Inbound (BookID, WarehouseID, Quantity, InboundDate, Notes) VALUES (@BookID, @WarehouseID, @Quantity, @InboundDate, @Notes)');

      const checkInventory = await transaction.request()
        .input('BookID', BookID).input('WarehouseID', WarehouseID)
        .query('SELECT * FROM Inventory WHERE BookID = @BookID AND WarehouseID = @WarehouseID');

      if (checkInventory.recordset.length > 0) {
        await transaction.request()
          .input('BookID', BookID).input('WarehouseID', WarehouseID).input('Quantity', Quantity)
          .query('UPDATE Inventory SET Quantity = Quantity + @Quantity WHERE BookID = @BookID AND WarehouseID = @WarehouseID');
      } else {
        await transaction.request()
          .input('BookID', BookID).input('WarehouseID', WarehouseID).input('Quantity', Quantity)
          .query('INSERT INTO Inventory (BookID, WarehouseID, Quantity) VALUES (@BookID, @WarehouseID, @Quantity)');
      }
      await transaction.commit();
      res.json({ success: true });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error adding inbound:', error);
    res.status(500).json({ message: '入库失败' });
  }
};

exports.getOutboundRecords = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT ob.*, b.BookName, w.WarehouseName
      FROM Outbound ob
      JOIN Books b ON ob.BookID = b.BookID
      LEFT JOIN Warehouses w ON ob.WarehouseID = w.WarehouseID
      ORDER BY ob.OutboundDate DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching outbound records:', error);
    res.status(500).json({ message: '获取出库记录失败' });
  }
};

exports.addOutbound = async (req, res) => {
  const { BookID, WarehouseID, Quantity, OutboundDate, Notes } = req.body;
  if (!BookID || !WarehouseID || !Quantity) {
    return res.status(400).json({ message: '缺少必要参数' });
  }
  try {
    const transaction = new pool.Transaction();
    await transaction.begin();
    try {
      const stockResult = await transaction.request()
        .input('BookID', BookID).input('WarehouseID', WarehouseID)
        .query('SELECT Quantity FROM Inventory WHERE BookID = @BookID AND WarehouseID = @WarehouseID');

      if (stockResult.recordset.length === 0 || stockResult.recordset[0].Quantity < Quantity) {
        await transaction.rollback();
        return res.status(400).json({ message: '库存不足' });
      }

      const date = OutboundDate || new Date().toISOString().slice(0, 10);
      await transaction.request()
        .input('BookID', BookID).input('WarehouseID', WarehouseID)
        .input('Quantity', Quantity).input('OutboundDate', date).input('Notes', Notes || '')
        .query('INSERT INTO Outbound (BookID, WarehouseID, Quantity, OutboundDate, Notes) VALUES (@BookID, @WarehouseID, @Quantity, @OutboundDate, @Notes)');

      await transaction.request()
        .input('BookID', BookID).input('WarehouseID', WarehouseID).input('Quantity', Quantity)
        .query('UPDATE Inventory SET Quantity = Quantity - @Quantity WHERE BookID = @BookID AND WarehouseID = @WarehouseID');

      await transaction.commit();
      res.json({ success: true });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error adding outbound:', error);
    res.status(500).json({ message: '出库失败' });
  }
};

exports.getInventoryChecks = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT ic.CheckID, ic.CheckDate, w.WarehouseName, ic.CheckStatus, u.Name AS CheckedByName, ic.Notes
      FROM InventoryChecks ic
      JOIN Warehouses w ON ic.WarehouseID = w.WarehouseID
      JOIN Users u ON ic.CheckedBy = u.UserID
      ORDER BY ic.CheckDate DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching inventory checks:', error);
    res.status(500).json({ message: '获取库存盘点失败' });
  }
};

exports.getInventoryCheckDetail = async (req, res) => {
  const { CheckID } = req.params;
  try {
    const checkResult = await pool.request().input('CheckID', CheckID)
      .query('SELECT CheckStatus FROM InventoryChecks WHERE CheckID = @CheckID');
    const detailResult = await pool.request().input('CheckID', CheckID)
      .query(`
        SELECT icd.*, b.BookName
        FROM InventoryCheckDetails icd
        JOIN Books b ON icd.BookID = b.BookID
        WHERE icd.CheckID = @CheckID
      `);
    res.json({ Status: checkResult.recordset[0]?.CheckStatus, Items: detailResult.recordset });
  } catch (error) {
    console.error('Error fetching check detail:', error);
    res.status(500).json({ message: '获取盘点详情失败' });
  }
};

exports.addInventoryCheck = async (req, res) => {
  const { WarehouseID, CheckedBy, Notes } = req.body;
  try {
    const transaction = new pool.Transaction();
    await transaction.begin();
    try {
      const checkResult = await transaction.request()
        .input('WarehouseID', WarehouseID).input('CheckedBy', CheckedBy).input('Notes', Notes || '')
        .query("INSERT INTO InventoryChecks (WarehouseID, CheckStatus, CheckedBy, Notes) VALUES (@WarehouseID, 'Pending', @CheckedBy, @Notes); SELECT SCOPE_IDENTITY() AS CheckID");
      const CheckID = checkResult.recordset[0].CheckID;

      const inventoryResult = await transaction.request()
        .input('WarehouseID', WarehouseID)
        .query('SELECT BookID, Quantity FROM Inventory WHERE WarehouseID = @WarehouseID');

      for (const item of inventoryResult.recordset) {
        await transaction.request()
          .input('CheckID', CheckID).input('BookID', item.BookID).input('Quantity', item.Quantity)
          .query('INSERT INTO InventoryCheckDetails (CheckID, BookID, SystemQuantity, ActualQuantity, Difference) VALUES (@CheckID, @BookID, @Quantity, @Quantity, 0)');
      }
      await transaction.commit();
      res.json({ success: true, CheckID });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error adding inventory check:', error);
    res.status(500).json({ message: '添加库存盘点失败' });
  }
};

exports.updateInventoryCheckDetail = async (req, res) => {
  const { CheckDetailID, ActualQuantity } = req.body;
  try {
    const transaction = new pool.Transaction();
    await transaction.begin();
    try {
      const detailResult = await transaction.request()
        .input('CheckDetailID', CheckDetailID)
        .query('SELECT CheckID, BookID, SystemQuantity FROM InventoryCheckDetails WHERE CheckDetailID = @CheckDetailID');
      if (detailResult.recordset.length === 0) {
        await transaction.rollback();
        return res.status(400).json({ message: '盘点详情不存在' });
      }
      const { SystemQuantity } = detailResult.recordset[0];
      const Difference = ActualQuantity - SystemQuantity;
      await transaction.request()
        .input('CheckDetailID', CheckDetailID).input('ActualQuantity', ActualQuantity).input('Difference', Difference)
        .query('UPDATE InventoryCheckDetails SET ActualQuantity = @ActualQuantity, Difference = @Difference WHERE CheckDetailID = @CheckDetailID');
      await transaction.commit();
      res.json({ success: true });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error updating check detail:', error);
    res.status(500).json({ message: '更新盘点详情失败' });
  }
};

exports.completeInventoryCheck = async (req, res) => {
  const { CheckID } = req.body;
  try {
    const transaction = new pool.Transaction();
    await transaction.begin();
    try {
      const detailsResult = await transaction.request()
        .input('CheckID', CheckID)
        .query('SELECT BookID, ActualQuantity, Difference, WarehouseID FROM InventoryCheckDetails icd JOIN InventoryChecks ic ON icd.CheckID = ic.CheckID WHERE icd.CheckID = @CheckID');
      for (const detail of detailsResult.recordset) {
        if (detail.Difference !== 0) {
          await transaction.request()
            .input('BookID', detail.BookID).input('ActualQuantity', detail.ActualQuantity)
            .query('UPDATE Inventory SET Quantity = @ActualQuantity WHERE BookID = @BookID');
        }
      }
      await transaction.request().input('CheckID', CheckID)
        .query("UPDATE InventoryChecks SET CheckStatus = 'Completed' WHERE CheckID = @CheckID");
      await transaction.commit();
      res.json({ success: true });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error completing check:', error);
    res.status(500).json({ message: '完成库存盘点失败' });
  }
};

exports.deleteInventoryCheck = async (req, res) => {
  const { CheckID } = req.params;
  try {
    await pool.request().input('CheckID', CheckID).query('DELETE FROM InventoryCheckDetails WHERE CheckID = @CheckID');
    await pool.request().input('CheckID', CheckID).query('DELETE FROM InventoryChecks WHERE CheckID = @CheckID');
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting inventory check:', error);
    res.status(500).json({ message: '删除库存盘点失败' });
  }
};