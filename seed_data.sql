-- 高校教材管理系统 完整种子数据脚本（先清理后填充）

-- ========================================
-- 修复表结构缺失列
-- ========================================
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Inbound') AND name = 'WarehouseID')
BEGIN
    ALTER TABLE Inbound ADD WarehouseID INT NULL;
    ALTER TABLE Inbound ADD CONSTRAINT FK_Inbound_Warehouse FOREIGN KEY (WarehouseID) REFERENCES Warehouses(WarehouseID);
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Inbound') AND name = 'Notes')
BEGIN
    ALTER TABLE Inbound ADD Notes NVARCHAR(500) NULL;
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Outbound') AND name = 'WarehouseID')
BEGIN
    ALTER TABLE Outbound ADD WarehouseID INT NULL;
    ALTER TABLE Outbound ADD CONSTRAINT FK_Outbound_Warehouse FOREIGN KEY (WarehouseID) REFERENCES Warehouses(WarehouseID);
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Outbound') AND name = 'Notes')
BEGIN
    ALTER TABLE Outbound ADD Notes NVARCHAR(500) NULL;
END
GO

-- ========================================
-- 清理旧种子数据（按外键依赖逆序删除）
-- ========================================
-- 注意：保留Roles, Users, UserRoles (认证需要), Departments, Majors, Grades, Classes, Teachers, Courses, Semesters, Warehouses, Suppliers (基础数据)
DELETE FROM OperationLogs;
DELETE FROM UsedBookDistribution;
DELETE FROM UsedBookPricing;
DELETE FROM UsedBookRecycling;
DELETE FROM RefundRecords;
DELETE FROM FeeSettlements;
DELETE FROM BookFees;
DELETE FROM DistributionRecords;
DELETE FROM DistributionLists;
DELETE FROM InventoryCheckDetails;
DELETE FROM InventoryChecks;
DELETE FROM PurchaseProgress;
DELETE FROM Invoices;
DELETE FROM PurchaseOrders;
DELETE FROM Orders;
DELETE FROM Inbound;
DELETE FROM Outbound;
DELETE FROM BookVersions;
DELETE FROM SubscriptionPlans;
DELETE FROM BookSelectionApplications;
DELETE FROM BookRatings;
DELETE FROM Notifications;
DELETE FROM RoleMenus;
DELETE FROM Inventory;
DELETE FROM Books;
DELETE FROM BookTypes;
DELETE FROM Publishers;
GO

-- 重置自增ID
DBCC CHECKIDENT ('Books', RESEED, 0);
DBCC CHECKIDENT ('Publishers', RESEED, 0);
DBCC CHECKIDENT ('BookTypes', RESEED, 0);
DBCC CHECKIDENT ('Inventory', RESEED, 0);
DBCC CHECKIDENT ('PurchaseOrders', RESEED, 0);
DBCC CHECKIDENT ('DistributionLists', RESEED, 0);
DBCC CHECKIDENT ('DistributionRecords', RESEED, 0);
DBCC CHECKIDENT ('BookFees', RESEED, 0);
DBCC CHECKIDENT ('Inbound', RESEED, 0);
DBCC CHECKIDENT ('Outbound', RESEED, 0);
GO

-- ========================================
-- 插入出版社数据
-- ========================================
INSERT INTO Publishers (PublisherName, ContactPerson, ContactPhone, Address, Email) VALUES
(N'高等教育出版社', N'陈经理', '010-58581114', N'北京市西城区德外大街4号', 'chen@hep.com.cn'),
(N'科学出版社', N'林经理', '010-64033986', N'北京市东城区东黄城根北街16号', 'lin@sciencepress.com.cn'),
(N'清华大学出版社', N'黄经理', '010-62781726', N'北京市海淀区清华园1号', 'huang@tup.tsinghua.edu.cn'),
(N'人民邮电出版社', N'周经理', '010-81055256', N'北京市丰台区成寿寺路11号', 'zhou@ptpress.com.cn'),
(N'机械工业出版社', N'吴经理', '010-88379510', N'北京市西城区百万庄大街22号', 'wu@cmpbook.com'),
(N'电子工业出版社', N'郑经理', '010-88254114', N'北京市海淀区万寿路南口', 'zheng@phei.com.cn'),
(N'北京大学出版社', N'孙经理', '010-62752015', N'北京市海淀区成府路205号', 'sun@pup.cn');
GO

-- ========================================
-- 插入教材类型数据
-- ========================================
INSERT INTO BookTypes (TypeName) VALUES
(N'必修教材'),
(N'选修教材'),
(N'实验指导'),
(N'教辅资料'),
(N'考研参考书'),
(N'工具书');
GO

-- ========================================
-- 插入教材数据
-- ========================================
INSERT INTO Books (BookName, ISBN, Author, PublisherID, TypeID, Price) VALUES
(N'高等数学（第七版）上册', 'ISBN9787040396', N'同济大学数学系', 1, 1, 46.00),
(N'高等数学（第七版）下册', 'ISBN9787040397', N'同济大学数学系', 1, 1, 44.00),
(N'线性代数',             'ISBN9787040398', N'同济大学数学系', 1, 1, 35.00),
(N'概率论与数理统计',     'ISBN9787040399', N'浙江大学',       1, 1, 42.00),
(N'大学物理（第三版）上册', 'ISBN9787030440', N'张三慧',         2, 1, 49.00),
(N'大学物理（第三版）下册', 'ISBN9787030441', N'张三慧',         2, 1, 48.00),
(N'计算机基础（第6版）',   'ISBN9787302442', N'谭浩强',         3, 1, 39.00),
(N'数据结构（C语言版）',   'ISBN9787302443', N'严蔚敏',         3, 1, 42.00),
(N'计算机网络（第8版）',   'ISBN9787115444', N'谢希仁',         4, 1, 56.00),
(N'操作系统概论',         'ISBN9787111445', N'汤小丹',         4, 1, 45.00),
(N'数据库系统概论（第5版）', 'ISBN9787040410', N'王珊',          1, 1, 43.00),
(N'C程序设计（第5版）',    'ISBN9787302450', N'谭浩强',         3, 1, 38.00),
(N'Python程序设计基础',    'ISBN9787111450', N'董付国',         4, 1, 49.00),
(N'大学英语综合教程1',     'ISBN9787541460', N'李荫华',         7, 1, 52.00),
(N'大学英语综合教程2',     'ISBN9787541461', N'李荫华',         7, 1, 52.00),
(N'马克思主义基本原理',   'ISBN9787040490', N'编写组',         1, 1, 32.00),
(N'毛泽东思想和中国特色社会主义理论体系概论', 'ISBN9787040491', N'编写组', 1, 1, 35.00),
(N'大学语文',             'ISBN9787040492', N'陈洪',           1, 2, 38.00),
(N'电路分析基础',         'ISBN9787111490', N'李瀚荪',         5, 1, 45.00),
(N'模拟电子技术基础',     'ISBN9787040495', N'童诗白',         1, 1, 55.00);
GO

-- ========================================
-- 插入库存数据（先删除已有的避免唯一键冲突）
-- ========================================
DELETE FROM Inventory;
DBCC CHECKIDENT ('Inventory', RESEED, 0);
INSERT INTO Inventory (BookID, WarehouseID, Quantity) VALUES
(1, 1, 200),  (2, 1, 180),  (3, 1, 150),  (4, 1, 160),  (5, 1, 120),
(6, 1, 110),  (7, 1, 250),  (8, 1, 140),  (9, 1, 100),  (10, 1, 90),
(11, 1, 130), (12, 1, 200), (13, 1, 80),  (14, 1, 300), (15, 1, 280),
(16, 1, 400), (17, 1, 380), (18, 1, 150), (19, 1, 100), (20, 1, 85);
GO

-- ========================================
-- 补充供应商数据（确保所有被引用的供应商存在）
-- ========================================
IF NOT EXISTS (SELECT 1 FROM Suppliers WHERE SupplierName = N'人民邮电出版社')
    INSERT INTO Suppliers (SupplierName, ContactPerson, ContactPhone, Address, Email)
    VALUES (N'人民邮电出版社', N'周经理', '010-81055256', N'北京市丰台区成寿寺路11号', 'zhou@ptpress.com.cn');
GO

IF NOT EXISTS (SELECT 1 FROM Suppliers WHERE SupplierName = N'机械工业出版社')
    INSERT INTO Suppliers (SupplierName, ContactPerson, ContactPhone, Address, Email)
    VALUES (N'机械工业出版社', N'吴经理', '010-88379510', N'北京市西城区百万庄大街22号', 'wu@cmpbook.com');
GO

-- ========================================
-- 插入采购单数据
-- ========================================
INSERT INTO PurchaseOrders (OrderNumber, SupplierID, BookID, Quantity, UnitPrice, TotalAmount, OrderDate, ExpectedDeliveryDate, Status, CreatedBy) VALUES
(N'PO202401001', 1, 1,  200, 39.10, 7820.00,  '2024-09-15', '2024-10-15', 'Completed', 1),
(N'PO202401002', 1, 2,  180, 37.40, 6732.00,  '2024-09-15', '2024-10-15', 'Completed', 1),
(N'PO202401003', 1, 16, 400, 27.20, 10880.00, '2024-09-20', '2024-10-20', 'Completed', 1),
(N'PO202401004', 3, 7,  250, 33.15, 8287.50,  '2024-10-01', '2024-11-01', 'Completed', 1),
(N'PO202401005', 4, 9,  100, 47.60, 4760.00,  '2024-10-05', '2024-11-05', 'Completed', 1),
(N'PO202401006', 2, 5,  120, 41.65, 4998.00,  '2024-10-10', '2024-11-10', 'Completed', 1),
(N'PO202501001', 1, 1,  100, 39.10, 3910.00,  '2025-03-01', '2025-04-01', 'Pending',   1),
(N'PO202501002', 4, 13, 80,  41.65, 3332.00,  '2025-03-05', '2025-04-05', 'Pending',   1),
(N'PO202501003', 5, 10, 90,  38.25, 3442.50,  '2025-03-10', '2025-04-10', 'Pending',   1);
GO

-- ========================================
-- 插入入库记录
-- ========================================
INSERT INTO Inbound (BookID, WarehouseID, Quantity, InboundDate, Supplier, Notes) VALUES
(1,  1, 200, '2024-10-20', N'高等教育出版社', N'2024秋季学期-高等数学上册'),
(2,  1, 180, '2024-10-20', N'高等教育出版社', N'2024秋季学期-高等数学下册'),
(16, 1, 400, '2024-10-25', N'高等教育出版社', N'2024秋季学期-马原'),
(7,  1, 250, '2024-11-05', N'清华大学出版社', N'2024秋季学期-计算机基础'),
(9,  1, 100, '2024-11-10', N'人民邮电出版社', N'2024秋季学期-计算机网络'),
(5,  1, 120, '2024-11-15', N'科学出版社',     N'2024秋季学期-大学物理上册'),
(17, 1, 380, '2024-11-20', N'高等教育出版社', N'2024秋季学期-毛概'),
(14, 1, 300, '2024-12-01', N'北京大学出版社', N'2024秋季学期-大学英语1'),
(15, 1, 280, '2024-12-01', N'北京大学出版社', N'2024秋季学期-大学英语2'),
(12, 1, 200, '2024-12-05', N'清华大学出版社', N'2024秋季学期-C程序设计');
GO

-- ========================================
-- 插入发放清单数据
-- ========================================
INSERT INTO DistributionLists (SemesterID, ClassID, CourseID, BookID, DistributionDate, Status, CreatedBy) VALUES
(1, 1, 3, 7,  '2024-10-25', 'Completed', 1),
(1, 1, 5, 8,  '2024-10-25', 'Completed', 1),
(1, 1, 1, 1,  '2024-10-26', 'Completed', 1),
(1, 2, 3, 7,  '2024-10-25', 'Completed', 1),
(1, 4, 1, 1,  '2024-10-26', 'Completed', 1),
(1, 6, 4, 14, '2024-10-28', 'Completed', 1);
GO

-- ========================================
-- 插入发放记录数据
-- ========================================
INSERT INTO DistributionRecords (ListID, StudentID, BookID, Quantity, DistributionDate, RecipientName, RecipientSignature, Status, Notes) VALUES
(1, 1, 7,  1, '2024-10-25', N'张三', N'张三', 'Completed', N'正常发放'),
(1, 2, 7,  1, '2024-10-25', N'李四', N'李四', 'Completed', N'正常发放'),
(2, 1, 8,  1, '2024-10-25', N'张三', N'张三', 'Completed', N'正常发放'),
(2, 2, 8,  1, '2024-10-25', N'李四', N'李四', 'Completed', N'正常发放'),
(3, 1, 1,  1, '2024-10-26', N'张三', N'张三', 'Completed', N'正常发放'),
(3, 2, 1,  1, '2024-10-26', N'李四', N'李四', 'Completed', N'正常发放'),
(4, 3, 7,  1, '2024-10-25', N'王五', N'王五', 'Completed', N'正常发放'),
(5, 4, 1,  1, '2024-10-26', N'赵六', N'赵六', 'Completed', N'正常发放'),
(6, 4, 14, 1, '2024-10-28', N'赵六', N'赵六', 'Completed', N'正常发放');
GO

-- ========================================
-- 插入教材费数据
-- ========================================
INSERT INTO BookFees (StudentID, SemesterID, Amount, PaymentStatus, PaymentDate) VALUES
(1, 1, 167.00, 'Paid',   '2024-10-30'),
(2, 1, 167.00, 'Paid',   '2024-10-28'),
(3, 1, 39.00,  'Unpaid', NULL),
(4, 1, 96.00,  'Paid',   '2024-11-01');
GO

-- ========================================
-- 更新班级学生数
-- ========================================
UPDATE Classes SET StudentCount = 2 WHERE ClassID = 1;
UPDATE Classes SET StudentCount = 1 WHERE ClassID = 2;
UPDATE Classes SET StudentCount = 1 WHERE ClassID = 3;
UPDATE Classes SET StudentCount = 1 WHERE ClassID = 4;
UPDATE Classes SET StudentCount = 0 WHERE ClassID = 5;
UPDATE Classes SET StudentCount = 1 WHERE ClassID = 6;
GO

PRINT N'种子数据插入完成！';
GO