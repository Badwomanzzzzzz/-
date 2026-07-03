-- 高校教材管理系统数据库表结构

-- 出版社表
CREATE TABLE Publishers (
    PublisherID INT PRIMARY KEY IDENTITY(1,1),
    PublisherName NVARCHAR(100) NOT NULL,
    ContactPerson NVARCHAR(50),
    ContactPhone NVARCHAR(20),
    Address NVARCHAR(200),
    Email NVARCHAR(100)
);
GO

-- 教材类型表
CREATE TABLE BookTypes (
    TypeID INT PRIMARY KEY IDENTITY(1,1),
    TypeName NVARCHAR(50) NOT NULL UNIQUE
);
GO

-- 教材表
CREATE TABLE Books (
    BookID INT PRIMARY KEY IDENTITY(1,1),
    BookName NVARCHAR(100) NOT NULL,
    ISBN NVARCHAR(20) NOT NULL UNIQUE,
    Author NVARCHAR(100),
    PublisherID INT,
    TypeID INT,
    Price DECIMAL(10,2) NOT NULL,
    CONSTRAINT FK_Books_Publisher FOREIGN KEY (PublisherID) REFERENCES Publishers(PublisherID),
    CONSTRAINT FK_Books_Type FOREIGN KEY (TypeID) REFERENCES BookTypes(TypeID),
    CONSTRAINT CK_Books_ISBN CHECK (ISBN LIKE 'ISBN[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]')
);
GO

-- 库存表
CREATE TABLE Inventory (
    InventoryID INT PRIMARY KEY IDENTITY(1,1),
    BookID INT NOT NULL,
    Quantity INT NOT NULL DEFAULT 0,
    CONSTRAINT FK_Inventory_Book FOREIGN KEY (BookID) REFERENCES Books(BookID),
    CONSTRAINT UK_Inventory_Book UNIQUE (BookID)
);
GO

-- 订购表
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY IDENTITY(1,1),
    BookID INT NOT NULL,
    OrderQuantity INT NOT NULL,
    OrderDate DATETIME NOT NULL DEFAULT GETDATE(),
    ExpectedDeliveryDate DATETIME,
    OrderStatus NVARCHAR(20) DEFAULT 'Pending',
    CONSTRAINT FK_Orders_Book FOREIGN KEY (BookID) REFERENCES Books(BookID)
);
GO

-- 入库表
CREATE TABLE Inbound (
    InboundID INT PRIMARY KEY IDENTITY(1,1),
    BookID INT NOT NULL,
    Quantity INT NOT NULL,
    InboundDate DATETIME NOT NULL DEFAULT GETDATE(),
    Supplier NVARCHAR(100),
    OrderID INT,
    CONSTRAINT FK_Inbound_Book FOREIGN KEY (BookID) REFERENCES Books(BookID),
    CONSTRAINT FK_Inbound_Order FOREIGN KEY (OrderID) REFERENCES Orders(OrderID)
);
GO

-- 领用表
CREATE TABLE Outbound (
    OutboundID INT PRIMARY KEY IDENTITY(1,1),
    BookID INT NOT NULL,
    Quantity INT NOT NULL,
    OutboundDate DATETIME NOT NULL DEFAULT GETDATE(),
    Recipient NVARCHAR(100),
    Purpose NVARCHAR(200),
    CONSTRAINT FK_Outbound_Book FOREIGN KEY (BookID) REFERENCES Books(BookID)
);
GO
