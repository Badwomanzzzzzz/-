-- 触发器：当教材插入时自动创建库存记录
CREATE TRIGGER trg_Books_Insert
ON Books
AFTER INSERT
AS
BEGIN
    INSERT INTO Inventory (BookID, Quantity)
    SELECT BookID, 0
    FROM inserted;
END;
GO

-- 触发器：入库时自动增加库存
CREATE TRIGGER trg_Inbound_Insert
ON Inbound
AFTER INSERT
AS
BEGIN
    UPDATE Inventory
    SET Quantity = Quantity + i.Quantity
    FROM Inventory inv
    JOIN inserted i ON inv.BookID = i.BookID;
END;
GO

-- 触发器：领用时自动减少库存
CREATE TRIGGER trg_Outbound_Insert
ON Outbound
AFTER INSERT
AS
BEGIN
    UPDATE Inventory
    SET Quantity = Quantity - i.Quantity
    FROM Inventory inv
    JOIN inserted i ON inv.BookID = i.BookID;
END;
GO
