const pool = require('../config/database');
const bcrypt = require('bcryptjs');

exports.getUsers = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT u.UserID, u.Username, u.Name, u.Email, u.Phone, u.CreatedAt,
        STUFF((SELECT ',' + r.RoleName FROM UserRoles ur JOIN Roles r ON ur.RoleID = r.RoleID WHERE ur.UserID = u.UserID FOR XML PATH('')), 1, 1, '') AS Roles
      FROM Users u ORDER BY u.UserID
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.request().input('id', id)
      .query('SELECT UserID, Username, Name, Email, Phone, CreatedAt FROM Users WHERE UserID = @id');
    if (result.recordset.length === 0) return res.status(404).json({ message: '用户不存在' });
    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.createUser = async (req, res) => {
  const { Username, Password, Name, Email, Phone, RoleIDs } = req.body;
  try {
    const checkUser = await pool.request().input('Username', Username)
      .query('SELECT * FROM Users WHERE Username = @Username');
    if (checkUser.recordset.length > 0) return res.status(400).json({ message: '用户名已存在' });

    const hashedPassword = await bcrypt.hash(Password, 10);
    const result = await pool.request()
      .input('Username', Username).input('Password', hashedPassword).input('Name', Name)
      .input('Email', Email || '').input('Phone', Phone || '')
      .query('INSERT INTO Users (Username, Password, Name, Email, Phone) VALUES (@Username, @Password, @Name, @Email, @Phone); SELECT SCOPE_IDENTITY() AS UserID');
    const userID = result.recordset[0].UserID;

    if (RoleIDs && RoleIDs.length > 0) {
      for (const roleID of RoleIDs) {
        await pool.request().input('UserID', userID).input('RoleID', roleID)
          .query('INSERT INTO UserRoles (UserID, RoleID) VALUES (@UserID, @RoleID)');
      }
    }

    res.status(201).json({ UserID: userID, message: '创建成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { Name, Email, Phone, Password, RoleIDs } = req.body;
  try {
    if (Password) {
      const hashedPassword = await bcrypt.hash(Password, 10);
      await pool.request().input('id', id).input('Password', hashedPassword)
        .query('UPDATE Users SET Password = @Password WHERE UserID = @id');
    }
    await pool.request().input('id', id).input('Name', Name).input('Email', Email || '').input('Phone', Phone || '')
      .query('UPDATE Users SET Name = @Name, Email = @Email, Phone = @Phone WHERE UserID = @id');

    if (RoleIDs) {
      await pool.request().input('UserID', id).query('DELETE FROM UserRoles WHERE UserID = @UserID');
      for (const roleID of RoleIDs) {
        await pool.request().input('UserID', id).input('RoleID', roleID)
          .query('INSERT INTO UserRoles (UserID, RoleID) VALUES (@UserID, @RoleID)');
      }
    }

    res.json({ message: '更新成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.request().input('UserID', id).query('DELETE FROM UserRoles WHERE UserID = @UserID');
    await pool.request().input('id', id).query('DELETE FROM Users WHERE UserID = @id');
    res.json({ message: '删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.getRoles = async (req, res) => {
  try {
    const result = await pool.request().query('SELECT * FROM Roles ORDER BY RoleID');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.createRole = async (req, res) => {
  const { RoleName } = req.body;
  try {
    const result = await pool.request().input('RoleName', RoleName)
      .query('INSERT INTO Roles (RoleName) VALUES (@RoleName); SELECT SCOPE_IDENTITY() AS RoleID');
    res.status(201).json({ RoleID: result.recordset[0].RoleID, RoleName });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.updateRole = async (req, res) => {
  const { id } = req.params;
  const { RoleName } = req.body;
  try {
    await pool.request().input('id', id).input('RoleName', RoleName)
      .query('UPDATE Roles SET RoleName = @RoleName WHERE RoleID = @id');
    res.json({ message: '更新成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.deleteRole = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.request().input('RoleID', id).query('DELETE FROM RoleMenus WHERE RoleID = @RoleID');
    await pool.request().input('RoleID', id).query('DELETE FROM UserRoles WHERE RoleID = @RoleID');
    await pool.request().input('id', id).query('DELETE FROM Roles WHERE RoleID = @id');
    res.json({ message: '删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.getRoleMenus = async (req, res) => {
  const { roleID } = req.params;
  try {
    const result = await pool.request().input('RoleID', roleID).query(`
      SELECT m.MenuID, m.MenuName, m.MenuPath, m.ParentID, m.Icon, m.OrderIndex,
        ISNULL(rm.CanAccess, 0) AS CanAccess
      FROM Menus m
      LEFT JOIN RoleMenus rm ON m.MenuID = rm.MenuID AND rm.RoleID = @RoleID
      ORDER BY m.OrderIndex
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.updateRoleMenus = async (req, res) => {
  const { roleID } = req.params;
  const { menuIds } = req.body;
  try {
    await pool.request().input('RoleID', roleID).query('DELETE FROM RoleMenus WHERE RoleID = @RoleID');
    if (menuIds && menuIds.length > 0) {
      for (const menuID of menuIds) {
        await pool.request().input('RoleID', roleID).input('MenuID', menuID)
          .query('INSERT INTO RoleMenus (RoleID, MenuID, CanAccess) VALUES (@RoleID, @MenuID, 1)');
      }
    }
    res.json({ message: '权限更新成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.getMenus = async (req, res) => {
  try {
    const result = await pool.request().query('SELECT * FROM Menus ORDER BY OrderIndex');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT ol.*, u.Name AS UserName FROM OperationLogs ol
      JOIN Users u ON ol.UserID = u.UserID
      ORDER BY ol.OperationDate DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userID = req.user.id;
  try {
    const userResult = await pool.request().input('UserID', userID)
      .query('SELECT * FROM Users WHERE UserID = @UserID');
    if (userResult.recordset.length === 0) return res.status(404).json({ message: '用户不存在' });

    const user = userResult.recordset[0];
    let isMatch;
    if (user.Username === 'admin' && user.Password === 'admin123') {
      isMatch = (oldPassword === 'admin123');
    } else {
      isMatch = await bcrypt.compare(oldPassword, user.Password);
    }

    if (!isMatch) return res.status(400).json({ message: '原密码错误' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.request().input('UserID', userID).input('Password', hashedPassword)
      .query('UPDATE Users SET Password = @Password WHERE UserID = @UserID');

    res.json({ message: '密码修改成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.getUserRoles = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.request().input('UserID', id).query(`
      SELECT r.RoleID, r.RoleName FROM UserRoles ur
      JOIN Roles r ON ur.RoleID = r.RoleID WHERE ur.UserID = @UserID
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};