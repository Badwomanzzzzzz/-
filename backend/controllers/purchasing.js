const pool = require('../config/database');

exports.getSuppliers = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT * FROM Suppliers
      ORDER BY SupplierID DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ message: '获取供应商失败' });
  }
};

exports.addSupplier = async (req, res) => {
  const { SupplierName, ContactPerson, ContactPhone, Address, Email } = req.body;
  try {
    const result = await pool.request()
      .input('SupplierName', SupplierName)
      .input('ContactPerson', ContactPerson || '')
      .input('ContactPhone', ContactPhone || '')
      .input('Address', Address || '')
      .input('Email', Email || '')
      .query(`
        INSERT INTO Suppliers (SupplierName, ContactPerson, ContactPhone, Address, Email)
        VALUES (@SupplierName, @ContactPerson, @ContactPhone, @Address, @Email)
        SELECT SCOPE_IDENTITY() AS SupplierID
      `);
    res.json({ success: true, SupplierID: result.recordset[0].SupplierID });
  } catch (error) {
    console.error('Error adding supplier:', error);
    res.status(500).json({ message: '添加供应商失败' });
  }
};

exports.updateSupplier = async (req, res) => {
  const { SupplierID, SupplierName, ContactPerson, ContactPhone, Address, Email } = req.body;
  try {
    await pool.request()
      .input('SupplierID', SupplierID)
      .input('SupplierName', SupplierName)
      .input('ContactPerson', ContactPerson || '')
      .input('ContactPhone', ContactPhone || '')
      .input('Address', Address || '')
      .input('Email', Email || '')
      .query(`
        UPDATE Suppliers
        SET SupplierName = @SupplierName,
            ContactPerson = @ContactPerson,
            ContactPhone = @ContactPhone,
            Address = @Address,
            Email = @Email
        WHERE SupplierID = @SupplierID
      `);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({ message: '更新供应商失败' });
  }
};

exports.deleteSupplier = async (req, res) => {
  const { SupplierID } = req.params;
  try {
    await pool.request()
      .input('SupplierID', SupplierID)
      .query('DELETE FROM Suppliers WHERE SupplierID = @SupplierID');
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ message: '删除供应商失败' });
  }
};

exports.getPurchaseOrders = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT 
        po.PurchaseOrderID, 
        po.OrderNumber, 
        s.SupplierName, 
        b.BookName AS BookTitle, 
        po.Quantity, 
        po.UnitPrice, 
        po.TotalAmount, 
        po.OrderDate, 
        po.ExpectedDeliveryDate, 
        po.Status, 
        u.Name AS CreatedBy
      FROM PurchaseOrders po
      JOIN Suppliers s ON po.SupplierID = s.SupplierID
      JOIN Books b ON po.BookID = b.BookID
      JOIN Users u ON po.CreatedBy = u.UserID
      ORDER BY po.OrderDate DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    res.status(500).json({ message: '获取采购单失败' });
  }
};

exports.addPurchaseOrder = async (req, res) => {
  const { SupplierID, BookID, Quantity, UnitPrice, ExpectedDeliveryDate, CreatedBy } = req.body;
  const TotalAmount = Quantity * UnitPrice;
  const OrderNumber = 'PO' + Date.now();
  try {
    const result = await pool.request()
      .input('OrderNumber', OrderNumber)
      .input('SupplierID', SupplierID)
      .input('BookID', BookID)
      .input('Quantity', Quantity)
      .input('UnitPrice', UnitPrice)
      .input('TotalAmount', TotalAmount)
      .input('ExpectedDeliveryDate', ExpectedDeliveryDate || null)
      .input('CreatedBy', CreatedBy)
      .query(`
        INSERT INTO PurchaseOrders (OrderNumber, SupplierID, BookID, Quantity, UnitPrice, TotalAmount, ExpectedDeliveryDate, CreatedBy)
        VALUES (@OrderNumber, @SupplierID, @BookID, @Quantity, @UnitPrice, @TotalAmount, @ExpectedDeliveryDate, @CreatedBy)
        SELECT SCOPE_IDENTITY() AS PurchaseOrderID
      `);
    await pool.request()
      .input('PurchaseOrderID', result.recordset[0].PurchaseOrderID)
      .input('CreatedBy', CreatedBy)
      .query(`
        INSERT INTO PurchaseProgress (PurchaseOrderID, Status, UpdatedBy)
        VALUES (@PurchaseOrderID, 'Pending', @CreatedBy)
      `);
    res.json({ success: true, PurchaseOrderID: result.recordset[0].PurchaseOrderID });
  } catch (error) {
    console.error('Error adding purchase order:', error);
    res.status(500).json({ message: '添加采购单失败' });
  }
};

exports.updatePurchaseOrder = async (req, res) => {
  const { PurchaseOrderID, SupplierID, BookID, Quantity, UnitPrice, ExpectedDeliveryDate, Status } = req.body;
  const TotalAmount = Quantity * UnitPrice;
  try {
    await pool.request()
      .input('PurchaseOrderID', PurchaseOrderID)
      .input('SupplierID', SupplierID)
      .input('BookID', BookID)
      .input('Quantity', Quantity)
      .input('UnitPrice', UnitPrice)
      .input('TotalAmount', TotalAmount)
      .input('ExpectedDeliveryDate', ExpectedDeliveryDate || null)
      .input('Status', Status)
      .query(`
        UPDATE PurchaseOrders
        SET SupplierID = @SupplierID,
            BookID = @BookID,
            Quantity = @Quantity,
            UnitPrice = @UnitPrice,
            TotalAmount = @TotalAmount,
            ExpectedDeliveryDate = @ExpectedDeliveryDate,
            Status = @Status
        WHERE PurchaseOrderID = @PurchaseOrderID
      `);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating purchase order:', error);
    res.status(500).json({ message: '更新采购单失败' });
  }
};

exports.deletePurchaseOrder = async (req, res) => {
  const { PurchaseOrderID } = req.params;
  try {
    await pool.request()
      .input('PurchaseOrderID', PurchaseOrderID)
      .query('DELETE FROM PurchaseProgress WHERE PurchaseOrderID = @PurchaseOrderID');
    await pool.request()
      .input('PurchaseOrderID', PurchaseOrderID)
      .query('DELETE FROM PurchaseOrders WHERE PurchaseOrderID = @PurchaseOrderID');
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting purchase order:', error);
    res.status(500).json({ message: '删除采购单失败' });
  }
};

exports.getPurchaseProgress = async (req, res) => {
  const { PurchaseOrderID } = req.params;
  try {
    const result = await pool.request()
      .input('PurchaseOrderID', PurchaseOrderID)
      .query(`
        SELECT 
          pp.ProgressID, 
          pp.Status, 
          pp.UpdateDate, 
          pp.Notes, 
          u.Name AS UpdatedBy
        FROM PurchaseProgress pp
        JOIN Users u ON pp.UpdatedBy = u.UserID
        WHERE pp.PurchaseOrderID = @PurchaseOrderID
        ORDER BY pp.UpdateDate DESC
      `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching purchase progress:', error);
    res.status(500).json({ message: '获取采购进度失败' });
  }
};

exports.addPurchaseProgress = async (req, res) => {
  const { PurchaseOrderID, Status, Notes, UpdatedBy } = req.body;
  try {
    await pool.request()
      .input('PurchaseOrderID', PurchaseOrderID)
      .input('Status', Status)
      .input('Notes', Notes || '')
      .input('UpdatedBy', UpdatedBy)
      .query(`
        INSERT INTO PurchaseProgress (PurchaseOrderID, Status, Notes, UpdatedBy)
        VALUES (@PurchaseOrderID, @Status, @Notes, @UpdatedBy)
      `);
    await pool.request()
      .input('PurchaseOrderID', PurchaseOrderID)
      .input('Status', Status)
      .query(`
        UPDATE PurchaseOrders
        SET Status = @Status
        WHERE PurchaseOrderID = @PurchaseOrderID
      `);
    res.json({ success: true });
  } catch (error) {
    console.error('Error adding purchase progress:', error);
    res.status(500).json({ message: '添加采购进度失败' });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT 
        i.InvoiceID, 
        i.InvoiceNumber, 
        po.OrderNumber, 
        i.InvoiceDate, 
        i.Amount, 
        i.Status
      FROM Invoices i
      JOIN PurchaseOrders po ON i.PurchaseOrderID = po.PurchaseOrderID
      ORDER BY i.InvoiceDate DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ message: '获取发票失败' });
  }
};

exports.addInvoice = async (req, res) => {
  const { PurchaseOrderID, InvoiceNumber, InvoiceDate, Amount, Status } = req.body;
  try {
    const result = await pool.request()
      .input('InvoiceNumber', InvoiceNumber)
      .input('PurchaseOrderID', PurchaseOrderID)
      .input('InvoiceDate', InvoiceDate)
      .input('Amount', Amount)
      .input('Status', Status || 'Unpaid')
      .query(`
        INSERT INTO Invoices (InvoiceNumber, PurchaseOrderID, InvoiceDate, Amount, Status)
        VALUES (@InvoiceNumber, @PurchaseOrderID, @InvoiceDate, @Amount, @Status)
        SELECT SCOPE_IDENTITY() AS InvoiceID
      `);
    res.json({ success: true, InvoiceID: result.recordset[0].InvoiceID });
  } catch (error) {
    console.error('Error adding invoice:', error);
    res.status(500).json({ message: '添加发票失败' });
  }
};

exports.updateInvoice = async (req, res) => {
  const { InvoiceID, InvoiceNumber, InvoiceDate, Amount, Status } = req.body;
  try {
    await pool.request()
      .input('InvoiceID', InvoiceID)
      .input('InvoiceNumber', InvoiceNumber)
      .input('InvoiceDate', InvoiceDate)
      .input('Amount', Amount)
      .input('Status', Status)
      .query(`
        UPDATE Invoices
        SET InvoiceNumber = @InvoiceNumber,
            InvoiceDate = @InvoiceDate,
            Amount = @Amount,
            Status = @Status
        WHERE InvoiceID = @InvoiceID
      `);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({ message: '更新发票失败' });
  }
};

exports.deleteInvoice = async (req, res) => {
  const { InvoiceID } = req.params;
  try {
    await pool.request()
      .input('InvoiceID', InvoiceID)
      .query('DELETE FROM Invoices WHERE InvoiceID = @InvoiceID');
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ message: '删除发票失败' });
  }
};