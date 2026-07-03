const pool = require('../config/database');

// 获取旧教材回收记录列表
exports.getUsedBookRecords = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT u.*, b.BookName, s.StudentName, c.ClassName
      FROM UsedBookRecycling u
      JOIN Books b ON u.BookID = b.BookID
      JOIN Students s ON u.StudentID = s.StudentID
      JOIN Classes c ON s.ClassID = c.ClassID
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

// 获取单个旧教材回收记录
exports.getUsedBookRecord = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.request()
      .input('id', id)
      .query(`
        SELECT u.*, b.BookName, s.StudentName, c.ClassName
        FROM UsedBookRecycling u
        JOIN Books b ON u.BookID = b.BookID
        JOIN Students s ON u.StudentID = s.StudentID
        JOIN Classes c ON s.ClassID = c.ClassID
        WHERE u.RecyclingID = @id
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: '旧教材记录不存在' });
    }
    
    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

// 添加旧教材回收记录
exports.addUsedBookRecord = async (req, res) => {
  const { BookID, StudentID, RecyclingDate, Condition, Quantity, Status, CreatedBy } = req.body;
  
  try {
    // 检查教材是否存在
    const checkBook = await pool.request()
      .input('BookID', BookID)
      .query('SELECT * FROM Books WHERE BookID = @BookID');
    
    if (checkBook.recordset.length === 0) {
      return res.status(404).json({ message: '教材不存在' });
    }
    
    // 检查学生是否存在
    const checkStudent = await pool.request()
      .input('StudentID', StudentID)
      .query('SELECT * FROM Students WHERE StudentID = @StudentID');
    
    if (checkStudent.recordset.length === 0) {
      return res.status(404).json({ message: '学生不存在' });
    }
    
    // 插入旧教材回收记录
    const result = await pool.request()
      .input('BookID', BookID)
      .input('StudentID', StudentID)
      .input('RecyclingDate', RecyclingDate || new Date())
      .input('Condition', Condition)
      .input('Quantity', Quantity || 1)
      .input('Status', Status || 'Pending')
      .input('CreatedBy', CreatedBy || 1)
      .query(`
        INSERT INTO UsedBookRecycling (BookID, StudentID, RecyclingDate, Condition, Quantity, Status, CreatedBy)
        VALUES (@BookID, @StudentID, @RecyclingDate, @Condition, @Quantity, @Status, @CreatedBy)
        SELECT SCOPE_IDENTITY() AS RecyclingID
      `);
    
    res.status(201).json({ 
      RecyclingID: result.recordset[0].RecyclingID, 
      BookID, 
      StudentID, 
      RecyclingDate: RecyclingDate || new Date(), 
      Condition, 
      Quantity: Quantity || 1, 
      Status: Status || 'Pending', 
      CreatedBy: CreatedBy || 1
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

// 更新旧教材回收记录
exports.updateUsedBookRecord = async (req, res) => {
  const { id } = req.params;
  const { Condition, Status, Notes } = req.body;
  
  try {
    // 检查旧教材记录是否存在
    const checkRecord = await pool.request()
      .input('id', id)
      .query('SELECT * FROM UsedBookRecycling WHERE RecyclingID = @id');
    
    if (checkRecord.recordset.length === 0) {
      return res.status(404).json({ message: '旧教材记录不存在' });
    }
    
    // 更新旧教材记录
    await pool.request()
      .input('id', id)
      .input('Condition', Condition)
      .input('Status', Status)
      .query(`
        UPDATE UsedBookRecycling
        SET Condition = @Condition, Status = @Status
        WHERE RecyclingID = @id
      `);
    
    res.json({ message: '旧教材记录更新成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

// 删除旧教材回收记录
exports.deleteUsedBookRecord = async (req, res) => {
  const { id } = req.params;
  
  try {
    // 检查旧教材记录是否存在
    const checkRecord = await pool.request()
      .input('id', id)
      .query('SELECT * FROM UsedBookRecycling WHERE RecyclingID = @id');
    
    if (checkRecord.recordset.length === 0) {
      return res.status(404).json({ message: '旧教材记录不存在' });
    }
    
    // 删除旧教材记录
    await pool.request()
      .input('id', id)
      .query('DELETE FROM UsedBookRecycling WHERE RecyclingID = @id');
    
    res.json({ message: '旧教材记录删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

// 获取旧教材发放记录列表
exports.getUsedBookDistributionRecords = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT d.*, b.BookName, s.StudentName, c.ClassName
      FROM UsedBookDistribution d
      JOIN Books b ON d.BookID = b.BookID
      JOIN Students s ON d.StudentID = s.StudentID
      JOIN Classes c ON s.ClassID = c.ClassID
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

// 添加旧教材发放记录
exports.addUsedBookDistributionRecord = async (req, res) => {
  const { StudentID, BookID, Quantity, DistributionDate, Price, Status, CreatedBy } = req.body;
  
  try {
    // 检查教材是否存在
    const checkBook = await pool.request()
      .input('BookID', BookID)
      .query('SELECT * FROM Books WHERE BookID = @BookID');
    
    if (checkBook.recordset.length === 0) {
      return res.status(404).json({ message: '教材不存在' });
    }
    
    // 检查学生是否存在
    const checkStudent = await pool.request()
      .input('StudentID', StudentID)
      .query('SELECT * FROM Students WHERE StudentID = @StudentID');
    
    if (checkStudent.recordset.length === 0) {
      return res.status(404).json({ message: '学生不存在' });
    }
    
    // 插入旧教材发放记录
    const result = await pool.request()
      .input('StudentID', StudentID)
      .input('BookID', BookID)
      .input('Quantity', Quantity || 1)
      .input('DistributionDate', DistributionDate || new Date())
      .input('Price', Price || 0)
      .input('Status', Status || 'Completed')
      .input('CreatedBy', CreatedBy || 1)
      .query(`
        INSERT INTO UsedBookDistribution (StudentID, BookID, Quantity, DistributionDate, Price, Status, CreatedBy)
        VALUES (@StudentID, @BookID, @Quantity, @DistributionDate, @Price, @Status, @CreatedBy)
        SELECT SCOPE_IDENTITY() AS UsedDistributionID
      `);
    
    res.status(201).json({ 
      UsedDistributionID: result.recordset[0].UsedDistributionID, 
      StudentID, 
      BookID, 
      Quantity: Quantity || 1, 
      DistributionDate: DistributionDate || new Date(), 
      Price: Price || 0, 
      Status: Status || 'Completed', 
      CreatedBy: CreatedBy || 1
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};