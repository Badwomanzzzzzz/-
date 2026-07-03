const pool = require('../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// 用户登录
exports.login = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // 查找用户
    const result = await pool.request()
      .input('username', username)
      .query('SELECT * FROM Users WHERE Username = @username');
    
    if (result.recordset.length === 0) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }
    
    const user = result.recordset[0];
    
    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }
    
    // 获取用户角色
    const roleResult = await pool.request()
      .input('userID', user.UserID)
      .query(`
        SELECT r.RoleName 
        FROM UserRoles ur 
        JOIN Roles r ON ur.RoleID = r.RoleID 
        WHERE ur.UserID = @userID
      `);
    
    const roles = roleResult.recordset.map(role => role.RoleName);
    
    // 生成JWT令牌
    const token = jwt.sign({ id: user.UserID, username: user.Username, roles }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ token, user: { id: user.UserID, username: user.Username, name: user.Name, email: user.Email, roles } });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

// 用户注册
exports.register = async (req, res) => {
  const { username, password, name, email, phone } = req.body;
  
  try {
    // 检查用户名是否已存在
    const checkUser = await pool.request()
      .input('username', username)
      .query('SELECT * FROM Users WHERE Username = @username');
    
    if (checkUser.recordset.length > 0) {
      return res.status(400).json({ message: '用户名已存在' });
    }
    
    // 检查邮箱是否已存在
    const checkEmail = await pool.request()
      .input('email', email)
      .query('SELECT * FROM Users WHERE Email = @email');
    
    if (checkEmail.recordset.length > 0) {
      return res.status(400).json({ message: '邮箱已存在' });
    }
    
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 插入用户并获取用户ID
    const result = await pool.request()
      .input('username', username)
      .input('password', hashedPassword)
      .input('name', name)
      .input('email', email)
      .input('phone', phone)
      .query('INSERT INTO Users (Username, Password, Name, Email, Phone) VALUES (@username, @password, @name, @email, @phone); SELECT SCOPE_IDENTITY() as UserID');
    
    const userID = result.recordset[0].UserID;
    
    // 为新用户添加学生角色（默认普通用户）
    await pool.request()
      .input('userID', userID)
      .input('roleID', 3) // 3 是学生角色ID
      .query('INSERT INTO UserRoles (UserID, RoleID) VALUES (@userID, @roleID)');
    
    res.status(201).json({ message: '注册成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};
