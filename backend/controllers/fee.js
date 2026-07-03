const pool = require('../config/database');

// 获取教材费记录列表
exports.getFeeRecords = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT f.*, s.StudentName, c.ClassName
      FROM BookFees f
      JOIN Students s ON f.StudentID = s.StudentID
      JOIN Classes c ON s.ClassID = c.ClassID
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

// 获取单个教材费记录
exports.getFeeRecord = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.request()
      .input('id', id)
      .query(`
        SELECT f.*, s.StudentName, c.ClassName
        FROM BookFees f
        JOIN Students s ON f.StudentID = s.StudentID
        JOIN Classes c ON s.ClassID = c.ClassID
        WHERE f.FeeID = @id
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: '教材费记录不存在' });
    }
    
    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

// 添加教材费记录
exports.addFeeRecord = async (req, res) => {
  const { StudentID, SemesterID, Amount, PaymentDate, PaymentStatus } = req.body;
  console.log('添加费用记录请求:', req.body);
  
  try {
    // 检查学生是否存在
    const checkStudent = await pool.request()
      .input('StudentID', StudentID)
      .query('SELECT * FROM Students WHERE StudentID = @StudentID');
    
    if (checkStudent.recordset.length === 0) {
      return res.status(404).json({ message: '学生不存在' });
    }
    
    // 插入教材费记录
    const result = await pool.request()
      .input('StudentID', StudentID)
      .input('SemesterID', SemesterID)
      .input('Amount', Amount)
      .input('PaymentDate', PaymentDate)
      .input('PaymentStatus', PaymentStatus || 'Unpaid')
      .query(`
        INSERT INTO BookFees (StudentID, SemesterID, Amount, PaymentStatus, PaymentDate)
        VALUES (@StudentID, @SemesterID, @Amount, @PaymentStatus, @PaymentDate)
        SELECT SCOPE_IDENTITY() AS FeeID
      `);
    
    res.status(201).json({ 
      FeeID: result.recordset[0].FeeID, 
      StudentID, 
      SemesterID, 
      Amount, 
      PaymentDate, 
      PaymentStatus: PaymentStatus || 'Unpaid'
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

// 更新教材费记录
exports.updateFeeRecord = async (req, res) => {
  const { id } = req.params;
  const { SemesterID, Amount, PaymentDate, PaymentStatus } = req.body;
  console.log('更新费用记录请求:', { id, ...req.body });
  
  try {
    // 检查教材费记录是否存在
    const checkRecord = await pool.request()
      .input('id', id)
      .query('SELECT * FROM BookFees WHERE FeeID = @id');
    
    if (checkRecord.recordset.length === 0) {
      return res.status(404).json({ message: '教材费记录不存在' });
    }
    
    // 更新教材费记录
    await pool.request()
      .input('id', id)
      .input('SemesterID', SemesterID)
      .input('Amount', Amount)
      .input('PaymentDate', PaymentDate)
      .input('PaymentStatus', PaymentStatus)
      .query(`
        UPDATE BookFees
        SET SemesterID = @SemesterID, Amount = @Amount, PaymentDate = @PaymentDate, PaymentStatus = @PaymentStatus
        WHERE FeeID = @id
      `);
    
    res.json({ message: '教材费记录更新成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

// 删除教材费记录
exports.deleteFeeRecord = async (req, res) => {
  const { id } = req.params;
  
  try {
    // 检查教材费记录是否存在
    const checkRecord = await pool.request()
      .input('id', id)
      .query('SELECT * FROM BookFees WHERE FeeID = @id');
    
    if (checkRecord.recordset.length === 0) {
      return res.status(404).json({ message: '教材费记录不存在' });
    }
    
    // 删除教材费记录
    await pool.request()
      .input('id', id)
      .query('DELETE FROM BookFees WHERE FeeID = @id');
    
    res.json({ message: '教材费记录删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

// 按学期结算教材费
exports.settleSemesterFees = async (req, res) => {
  const { SemesterID } = req.body;
  
  try {
    // 获取该学期的所有学生
    const students = await pool.request()
      .query('SELECT StudentID FROM Students');
    
    if (students.recordset.length === 0) {
      return res.status(404).json({ message: '没有学生记录' });
    }
    
    // 按学生结算教材费
    for (const student of students.recordset) {
      // 这里可以根据实际业务逻辑计算教材费
      // 暂时使用模拟数据
      const amount = Math.floor(Math.random() * 500) + 100;
      
      // 检查是否已经存在该学期的教材费记录
      const checkRecord = await pool.request()
        .input('StudentID', student.StudentID)
        .input('SemesterID', SemesterID)
        .query('SELECT * FROM BookFees WHERE StudentID = @StudentID AND SemesterID = @SemesterID');
      
      if (checkRecord.recordset.length === 0) {
        // 插入新的教材费记录
        await pool.request()
          .input('StudentID', student.StudentID)
          .input('SemesterID', SemesterID)
          .input('Amount', amount)
          .input('PaymentDate', new Date().toISOString())
          .input('PaymentStatus', '待缴费')
          .query(`
            INSERT INTO BookFees (StudentID, SemesterID, Amount, PaymentStatus, PaymentDate)
            VALUES (@StudentID, @SemesterID, @Amount, @PaymentStatus, @PaymentDate)
          `);
      }
    }
    
    res.json({ message: '学期教材费结算成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};