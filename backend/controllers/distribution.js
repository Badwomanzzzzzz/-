const pool = require('../config/database');

exports.getDistributionRecords = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT dr.*, b.BookName, s.StudentName, c.ClassName,
             dl.SemesterID, sem.SemesterName
      FROM DistributionRecords dr
      JOIN Books b ON dr.BookID = b.BookID
      JOIN Students s ON dr.StudentID = s.StudentID
      JOIN DistributionLists dl ON dr.ListID = dl.ListID
      LEFT JOIN Classes c ON dl.ClassID = c.ClassID
      LEFT JOIN Semesters sem ON dl.SemesterID = sem.SemesterID
      ORDER BY dr.DistributionDate DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.getDistributionRecord = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.request()
      .input('id', id)
      .query(`
        SELECT dr.*, b.BookName, s.StudentName, c.ClassName
        FROM DistributionRecords dr
        JOIN Books b ON dr.BookID = b.BookID
        JOIN Students s ON dr.StudentID = s.StudentID
        JOIN DistributionLists dl ON dr.ListID = dl.ListID
        LEFT JOIN Classes c ON dl.ClassID = c.ClassID
        WHERE dr.RecordID = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: '发放记录不存在' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.addDistributionRecord = async (req, res) => {
  const { ListID, StudentID, BookID, Quantity, RecipientName, Status, Notes } = req.body;

  try {
    const checkBook = await pool.request()
      .input('BookID', BookID)
      .query('SELECT * FROM Books WHERE BookID = @BookID');

    if (checkBook.recordset.length === 0) {
      return res.status(404).json({ message: '教材不存在' });
    }

    const checkStudent = await pool.request()
      .input('StudentID', StudentID)
      .query('SELECT * FROM Students WHERE StudentID = @StudentID');

    if (checkStudent.recordset.length === 0) {
      return res.status(404).json({ message: '学生不存在' });
    }

    const checkInventory = await pool.request()
      .input('BookID', BookID)
      .query('SELECT * FROM Inventory WHERE BookID = @BookID');

    if (checkInventory.recordset.length === 0 || checkInventory.recordset[0].Quantity < (Quantity || 1)) {
      return res.status(400).json({ message: '库存不足' });
    }

    const transaction = new pool.Transaction();
    await transaction.begin();

    try {
      const result = await transaction.request()
        .input('ListID', ListID)
        .input('StudentID', StudentID)
        .input('BookID', BookID)
        .input('Quantity', Quantity || 1)
        .input('RecipientName', RecipientName || checkStudent.recordset[0].StudentName)
        .input('Status', Status || 'Completed')
        .input('Notes', Notes || '')
        .query(`
          INSERT INTO DistributionRecords (ListID, StudentID, BookID, Quantity, RecipientName, Status, Notes)
          VALUES (@ListID, @StudentID, @BookID, @Quantity, @RecipientName, @Status, @Notes)
          SELECT SCOPE_IDENTITY() AS RecordID
        `);

      await transaction.request()
        .input('BookID', BookID)
        .input('Quantity', Quantity || 1)
        .query('UPDATE Inventory SET Quantity = Quantity - @Quantity WHERE BookID = @BookID');

      await transaction.commit();

      res.status(201).json({
        RecordID: result.recordset[0].RecordID,
        ListID, StudentID, BookID, Quantity: Quantity || 1,
        RecipientName: RecipientName || checkStudent.recordset[0].StudentName,
        Status: Status || 'Completed', Notes
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.updateDistributionRecord = async (req, res) => {
  const { id } = req.params;
  const { Status, Notes } = req.body;

  try {
    const checkRecord = await pool.request()
      .input('id', id)
      .query('SELECT * FROM DistributionRecords WHERE RecordID = @id');

    if (checkRecord.recordset.length === 0) {
      return res.status(404).json({ message: '发放记录不存在' });
    }

    await pool.request()
      .input('id', id)
      .input('Status', Status)
      .input('Notes', Notes || '')
      .query('UPDATE DistributionRecords SET Status = @Status, Notes = @Notes WHERE RecordID = @id');

    res.json({ message: '发放记录更新成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.deleteDistributionRecord = async (req, res) => {
  const { id } = req.params;

  try {
    const checkRecord = await pool.request()
      .input('id', id)
      .query('SELECT * FROM DistributionRecords WHERE RecordID = @id');

    if (checkRecord.recordset.length === 0) {
      return res.status(404).json({ message: '发放记录不存在' });
    }

    const transaction = new pool.Transaction();
    await transaction.begin();

    try {
      await transaction.request()
        .input('id', id)
        .query(`
          UPDATE Inventory
          SET Quantity = Quantity + (SELECT Quantity FROM DistributionRecords WHERE RecordID = @id)
          WHERE BookID = (SELECT BookID FROM DistributionRecords WHERE RecordID = @id)
        `);

      await transaction.request()
        .input('id', id)
        .query('DELETE FROM DistributionRecords WHERE RecordID = @id');

      await transaction.commit();

      res.json({ message: '发放记录删除成功' });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.generateClassDistributionList = async (req, res) => {
  const { SemesterID, ClassID, CourseID, BookID, CreatedBy } = req.body;

  try {
    const students = await pool.request()
      .input('ClassID', ClassID)
      .query('SELECT StudentID, StudentName FROM Students WHERE ClassID = @ClassID');

    if (students.recordset.length === 0) {
      return res.status(404).json({ message: '班级无学生' });
    }

    const checkBook = await pool.request()
      .input('BookID', BookID)
      .query('SELECT * FROM Books WHERE BookID = @BookID');

    if (checkBook.recordset.length === 0) {
      return res.status(404).json({ message: '教材不存在' });
    }

    const checkInventory = await pool.request()
      .input('BookID', BookID)
      .query('SELECT * FROM Inventory WHERE BookID = @BookID');

    if (checkInventory.recordset.length === 0 || checkInventory.recordset[0].Quantity < students.recordset.length) {
      return res.status(400).json({ message: '库存不足' });
    }

    const listResult = await pool.request()
      .input('SemesterID', SemesterID)
      .input('ClassID', ClassID)
      .input('CourseID', CourseID)
      .input('BookID', BookID)
      .input('CreatedBy', CreatedBy || 1)
      .query(`
        INSERT INTO DistributionLists (SemesterID, ClassID, CourseID, BookID, Status, CreatedBy)
        VALUES (@SemesterID, @ClassID, @CourseID, @BookID, 'Pending', @CreatedBy)
        SELECT SCOPE_IDENTITY() AS ListID
      `);

    const ListID = listResult.recordset[0].ListID;

    const distributionList = students.recordset.map(student => ({
      ListID,
      StudentID: student.StudentID,
      StudentName: student.StudentName,
      BookID,
      BookName: checkBook.recordset[0].BookName,
      Status: '待发放'
    }));

    res.json({ ListID, items: distributionList });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.getDistributionLists = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT dl.*, s.SemesterName, c.ClassName, co.CourseName, b.BookName, u.Name AS CreatedByName
      FROM DistributionLists dl
      JOIN Semesters s ON dl.SemesterID = s.SemesterID
      JOIN Classes c ON dl.ClassID = c.ClassID
      JOIN Courses co ON dl.CourseID = co.CourseID
      JOIN Books b ON dl.BookID = b.BookID
      LEFT JOIN Users u ON dl.CreatedBy = u.UserID
      ORDER BY dl.DistributionDate DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.deleteDistributionList = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.request()
      .input('id', id)
      .query('DELETE FROM DistributionRecords WHERE ListID = @id');
    await pool.request()
      .input('id', id)
      .query('DELETE FROM DistributionLists WHERE ListID = @id');
    res.json({ message: '发放清单删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};