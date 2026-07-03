const pool = require('../config/database');

exports.getBookUsageStats = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT 
        b.BookID,
        b.BookName, 
        b.ISBN, 
        p.PublisherName, 
        bt.TypeName,
        ISNULL(inv.Quantity, 0) AS Stock,
        ISNULL((SELECT SUM(Quantity) FROM PurchaseOrders WHERE BookID = b.BookID), 0) AS Purchased,
        ISNULL((SELECT SUM(Quantity) FROM DistributionRecords WHERE BookID = b.BookID), 0) AS DistTotal
      FROM Books b
      LEFT JOIN Publishers p ON b.PublisherID = p.PublisherID
      LEFT JOIN BookTypes bt ON b.TypeID = bt.TypeID
      LEFT JOIN Inventory inv ON b.BookID = inv.BookID
      ORDER BY b.BookName
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching book usage stats:', error);
    res.status(500).json({ message: '获取统计数据失败' });
  }
};

exports.getClassDistributionStats = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT c.ClassName, m.MajorName, g.GradeName,
        ISNULL(SUM(dr.Quantity), 0) AS TotalDistributed,
        COUNT(DISTINCT dr.StudentID) AS StudentCount
      FROM Classes c
      JOIN Majors m ON c.MajorID = m.MajorID
      JOIN Grades g ON c.GradeID = g.GradeID
      LEFT JOIN Students s ON c.ClassID = s.ClassID
      LEFT JOIN DistributionRecords dr ON s.StudentID = dr.StudentID
      GROUP BY c.ClassName, m.MajorName, g.GradeName
      ORDER BY c.ClassName
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching class distribution stats:', error);
    res.status(500).json({ message: '获取统计数据失败' });
  }
};

exports.getFeeStats = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT sem.SemesterName,
        SUM(bf.Amount) AS TotalAmount,
        SUM(CASE WHEN bf.PaymentStatus = 'Paid' THEN bf.Amount ELSE 0 END) AS PaidAmount,
        SUM(CASE WHEN bf.PaymentStatus = 'Unpaid' THEN bf.Amount ELSE 0 END) AS UnpaidAmount,
        COUNT(*) AS StudentCount
      FROM BookFees bf
      JOIN Semesters sem ON bf.SemesterID = sem.SemesterID
      GROUP BY sem.SemesterName
      ORDER BY sem.SemesterName DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching fee stats:', error);
    res.status(500).json({ message: '获取统计数据失败' });
  }
};

exports.getPurchasingStats = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT s.SupplierName,
        COUNT(po.PurchaseOrderID) AS OrderCount,
        SUM(po.TotalAmount) AS TotalAmount,
        SUM(po.Quantity) AS TotalQuantity,
        SUM(CASE WHEN po.Status = 'Completed' THEN 1 ELSE 0 END) AS CompletedCount
      FROM Suppliers s
      LEFT JOIN PurchaseOrders po ON s.SupplierID = po.SupplierID
      GROUP BY s.SupplierName
      ORDER BY TotalAmount DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching purchasing stats:', error);
    res.status(500).json({ message: '获取统计数据失败' });
  }
};

exports.getInventoryStats = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT w.WarehouseName,
        COUNT(i.InventoryID) AS BookCount,
        SUM(i.Quantity) AS TotalStock,
        SUM(CASE WHEN i.Quantity < 10 THEN 1 ELSE 0 END) AS LowStockCount
      FROM Warehouses w
      LEFT JOIN Inventory i ON w.WarehouseID = i.WarehouseID
      GROUP BY w.WarehouseName
      ORDER BY w.WarehouseName
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching inventory stats:', error);
    res.status(500).json({ message: '获取统计数据失败' });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const bookCount = await pool.request().query('SELECT COUNT(*) AS cnt FROM Books');
    const studentCount = await pool.request().query('SELECT COUNT(*) AS cnt FROM Students');
    const inventoryTotal = await pool.request().query('SELECT ISNULL(SUM(Quantity), 0) AS cnt FROM Inventory');
    const pendingOrders = await pool.request().query("SELECT COUNT(*) AS cnt FROM PurchaseOrders WHERE Status = 'Pending'");

    res.json({
      bookCount: bookCount.recordset[0].cnt,
      studentCount: studentCount.recordset[0].cnt,
      inventoryTotal: inventoryTotal.recordset[0].cnt,
      pendingOrders: pendingOrders.recordset[0].cnt
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: '获取统计数据失败' });
  }
};