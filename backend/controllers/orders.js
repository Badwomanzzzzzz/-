const pool = require('../config/database');

// 获取订购列表
exports.getOrders = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT o.*, b.BookName
      FROM Orders o
      JOIN Books b ON o.BookID = b.BookID
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

// 获取单个订购
exports.getOrder = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.request()
      .input('id', id)
      .query(`
        SELECT o.*, b.BookName
        FROM Orders o
        JOIN Books b ON o.BookID = b.BookID
        WHERE o.OrderID = @id
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: '订购不存在' });
    }
    
    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

// 添加订购
exports.addOrder = async (req, res) => {
  const { BookName, OrderQuantity, OrderDate, ExpectedDeliveryDate, OrderStatus } = req.body;
  
  try {
    // 检查教材是否存在
    let checkBook = await pool.request()
      .input('BookName', BookName)
      .query('SELECT * FROM Books WHERE BookName = @BookName');
    
    let BookID;
    
    // 如果教材不存在，创建新教材
    if (checkBook.recordset.length === 0) {
      // 先检查是否存在默认的出版社和教材类型
      let PublisherID = 1; // 默认出版社ID
      let TypeID = 1; // 默认教材类型ID
      
      // 尝试获取第一个出版社
      try {
        const publisherResult = await pool.request().query('SELECT TOP 1 PublisherID FROM Publishers');
        if (publisherResult.recordset.length > 0) {
          PublisherID = publisherResult.recordset[0].PublisherID;
        } else {
          // 如果没有出版社，创建一个默认出版社
          const createPublisherResult = await pool.request()
            .input('PublisherName', '默认出版社')
            .query(`
              INSERT INTO Publishers (PublisherName)
              VALUES (@PublisherName)
              SELECT SCOPE_IDENTITY() AS PublisherID
            `);
          PublisherID = createPublisherResult.recordset[0].PublisherID;
        }
      } catch (error) {
        console.error('获取出版社失败:', error);
      }
      
      // 尝试获取第一个教材类型
      try {
        const typeResult = await pool.request().query('SELECT TOP 1 TypeID FROM BookTypes');
        if (typeResult.recordset.length > 0) {
          TypeID = typeResult.recordset[0].TypeID;
        } else {
          // 如果没有教材类型，创建一个默认教材类型
          const createTypeResult = await pool.request()
            .input('TypeName', '其他')
            .query(`
              INSERT INTO BookTypes (TypeName)
              VALUES (@TypeName)
              SELECT SCOPE_IDENTITY() AS TypeID
            `);
          TypeID = createTypeResult.recordset[0].TypeID;
        }
      } catch (error) {
        console.error('获取教材类型失败:', error);
      }
      
      const createBookResult = await pool.request()
        .input('BookName', BookName)
        .input('ISBN', `ISBN${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`)
        .input('Author', '未知')
        .input('PublisherID', PublisherID)
        .input('TypeID', TypeID)
        .input('Price', 0)
        .query(`
          INSERT INTO Books (BookName, ISBN, Author, PublisherID, TypeID, Price)
          VALUES (@BookName, @ISBN, @Author, @PublisherID, @TypeID, @Price)
          SELECT SCOPE_IDENTITY() AS BookID
        `);
      BookID = createBookResult.recordset[0].BookID;
      checkBook = {
        recordset: [{
          BookID,
          BookName
        }]
      };
    } else {
      BookID = checkBook.recordset[0].BookID;
    }
    
    // 插入订购
    const result = await pool.request()
      .input('BookID', BookID)
      .input('OrderQuantity', OrderQuantity)
      .input('OrderDate', OrderDate)
      .input('ExpectedDeliveryDate', ExpectedDeliveryDate)
      .input('OrderStatus', OrderStatus)
      .query(`
        INSERT INTO Orders (BookID, OrderQuantity, OrderDate, ExpectedDeliveryDate, OrderStatus)
        VALUES (@BookID, @OrderQuantity, @OrderDate, @ExpectedDeliveryDate, @OrderStatus)
        SELECT SCOPE_IDENTITY() AS OrderID
      `);
    
    res.status(201).json({ 
      OrderID: result.recordset[0].OrderID, 
      BookID, 
      BookName, 
      OrderQuantity, 
      OrderDate, 
      ExpectedDeliveryDate, 
      OrderStatus
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

// 更新订购
exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const { BookName, OrderQuantity, OrderDate, ExpectedDeliveryDate, OrderStatus } = req.body;
  
  try {
    // 检查订购是否存在
    const checkOrder = await pool.request()
      .input('id', id)
      .query('SELECT * FROM Orders WHERE OrderID = @id');
    
    if (checkOrder.recordset.length === 0) {
      return res.status(404).json({ message: '订购不存在' });
    }
    
    // 检查教材是否存在
    let checkBook = await pool.request()
      .input('BookName', BookName)
      .query('SELECT * FROM Books WHERE BookName = @BookName');
    
    let BookID;
    
    // 如果教材不存在，创建新教材
    if (checkBook.recordset.length === 0) {
      // 先检查是否存在默认的出版社和教材类型
      let PublisherID = 1; // 默认出版社ID
      let TypeID = 1; // 默认教材类型ID
      
      // 尝试获取第一个出版社
      try {
        const publisherResult = await pool.request().query('SELECT TOP 1 PublisherID FROM Publishers');
        if (publisherResult.recordset.length > 0) {
          PublisherID = publisherResult.recordset[0].PublisherID;
        } else {
          // 如果没有出版社，创建一个默认出版社
          const createPublisherResult = await pool.request()
            .input('PublisherName', '默认出版社')
            .query(`
              INSERT INTO Publishers (PublisherName)
              VALUES (@PublisherName)
              SELECT SCOPE_IDENTITY() AS PublisherID
            `);
          PublisherID = createPublisherResult.recordset[0].PublisherID;
        }
      } catch (error) {
        console.error('获取出版社失败:', error);
      }
      
      // 尝试获取第一个教材类型
      try {
        const typeResult = await pool.request().query('SELECT TOP 1 TypeID FROM BookTypes');
        if (typeResult.recordset.length > 0) {
          TypeID = typeResult.recordset[0].TypeID;
        } else {
          // 如果没有教材类型，创建一个默认教材类型
          const createTypeResult = await pool.request()
            .input('TypeName', '其他')
            .query(`
              INSERT INTO BookTypes (TypeName)
              VALUES (@TypeName)
              SELECT SCOPE_IDENTITY() AS TypeID
            `);
          TypeID = createTypeResult.recordset[0].TypeID;
        }
      } catch (error) {
        console.error('获取教材类型失败:', error);
      }
      
      const createBookResult = await pool.request()
        .input('BookName', BookName)
        .input('ISBN', `ISBN${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`)
        .input('Author', '未知')
        .input('PublisherID', PublisherID)
        .input('TypeID', TypeID)
        .input('Price', 0)
        .query(`
          INSERT INTO Books (BookName, ISBN, Author, PublisherID, TypeID, Price)
          VALUES (@BookName, @ISBN, @Author, @PublisherID, @TypeID, @Price)
          SELECT SCOPE_IDENTITY() AS BookID
        `);
      BookID = createBookResult.recordset[0].BookID;
    } else {
      BookID = checkBook.recordset[0].BookID;
    }
    
    // 更新订购
    await pool.request()
      .input('id', id)
      .input('BookID', BookID)
      .input('OrderQuantity', OrderQuantity)
      .input('OrderDate', OrderDate)
      .input('ExpectedDeliveryDate', ExpectedDeliveryDate)
      .input('OrderStatus', OrderStatus)
      .query(`
        UPDATE Orders
        SET BookID = @BookID, OrderQuantity = @OrderQuantity, OrderDate = @OrderDate, ExpectedDeliveryDate = @ExpectedDeliveryDate, OrderStatus = @OrderStatus
        WHERE OrderID = @id
      `);
    
    res.json({ 
      OrderID: id, 
      BookID, 
      BookName, 
      OrderQuantity, 
      OrderDate, 
      ExpectedDeliveryDate, 
      OrderStatus
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

// 删除订购
exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  
  try {
    // 检查订购是否存在
    const checkOrder = await pool.request()
      .input('id', id)
      .query('SELECT * FROM Orders WHERE OrderID = @id');
    
    if (checkOrder.recordset.length === 0) {
      return res.status(404).json({ message: '订购不存在' });
    }
    
    // 删除订购
    await pool.request()
      .input('id', id)
      .query('DELETE FROM Orders WHERE OrderID = @id');
    
    res.json({ message: '订购删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};