const pool = require('../config/database');

exports.getBookSelectionApplications = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT 
        bsa.ApplicationID, 
        t.TeacherName, 
        c.CourseName, 
        b.BookName AS BookTitle, 
        s.SemesterName, 
        bsa.ApplicationDate, 
        bsa.Status, 
        bsa.Reason, 
        u.Name AS ReviewedBy, 
        bsa.ReviewedDate, 
        bsa.ReviewComment
      FROM BookSelectionApplications bsa
      JOIN Teachers t ON bsa.TeacherID = t.TeacherID
      JOIN Courses c ON bsa.CourseID = c.CourseID
      JOIN Books b ON bsa.BookID = b.BookID
      JOIN Semesters s ON bsa.SemesterID = s.SemesterID
      LEFT JOIN Users u ON bsa.ReviewedBy = u.UserID
      ORDER BY bsa.ApplicationDate DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching book selection applications:', error);
    res.status(500).json({ message: '获取教材选用申请失败' });
  }
};

exports.addBookSelectionApplication = async (req, res) => {
  const { TeacherID, CourseID, BookID, SemesterID, Reason } = req.body;
  try {
    const result = await pool.request()
      .input('TeacherID', TeacherID)
      .input('CourseID', CourseID)
      .input('BookID', BookID)
      .input('SemesterID', SemesterID)
      .input('Reason', Reason || '')
      .query(`
        INSERT INTO BookSelectionApplications (TeacherID, CourseID, BookID, SemesterID, Reason)
        VALUES (@TeacherID, @CourseID, @BookID, @SemesterID, @Reason)
        SELECT SCOPE_IDENTITY() AS ApplicationID
      `);
    res.json({ success: true, ApplicationID: result.recordset[0].ApplicationID });
  } catch (error) {
    console.error('Error adding book selection application:', error);
    res.status(500).json({ message: '添加教材选用申请失败' });
  }
};

exports.updateBookSelectionApplication = async (req, res) => {
  const { ApplicationID, Status, ReviewedBy, ReviewComment } = req.body;
  try {
    await pool.request()
      .input('ApplicationID', ApplicationID)
      .input('Status', Status)
      .input('ReviewedBy', ReviewedBy)
      .input('ReviewComment', ReviewComment || '')
      .query(`
        UPDATE BookSelectionApplications
        SET Status = @Status,
            ReviewedBy = @ReviewedBy,
            ReviewedDate = GETDATE(),
            ReviewComment = @ReviewComment
        WHERE ApplicationID = @ApplicationID
      `);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating book selection application:', error);
    res.status(500).json({ message: '更新教材选用申请失败' });
  }
};

exports.deleteBookSelectionApplication = async (req, res) => {
  const { ApplicationID } = req.params;
  try {
    await pool.request()
      .input('ApplicationID', ApplicationID)
      .query('DELETE FROM BookSelectionApplications WHERE ApplicationID = @ApplicationID');
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting book selection application:', error);
    res.status(500).json({ message: '删除教材选用申请失败' });
  }
};

exports.getSubscriptionPlans = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT 
        sp.PlanID, 
        s.SemesterName, 
        cl.ClassName, 
        c.CourseName, 
        b.BookName AS BookTitle, 
        sp.RequiredQuantity, 
        sp.OptionalQuantity, 
        sp.CreatedDate, 
        sp.Status
      FROM SubscriptionPlans sp
      JOIN Semesters s ON sp.SemesterID = s.SemesterID
      JOIN Classes cl ON sp.ClassID = cl.ClassID
      JOIN Courses c ON sp.CourseID = c.CourseID
      JOIN Books b ON sp.BookID = b.BookID
      ORDER BY sp.CreatedDate DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    res.status(500).json({ message: '获取征订计划失败' });
  }
};

exports.addSubscriptionPlan = async (req, res) => {
  const { SemesterID, ClassID, CourseID, BookID, RequiredQuantity, OptionalQuantity } = req.body;
  try {
    const result = await pool.request()
      .input('SemesterID', SemesterID)
      .input('ClassID', ClassID)
      .input('CourseID', CourseID)
      .input('BookID', BookID)
      .input('RequiredQuantity', RequiredQuantity)
      .input('OptionalQuantity', OptionalQuantity || 0)
      .query(`
        INSERT INTO SubscriptionPlans (SemesterID, ClassID, CourseID, BookID, RequiredQuantity, OptionalQuantity)
        VALUES (@SemesterID, @ClassID, @CourseID, @BookID, @RequiredQuantity, @OptionalQuantity)
        SELECT SCOPE_IDENTITY() AS PlanID
      `);
    res.json({ success: true, PlanID: result.recordset[0].PlanID });
  } catch (error) {
    console.error('Error adding subscription plan:', error);
    res.status(500).json({ message: '添加征订计划失败' });
  }
};

exports.updateSubscriptionPlan = async (req, res) => {
  const { PlanID, RequiredQuantity, OptionalQuantity, Status } = req.body;
  try {
    await pool.request()
      .input('PlanID', PlanID)
      .input('RequiredQuantity', RequiredQuantity)
      .input('OptionalQuantity', OptionalQuantity || 0)
      .input('Status', Status)
      .query(`
        UPDATE SubscriptionPlans
        SET RequiredQuantity = @RequiredQuantity,
            OptionalQuantity = @OptionalQuantity,
            Status = @Status
        WHERE PlanID = @PlanID
      `);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating subscription plan:', error);
    res.status(500).json({ message: '更新征订计划失败' });
  }
};

exports.deleteSubscriptionPlan = async (req, res) => {
  const { PlanID } = req.params;
  try {
    await pool.request()
      .input('PlanID', PlanID)
      .query('DELETE FROM SubscriptionPlans WHERE PlanID = @PlanID');
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting subscription plan:', error);
    res.status(500).json({ message: '删除征订计划失败' });
  }
};

exports.getBookVersions = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT 
        bv.VersionID, 
        b.BookName AS BookTitle, 
        bv.VersionNumber, 
        bv.PublicationDate, 
        bv.IsCurrent, 
        bv.IsDisabled
      FROM BookVersions bv
      JOIN Books b ON bv.BookID = b.BookID
      ORDER BY b.BookName, bv.PublicationDate DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching book versions:', error);
    res.status(500).json({ message: '获取教材版本失败' });
  }
};

exports.addBookVersion = async (req, res) => {
  const { BookID, VersionNumber, PublicationDate } = req.body;
  try {
    await pool.request()
      .input('BookID', BookID)
      .query('UPDATE BookVersions SET IsCurrent = 0 WHERE BookID = @BookID');

    const result = await pool.request()
      .input('BookID', BookID)
      .input('VersionNumber', VersionNumber)
      .input('PublicationDate', PublicationDate)
      .query(`
        INSERT INTO BookVersions (BookID, VersionNumber, PublicationDate, IsCurrent)
        VALUES (@BookID, @VersionNumber, @PublicationDate, 1)
        SELECT SCOPE_IDENTITY() AS VersionID
      `);
    res.json({ success: true, VersionID: result.recordset[0].VersionID });
  } catch (error) {
    console.error('Error adding book version:', error);
    res.status(500).json({ message: '添加教材版本失败' });
  }
};

exports.updateBookVersion = async (req, res) => {
  const { VersionID, IsCurrent, IsDisabled } = req.body;
  try {
    if (IsCurrent) {
      const bookIdResult = await pool.request()
        .input('VersionID', VersionID)
        .query('SELECT BookID FROM BookVersions WHERE VersionID = @VersionID');
      if (bookIdResult.recordset.length > 0) {
        await pool.request()
          .input('BookID', bookIdResult.recordset[0].BookID)
          .query('UPDATE BookVersions SET IsCurrent = 0 WHERE BookID = @BookID');
      }
    }

    await pool.request()
      .input('VersionID', VersionID)
      .input('IsCurrent', IsCurrent ? 1 : 0)
      .input('IsDisabled', IsDisabled ? 1 : 0)
      .query(`
        UPDATE BookVersions
        SET IsCurrent = @IsCurrent,
            IsDisabled = @IsDisabled
        WHERE VersionID = @VersionID
      `);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating book version:', error);
    res.status(500).json({ message: '更新教材版本失败' });
  }
};

exports.deleteBookVersion = async (req, res) => {
  const { VersionID } = req.params;
  try {
    await pool.request()
      .input('VersionID', VersionID)
      .query('DELETE FROM BookVersions WHERE VersionID = @VersionID');
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting book version:', error);
    res.status(500).json({ message: '删除教材版本失败' });
  }
};