-- 数据库迁移脚本：添加用户相关表结构

-- 用户表
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(50) NOT NULL UNIQUE,
    Password NVARCHAR(100) NOT NULL,
    Name NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    Phone NVARCHAR(20),
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- 角色表
CREATE TABLE Roles (
    RoleID INT PRIMARY KEY IDENTITY(1,1),
    RoleName NVARCHAR(50) NOT NULL UNIQUE
);

-- 用户角色关联表
CREATE TABLE UserRoles (
    UserRoleID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    RoleID INT NOT NULL,
    CONSTRAINT FK_UserRoles_User FOREIGN KEY (UserID) REFERENCES Users(UserID),
    CONSTRAINT FK_UserRoles_Role FOREIGN KEY (RoleID) REFERENCES Roles(RoleID)
);

-- 教材评价表
CREATE TABLE BookRatings (
    RatingID INT PRIMARY KEY IDENTITY(1,1),
    BookID INT NOT NULL,
    UserID INT NOT NULL,
    Rating INT NOT NULL CHECK (Rating BETWEEN 1 AND 5),
    Comment NVARCHAR(500),
    RatingDate DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_BookRatings_Book FOREIGN KEY (BookID) REFERENCES Books(BookID),
    CONSTRAINT FK_BookRatings_User FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- 通知表
CREATE TABLE Notifications (
    NotificationID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT,
    Title NVARCHAR(100) NOT NULL,
    Content NVARCHAR(500) NOT NULL,
    IsRead BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Notifications_User FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- 插入默认角色
INSERT INTO Roles (RoleName) VALUES ('管理员'), ('教师'), ('学生');

-- 插入默认管理员用户（密码：admin123）
INSERT INTO Users (Username, Password, Name, Email, Phone)
VALUES ('admin', 'admin123', '管理员', 'admin@example.com', '13800138000');

-- 关联管理员角色
INSERT INTO UserRoles (UserID, RoleID) VALUES (1, 1);
