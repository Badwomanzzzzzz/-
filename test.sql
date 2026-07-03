-- 测试脚本：验证系统功能

-- 1. 插入测试数据
-- 插入出版社
INSERT INTO Publishers (PublisherName, ContactPerson, ContactPhone, Address, Email)
VALUES 
('清华大学出版社', '张三', '13800138001', '北京市海淀区', 'info@tsinghua.edu.cn'),
('北京大学出版社', '李四', '13900139001', '北京市海淀区', 'info@pku.edu.cn');

-- 插入教材类型
INSERT INTO BookTypes (TypeName)
VALUES 
('计算机科学'),
('数学'),
('英语');

-- 2. 测试教材插入（测试ISBN格式验证）
-- 正确的ISBN格式
INSERT INTO Books (BookName, ISBN, Author, PublisherID, TypeID, Price)
VALUES ('数据结构与算法', 'ISBN7302120363', '严蔚敏', 1, 1, 39.50);

-- 3. 测试订购功能
INSERT INTO Orders (BookID, OrderQuantity, OrderDate, ExpectedDeliveryDate, OrderStatus)
VALUES (1, 50, GETDATE(), DATEADD(DAY, 14, GETDATE()), 'Pending');

-- 4. 测试入库功能（验证库存自动增加）
INSERT INTO Inbound (BookID, Quantity, InboundDate, Supplier, OrderID)
VALUES (1, 50, GETDATE(), '清华大学出版社', 1);

-- 5. 测试领用功能（验证库存自动减少）
INSERT INTO Outbound (BookID, Quantity, OutboundDate, Recipient, Purpose)
VALUES (1, 20, GETDATE(), '计算机系', '教学使用');

-- 6. 运行统计存储过程
EXEC sp_Statistics_BookQuantities;

-- 7. 查看库存状态
SELECT * FROM Inventory;
