

-- 院系表
CREATE TABLE Departments (
    DepartmentID INT PRIMARY KEY IDENTITY(1,1),
    DepartmentName NVARCHAR(100) NOT NULL UNIQUE,
    Description NVARCHAR(500),
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO

-- 专业表
CREATE TABLE Majors (
    MajorID INT PRIMARY KEY IDENTITY(1,1),
    MajorName NVARCHAR(100) NOT NULL UNIQUE,
    DepartmentID INT NOT NULL,
    Description NVARCHAR(500),
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Majors_Department FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID)
);
GO

-- 年级表
CREATE TABLE Grades (
    GradeID INT PRIMARY KEY IDENTITY(1,1),
    GradeName NVARCHAR(50) NOT NULL UNIQUE,
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO

-- 班级表
CREATE TABLE Classes (
    ClassID INT PRIMARY KEY IDENTITY(1,1),
    ClassName NVARCHAR(100) NOT NULL UNIQUE,
    MajorID INT NOT NULL,
    GradeID INT NOT NULL,
    StudentCount INT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Classes_Major FOREIGN KEY (MajorID) REFERENCES Majors(MajorID),
    CONSTRAINT FK_Classes_Grade FOREIGN KEY (GradeID) REFERENCES Grades(GradeID)
);
GO

-- 课程表
CREATE TABLE Courses (
    CourseID INT PRIMARY KEY IDENTITY(1,1),
    CourseName NVARCHAR(100) NOT NULL,
    CourseCode NVARCHAR(50) NOT NULL UNIQUE,
    DepartmentID INT NOT NULL,
    Credit DECIMAL(3,1) NOT NULL,
    Description NVARCHAR(500),
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Courses_Department FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID)
);
GO

-- 教师表
CREATE TABLE Teachers (
    TeacherID INT PRIMARY KEY IDENTITY(1,1),
    TeacherName NVARCHAR(50) NOT NULL,
    TeacherCode NVARCHAR(50) NOT NULL UNIQUE,
    DepartmentID INT NOT NULL,
    Title NVARCHAR(50),
    Phone NVARCHAR(20),
    Email NVARCHAR(100),
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Teachers_Department FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID)
);
GO

-- 学生表
CREATE TABLE Students (
    StudentID INT PRIMARY KEY IDENTITY(1,1),
    StudentName NVARCHAR(50) NOT NULL,
    StudentCode NVARCHAR(50) NOT NULL UNIQUE,
    ClassID INT NOT NULL,
    Gender NVARCHAR(10),
    Phone NVARCHAR(20),
    Email NVARCHAR(100),
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Students_Class FOREIGN KEY (ClassID) REFERENCES Classes(ClassID)
);
GO

-- 2. 教材选用与征订计划相关表

-- 学期表
CREATE TABLE Semesters (
    SemesterID INT PRIMARY KEY IDENTITY(1,1),
    SemesterName NVARCHAR(50) NOT NULL UNIQUE,
    StartDate DATETIME NOT NULL,
    EndDate DATETIME NOT NULL,
    IsCurrent BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO

-- 教材选用申请表
CREATE TABLE BookSelectionApplications (
    ApplicationID INT PRIMARY KEY IDENTITY(1,1),
    TeacherID INT NOT NULL,
    CourseID INT NOT NULL,
    BookID INT NOT NULL,
    SemesterID INT NOT NULL,
    ApplicationDate DATETIME DEFAULT GETDATE(),
    Status NVARCHAR(20) DEFAULT 'Pending',
    Reason NVARCHAR(500),
    ReviewedBy INT,
    ReviewedDate DATETIME,
    ReviewComment NVARCHAR(500),
    CONSTRAINT FK_BookSelectionApplications_Teacher FOREIGN KEY (TeacherID) REFERENCES Teachers(TeacherID),
    CONSTRAINT FK_BookSelectionApplications_Course FOREIGN KEY (CourseID) REFERENCES Courses(CourseID),
    CONSTRAINT FK_BookSelectionApplications_Book FOREIGN KEY (BookID) REFERENCES Books(BookID),
    CONSTRAINT FK_BookSelectionApplications_Semester FOREIGN KEY (SemesterID) REFERENCES Semesters(SemesterID),
    CONSTRAINT FK_BookSelectionApplications_ReviewedBy FOREIGN KEY (ReviewedBy) REFERENCES Users(UserID)
);
GO

-- 征订计划表
CREATE TABLE SubscriptionPlans (
    PlanID INT PRIMARY KEY IDENTITY(1,1),
    SemesterID INT NOT NULL,
    ClassID INT NOT NULL,
    CourseID INT NOT NULL,
    BookID INT NOT NULL,
    RequiredQuantity INT NOT NULL,
    OptionalQuantity INT DEFAULT 0,
    CreatedDate DATETIME DEFAULT GETDATE(),
    Status NVARCHAR(20) DEFAULT 'Pending',
    CONSTRAINT FK_SubscriptionPlans_Semester FOREIGN KEY (SemesterID) REFERENCES Semesters(SemesterID),
    CONSTRAINT FK_SubscriptionPlans_Class FOREIGN KEY (ClassID) REFERENCES Classes(ClassID),
    CONSTRAINT FK_SubscriptionPlans_Course FOREIGN KEY (CourseID) REFERENCES Courses(CourseID),
    CONSTRAINT FK_SubscriptionPlans_Book FOREIGN KEY (BookID) REFERENCES Books(BookID)
);
GO

-- 教材版本表
CREATE TABLE BookVersions (
    VersionID INT PRIMARY KEY IDENTITY(1,1),
    BookID INT NOT NULL,
    VersionNumber NVARCHAR(50) NOT NULL,
    PublicationDate DATETIME NOT NULL,
    IsCurrent BIT DEFAULT 1,
    IsDisabled BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_BookVersions_Book FOREIGN KEY (BookID) REFERENCES Books(BookID)
);
GO

-- 3. 采购与供应商管理相关表

-- 供应商表
CREATE TABLE Suppliers (
    SupplierID INT PRIMARY KEY IDENTITY(1,1),
    SupplierName NVARCHAR(100) NOT NULL UNIQUE,
    ContactPerson NVARCHAR(50),
    ContactPhone NVARCHAR(20),
    Address NVARCHAR(200),
    Email NVARCHAR(100),
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO

-- 采购单表
CREATE TABLE PurchaseOrders (
    PurchaseOrderID INT PRIMARY KEY IDENTITY(1,1),
    OrderNumber NVARCHAR(50) NOT NULL UNIQUE,
    SupplierID INT NOT NULL,
    BookID INT NOT NULL,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(10,2) NOT NULL,
    TotalAmount DECIMAL(10,2) NOT NULL,
    OrderDate DATETIME DEFAULT GETDATE(),
    ExpectedDeliveryDate DATETIME,
    Status NVARCHAR(20) DEFAULT 'Pending',
    CreatedBy INT NOT NULL,
    CONSTRAINT FK_PurchaseOrders_Supplier FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID),
    CONSTRAINT FK_PurchaseOrders_Book FOREIGN KEY (BookID) REFERENCES Books(BookID),
    CONSTRAINT FK_PurchaseOrders_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES Users(UserID)
);
GO

-- 采购进度表
CREATE TABLE PurchaseProgress (
    ProgressID INT PRIMARY KEY IDENTITY(1,1),
    PurchaseOrderID INT NOT NULL,
    Status NVARCHAR(20) NOT NULL,
    UpdateDate DATETIME DEFAULT GETDATE(),
    Notes NVARCHAR(500),
    UpdatedBy INT NOT NULL,
    CONSTRAINT FK_PurchaseProgress_PurchaseOrder FOREIGN KEY (PurchaseOrderID) REFERENCES PurchaseOrders(PurchaseOrderID),
    CONSTRAINT FK_PurchaseProgress_UpdatedBy FOREIGN KEY (UpdatedBy) REFERENCES Users(UserID)
);
GO

-- 发票表
CREATE TABLE Invoices (
    InvoiceID INT PRIMARY KEY IDENTITY(1,1),
    InvoiceNumber NVARCHAR(50) NOT NULL UNIQUE,
    PurchaseOrderID INT NOT NULL,
    InvoiceDate DATETIME NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    Status NVARCHAR(20) DEFAULT 'Unpaid',
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Invoices_PurchaseOrder FOREIGN KEY (PurchaseOrderID) REFERENCES PurchaseOrders(PurchaseOrderID)
);
GO

-- 4. 教材库存管理相关表

-- 仓库表
CREATE TABLE Warehouses (
    WarehouseID INT PRIMARY KEY IDENTITY(1,1),
    WarehouseName NVARCHAR(100) NOT NULL UNIQUE,
    Location NVARCHAR(200),
    ContactPerson NVARCHAR(50),
    ContactPhone NVARCHAR(20),
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO

-- 库存表扩展（添加仓库关联）
ALTER TABLE Inventory ADD WarehouseID INT;
ALTER TABLE Inventory ADD CONSTRAINT FK_Inventory_Warehouse FOREIGN KEY (WarehouseID) REFERENCES Warehouses(WarehouseID);
GO

-- 库存盘点表
CREATE TABLE InventoryChecks (
    CheckID INT PRIMARY KEY IDENTITY(1,1),
    CheckDate DATETIME DEFAULT GETDATE(),
    WarehouseID INT NOT NULL,
    CheckStatus NVARCHAR(20) DEFAULT 'Pending',
    CheckedBy INT NOT NULL,
    Notes NVARCHAR(500),
    CONSTRAINT FK_InventoryChecks_Warehouse FOREIGN KEY (WarehouseID) REFERENCES Warehouses(WarehouseID),
    CONSTRAINT FK_InventoryChecks_CheckedBy FOREIGN KEY (CheckedBy) REFERENCES Users(UserID)
);
GO

-- 库存盘点详情表
CREATE TABLE InventoryCheckDetails (
    CheckDetailID INT PRIMARY KEY IDENTITY(1,1),
    CheckID INT NOT NULL,
    BookID INT NOT NULL,
    SystemQuantity INT NOT NULL,
    ActualQuantity INT NOT NULL,
    Difference INT NOT NULL,
    Notes NVARCHAR(200),
    CONSTRAINT FK_InventoryCheckDetails_Check FOREIGN KEY (CheckID) REFERENCES InventoryChecks(CheckID),
    CONSTRAINT FK_InventoryCheckDetails_Book FOREIGN KEY (BookID) REFERENCES Books(BookID)
);
GO

-- 5. 教材发放管理相关表

-- 发放清单表
CREATE TABLE DistributionLists (
    ListID INT PRIMARY KEY IDENTITY(1,1),
    SemesterID INT NOT NULL,
    ClassID INT NOT NULL,
    CourseID INT NOT NULL,
    BookID INT NOT NULL,
    DistributionDate DATETIME DEFAULT GETDATE(),
    Status NVARCHAR(20) DEFAULT 'Pending',
    CreatedBy INT NOT NULL,
    CONSTRAINT FK_DistributionLists_Semester FOREIGN KEY (SemesterID) REFERENCES Semesters(SemesterID),
    CONSTRAINT FK_DistributionLists_Class FOREIGN KEY (ClassID) REFERENCES Classes(ClassID),
    CONSTRAINT FK_DistributionLists_Course FOREIGN KEY (CourseID) REFERENCES Courses(CourseID),
    CONSTRAINT FK_DistributionLists_Book FOREIGN KEY (BookID) REFERENCES Books(BookID),
    CONSTRAINT FK_DistributionLists_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES Users(UserID)
);
GO

-- 发放记录表
CREATE TABLE DistributionRecords (
    RecordID INT PRIMARY KEY IDENTITY(1,1),
    ListID INT NOT NULL,
    StudentID INT NOT NULL,
    BookID INT NOT NULL,
    Quantity INT NOT NULL,
    DistributionDate DATETIME DEFAULT GETDATE(),
    RecipientName NVARCHAR(50) NOT NULL,
    RecipientSignature NVARCHAR(100),
    Status NVARCHAR(20) DEFAULT 'Completed',
    Notes NVARCHAR(200),
    CONSTRAINT FK_DistributionRecords_List FOREIGN KEY (ListID) REFERENCES DistributionLists(ListID),
    CONSTRAINT FK_DistributionRecords_Student FOREIGN KEY (StudentID) REFERENCES Students(StudentID),
    CONSTRAINT FK_DistributionRecords_Book FOREIGN KEY (BookID) REFERENCES Books(BookID)
);
GO

-- 6. 教材费收费与结算相关表

-- 教材费表
CREATE TABLE BookFees (
    FeeID INT PRIMARY KEY IDENTITY(1,1),
    StudentID INT NOT NULL,
    SemesterID INT NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    PaymentStatus NVARCHAR(20) DEFAULT 'Unpaid',
    PaymentDate DATETIME,
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_BookFees_Student FOREIGN KEY (StudentID) REFERENCES Students(StudentID),
    CONSTRAINT FK_BookFees_Semester FOREIGN KEY (SemesterID) REFERENCES Semesters(SemesterID)
);
GO

-- 费用结算表
CREATE TABLE FeeSettlements (
    SettlementID INT PRIMARY KEY IDENTITY(1,1),
    SemesterID INT NOT NULL,
    ClassID INT NOT NULL,
    TotalAmount DECIMAL(10,2) NOT NULL,
    SettledAmount DECIMAL(10,2) DEFAULT 0,
    SettlementDate DATETIME DEFAULT GETDATE(),
    Status NVARCHAR(20) DEFAULT 'Pending',
    CreatedBy INT NOT NULL,
    CONSTRAINT FK_FeeSettlements_Semester FOREIGN KEY (SemesterID) REFERENCES Semesters(SemesterID),
    CONSTRAINT FK_FeeSettlements_Class FOREIGN KEY (ClassID) REFERENCES Classes(ClassID),
    CONSTRAINT FK_FeeSettlements_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES Users(UserID)
);
GO

-- 退费记录表
CREATE TABLE RefundRecords (
    RefundID INT PRIMARY KEY IDENTITY(1,1),
    StudentID INT NOT NULL,
    FeeID INT NOT NULL,
    RefundAmount DECIMAL(10,2) NOT NULL,
    RefundDate DATETIME DEFAULT GETDATE(),
    Reason NVARCHAR(500),
    Status NVARCHAR(20) DEFAULT 'Pending',
    ApprovedBy INT,
    CONSTRAINT FK_RefundRecords_Student FOREIGN KEY (StudentID) REFERENCES Students(StudentID),
    CONSTRAINT FK_RefundRecords_Fee FOREIGN KEY (FeeID) REFERENCES BookFees(FeeID),
    CONSTRAINT FK_RefundRecords_ApprovedBy FOREIGN KEY (ApprovedBy) REFERENCES Users(UserID)
);
GO

-- 7. 旧教材回收与循环使用相关表

-- 旧教材回收表
CREATE TABLE UsedBookRecycling (
    RecyclingID INT PRIMARY KEY IDENTITY(1,1),
    StudentID INT NOT NULL,
    BookID INT NOT NULL,
    Quantity INT NOT NULL,
    RecyclingDate DATETIME DEFAULT GETDATE(),
    Condition NVARCHAR(50),
    Status NVARCHAR(20) DEFAULT 'Pending',
    CreatedBy INT NOT NULL,
    CONSTRAINT FK_UsedBookRecycling_Student FOREIGN KEY (StudentID) REFERENCES Students(StudentID),
    CONSTRAINT FK_UsedBookRecycling_Book FOREIGN KEY (BookID) REFERENCES Books(BookID),
    CONSTRAINT FK_UsedBookRecycling_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES Users(UserID)
);
GO

-- 旧教材定价表
CREATE TABLE UsedBookPricing (
    PricingID INT PRIMARY KEY IDENTITY(1,1),
    RecyclingID INT NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    PricingDate DATETIME DEFAULT GETDATE(),
    ApprovedBy INT NOT NULL,
    CONSTRAINT FK_UsedBookPricing_Recycling FOREIGN KEY (RecyclingID) REFERENCES UsedBookRecycling(RecyclingID),
    CONSTRAINT FK_UsedBookPricing_ApprovedBy FOREIGN KEY (ApprovedBy) REFERENCES Users(UserID)
);
GO

-- 旧书发放记录表
CREATE TABLE UsedBookDistribution (
    UsedDistributionID INT PRIMARY KEY IDENTITY(1,1),
    StudentID INT NOT NULL,
    BookID INT NOT NULL,
    Quantity INT NOT NULL,
    DistributionDate DATETIME DEFAULT GETDATE(),
    Price DECIMAL(10,2) NOT NULL,
    Status NVARCHAR(20) DEFAULT 'Completed',
    CreatedBy INT NOT NULL,
    CONSTRAINT FK_UsedBookDistribution_Student FOREIGN KEY (StudentID) REFERENCES Students(StudentID),
    CONSTRAINT FK_UsedBookDistribution_Book FOREIGN KEY (BookID) REFERENCES Books(BookID),
    CONSTRAINT FK_UsedBookDistribution_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES Users(UserID)
);
GO

-- 8. 操作日志与数据追溯相关表

-- 操作日志表
CREATE TABLE OperationLogs (
    LogID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    OperationType NVARCHAR(50) NOT NULL,
    TargetTable NVARCHAR(100) NOT NULL,
    TargetID INT,
    OperationContent NVARCHAR(1000),
    OperationDate DATETIME DEFAULT GETDATE(),
    IPAddress NVARCHAR(50),
    CONSTRAINT FK_OperationLogs_User FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
GO

-- 9. 权限管理扩展

-- 菜单表
CREATE TABLE Menus (
    MenuID INT PRIMARY KEY IDENTITY(1,1),
    MenuName NVARCHAR(50) NOT NULL,
    MenuPath NVARCHAR(200) NOT NULL,
    ParentID INT,
    Icon NVARCHAR(50),
    OrderIndex INT DEFAULT 0,
    CONSTRAINT FK_Menus_Parent FOREIGN KEY (ParentID) REFERENCES Menus(MenuID)
);
GO

-- 角色菜单权限表
CREATE TABLE RoleMenus (
    RoleMenuID INT PRIMARY KEY IDENTITY(1,1),
    RoleID INT NOT NULL,
    MenuID INT NOT NULL,
    CanAccess BIT DEFAULT 1,
    CONSTRAINT FK_RoleMenus_Role FOREIGN KEY (RoleID) REFERENCES Roles(RoleID),
    CONSTRAINT FK_RoleMenus_Menu FOREIGN KEY (MenuID) REFERENCES Menus(MenuID)
);
GO

-- 10. 插入初始数据

-- 插入默认仓库
INSERT INTO Warehouses (WarehouseName, Location, ContactPerson, ContactPhone) 
VALUES ('主仓库', '图书馆一楼', '张老师', '13800138001');
GO

-- 更新现有库存记录的仓库ID
UPDATE Inventory SET WarehouseID = 1 WHERE WarehouseID IS NULL;
GO

-- 插入默认学期
INSERT INTO Semesters (SemesterName, StartDate, EndDate, IsCurrent) 
VALUES ('2024-2025学年第一学期', '2024-09-01', '2025-01-31', 1);
GO

-- 插入默认院系
INSERT INTO Departments (DepartmentName, Description) 
VALUES ('计算机学院', '计算机科学与技术相关专业'),
       ('数学学院', '数学相关专业'),
       ('物理学院', '物理学相关专业'),
       ('外语学院', '外语相关专业');
GO

-- 插入默认专业
INSERT INTO Majors (MajorName, DepartmentID, Description) 
VALUES ('计算机科学与技术', 1, '计算机科学与技术专业'),
       ('软件工程', 1, '软件工程专业'),
       ('数学与应用数学', 2, '数学与应用数学专业'),
       ('物理学', 3, '物理学专业'),
       ('英语', 4, '英语专业');
GO

-- 插入默认年级
INSERT INTO Grades (GradeName) 
VALUES ('2021级'),
       ('2022级'),
       ('2023级'),
       ('2024级');
GO

-- 插入默认班级
INSERT INTO Classes (ClassName, MajorID, GradeID, StudentCount) 
VALUES ('计算机2101', 1, 1, 40),
       ('计算机2201', 1, 2, 38),
       ('软件2101', 2, 1, 42),
       ('数学2101', 3, 1, 35),
       ('物理2101', 4, 1, 30),
       ('英语2101', 5, 1, 32);
GO

-- 插入默认课程
INSERT INTO Courses (CourseName, CourseCode, DepartmentID, Credit, Description) 
VALUES ('高等数学', 'MATH101', 2, 4.0, '高等数学基础课程'),
       ('大学物理', 'PHYS101', 3, 3.0, '大学物理基础课程'),
       ('计算机基础', 'CS101', 1, 3.0, '计算机基础课程'),
       ('英语', 'ENG101', 4, 4.0, '大学英语课程'),
       ('数据结构', 'CS201', 1, 3.5, '数据结构课程');
GO

-- 插入默认教师
INSERT INTO Teachers (TeacherName, TeacherCode, DepartmentID, Title, Phone, Email) 
VALUES ('王老师', 'T001', 1, '教授', '13800138002', 'wang@example.com'),
       ('李老师', 'T002', 2, '副教授', '13800138003', 'li@example.com'),
       ('张老师', 'T003', 3, '讲师', '13800138004', 'zhang@example.com'),
       ('刘老师', 'T004', 4, '教授', '13800138005', 'liu@example.com');
GO

-- 插入默认学生
INSERT INTO Students (StudentName, StudentCode, ClassID, Gender, Phone, Email) 
VALUES ('张三', 'S2021001', 1, '男', '13800138006', 'zhangsan@example.com'),
       ('李四', 'S2021002', 1, '女', '13800138007', 'lisi@example.com'),
       ('王五', 'S2022001', 2, '男', '13800138008', 'wangwu@example.com'),
       ('赵六', 'S2021003', 3, '女', '13800138009', 'zhaoliu@example.com');
GO

-- 插入默认供应商
INSERT INTO Suppliers (SupplierName, ContactPerson, ContactPhone, Address, Email) 
VALUES ('高等教育出版社', '陈经理', '13800138010', '北京市西城区', 'chen@hep.com.cn'),
       ('科学出版社', '林经理', '13800138011', '北京市东城区', 'lin@sciencepress.com.cn'),
       ('清华大学出版社', '黄经理', '13800138012', '北京市海淀区', 'huang@tup.tsinghua.edu.cn');
GO

-- 插入默认菜单
INSERT INTO Menus (MenuName, MenuPath, ParentID, Icon, OrderIndex) 
VALUES ('基础信息管理', '/basic-info', NULL, 'Menu', 1),
       ('教材信息管理', '/basic-info/books', 1, 'Document', 1),
       ('院系专业管理', '/basic-info/departments', 1, 'OfficeBuilding', 2),
       ('班级年级管理', '/basic-info/classes', 1, 'School', 3),
       ('教师学生管理', '/basic-info/users', 1, 'UserFilled', 4),
       ('系统用户管理', '/basic-info/system-users', 1, 'Setting', 5),
       ('教材选用与征订', '/book-selection', NULL, 'Check', 2),
       ('教材选用申请', '/book-selection/applications', 7, 'EditPen', 1),
       ('征订计划管理', '/book-selection/plans', 7, 'Calendar', 2),
       ('教材版本管理', '/book-selection/versions', 7, 'Refresh', 3),
       ('采购与供应商', '/purchasing', NULL, 'ShoppingCart', 3),
       ('供应商管理', '/purchasing/suppliers', 11, 'Company', 1),
       ('采购单管理', '/purchasing/orders', 11, 'DocumentCopy', 2),
       ('到货登记', '/purchasing/receipts', 11, 'Goods', 3),
       ('发票管理', '/purchasing/invoices', 11, 'Ticket', 4),
       ('教材库存管理', '/inventory', NULL, 'Box', 4),
       ('库存查询', '/inventory/query', 16, 'Search', 1),
       ('入库管理', '/inventory/inbound', 16, 'Download', 2),
       ('出库管理', '/inventory/outbound', 16, 'Upload', 3),
       ('库存盘点', '/inventory/check', 16, 'DataAnalysis', 4),
       ('教材发放管理', '/distribution', NULL, 'Present', 5),
       ('发放清单管理', '/distribution/lists', 21, 'View', 1),
       ('发放登记', '/distribution/records', 21, 'Edit', 2),
       ('教材费管理', '/fees', NULL, 'Money', 6),
       ('费用管理', '/fees/management', 24, 'Wallet', 1),
       ('费用结算', '/fees/settlement', 24, 'Calculator', 2),
       ('退费管理', '/fees/refunds', 24, 'RefreshLeft', 3),
       ('旧教材管理', '/used-books', NULL, 'Read', 7),
       ('回收管理', '/used-books/recycling', 28, 'TakeawayBox', 1),
       ('旧书发放', '/used-books/distribution', 28, 'Send', 2),
       ('教材评价管理', '/evaluation', NULL, 'Star', 8),
       ('评价管理', '/evaluation/management', 31, 'ChatLineRound', 1),
       ('评价统计', '/evaluation/statistics', 31, 'DataLine', 2),
       ('查询与报表', '/reports', NULL, 'Document', 9),
       ('教材使用统计', '/reports/usage', 34, 'Histogram', 1),
       ('领用统计', '/reports/distribution', 34, 'PieChart', 2),
       ('教材费统计', '/reports/fees', 34, 'TrendCharts', 3),
       ('采购统计', '/reports/purchasing', 34, 'BarChart', 4),
       ('库存统计', '/reports/inventory', 34, 'LineChart', 5),
       ('系统管理', '/system', NULL, 'Setting', 10),
       ('角色权限管理', '/system/roles', 39, 'User', 1),
       ('操作日志', '/system/logs', 39, 'Timer', 2),
       ('学期管理', '/system/semesters', 39, 'Calendar', 3),
       ('数据备份', '/system/backup', 39, 'Download', 4);
GO

-- 为管理员角色分配所有菜单权限
INSERT INTO RoleMenus (RoleID, MenuID, CanAccess) 
SELECT 1, MenuID, 1 FROM Menus;
GO

-- 为教师角色分配部分菜单权限
INSERT INTO RoleMenus (RoleID, MenuID, CanAccess) 
SELECT 2, MenuID, 1 FROM Menus 
WHERE MenuPath IN (
    '/basic-info/books',
    '/book-selection/applications',
    '/evaluation/management',
    '/reports/usage'
);
GO

-- 为学生角色分配部分菜单权限
INSERT INTO RoleMenus (RoleID, MenuID, CanAccess) 
SELECT 3, MenuID, 1 FROM Menus 
WHERE MenuPath IN (
    '/basic-info/books',
    '/evaluation/management',
    '/used-books/recycling'
);
GO
