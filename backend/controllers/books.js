const pool = require('../config/database');

// 获取教材列表
exports.getBooks = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT b.*, p.PublisherName, bt.TypeName
      FROM Books b
      LEFT JOIN Publishers p ON b.PublisherID = p.PublisherID
      LEFT JOIN BookTypes bt ON b.TypeID = bt.TypeID
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

// 获取单个教材
exports.getBook = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.request()
      .input('id', id)
      .query(`
        SELECT b.*, p.PublisherName, bt.TypeName
        FROM Books b
        LEFT JOIN Publishers p ON b.PublisherID = p.PublisherID
        LEFT JOIN BookTypes bt ON b.TypeID = bt.TypeID
        WHERE b.BookID = @id
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: '教材不存在' });
    }
    
    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

// 添加教材
exports.addBook = async (req, res) => {
  const { BookName, ISBN, Author, PublisherID, TypeID, Price } = req.body;
  
  try {
    // 检查ISBN是否已存在
    const checkISBN = await pool.request()
      .input('ISBN', ISBN)
      .query('SELECT * FROM Books WHERE ISBN = @ISBN');
    
    if (checkISBN.recordset.length > 0) {
      return res.status(400).json({ message: 'ISBN已存在' });
    }
    
    // 插入教材
    const result = await pool.request()
      .input('BookName', BookName)
      .input('ISBN', ISBN)
      .input('Author', Author)
      .input('PublisherID', PublisherID)
      .input('TypeID', TypeID)
      .input('Price', Price)
      .query(`
        INSERT INTO Books (BookName, ISBN, Author, PublisherID, TypeID, Price)
        VALUES (@BookName, @ISBN, @Author, @PublisherID, @TypeID, @Price)
        SELECT SCOPE_IDENTITY() AS BookID
      `);
    
    res.status(201).json({ message: '教材添加成功', BookID: result.recordset[0].BookID });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

// 更新教材
exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const { BookName, ISBN, Author, PublisherID, TypeID, Price } = req.body;
  
  try {
    // 检查教材是否存在
    const checkBook = await pool.request()
      .input('id', id)
      .query('SELECT * FROM Books WHERE BookID = @id');
    
    if (checkBook.recordset.length === 0) {
      return res.status(404).json({ message: '教材不存在' });
    }
    
    // 检查ISBN是否已被其他教材使用
    const checkISBN = await pool.request()
      .input('ISBN', ISBN)
      .input('id', id)
      .query('SELECT * FROM Books WHERE ISBN = @ISBN AND BookID != @id');
    
    if (checkISBN.recordset.length > 0) {
      return res.status(400).json({ message: 'ISBN已存在' });
    }
    
    // 更新教材
    await pool.request()
      .input('id', id)
      .input('BookName', BookName)
      .input('ISBN', ISBN)
      .input('Author', Author)
      .input('PublisherID', PublisherID)
      .input('TypeID', TypeID)
      .input('Price', Price)
      .query(`
        UPDATE Books
        SET BookName = @BookName, ISBN = @ISBN, Author = @Author, PublisherID = @PublisherID, TypeID = @TypeID, Price = @Price
        WHERE BookID = @id
      `);
    
    res.json({ message: '教材更新成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

// 删除教材
exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  
  try {
    // 检查教材是否存在
    const checkBook = await pool.request()
      .input('id', id)
      .query('SELECT * FROM Books WHERE BookID = @id');
    
    if (checkBook.recordset.length === 0) {
      return res.status(404).json({ message: '教材不存在' });
    }
    
    // 删除教材
    await pool.request()
      .input('id', id)
      .query('DELETE FROM Books WHERE BookID = @id');
    
    res.json({ message: '教材删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};
