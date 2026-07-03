-- 存储过程：统计各种教材的订购、到货和发放数量
CREATE PROCEDURE sp_Statistics_BookQuantities
AS
BEGIN
    SELECT 
        b.BookID,
        b.BookName,
        b.ISBN,
        p.PublisherName,
        bt.TypeName,
        COALESCE(SUM(o.OrderQuantity), 0) AS OrderQuantity,
        COALESCE(SUM(i.Quantity), 0) AS InboundQuantity,
        COALESCE(SUM(ob.Quantity), 0) AS OutboundQuantity,
        COALESCE(inv.Quantity, 0) AS CurrentStock
    FROM 
        Books b
    LEFT JOIN 
        Publishers p ON b.PublisherID = p.PublisherID
    LEFT JOIN 
        BookTypes bt ON b.TypeID = bt.TypeID
    LEFT JOIN 
        Orders o ON b.BookID = o.BookID
    LEFT JOIN 
        Inbound i ON b.BookID = i.BookID
    LEFT JOIN 
        Outbound ob ON b.BookID = ob.BookID
    LEFT JOIN 
        Inventory inv ON b.BookID = inv.BookID
    GROUP BY 
        b.BookID, b.BookName, b.ISBN, p.PublisherName, bt.TypeName, inv.Quantity
    ORDER BY 
        b.BookName;
END;
GO
