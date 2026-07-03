const pool = require('../config/database');

exports.getDepartments = async (req, res) => {
  try {
    const result = await pool.request().query('SELECT * FROM Departments ORDER BY DepartmentID');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.createDepartment = async (req, res) => {
  const { DepartmentName, Description } = req.body;
  try {
    const result = await pool.request()
      .input('DepartmentName', DepartmentName)
      .input('Description', Description || '')
      .query('INSERT INTO Departments (DepartmentName, Description) VALUES (@DepartmentName, @Description); SELECT SCOPE_IDENTITY() as DepartmentID');
    res.status(201).json({ DepartmentID: result.recordset[0].DepartmentID, DepartmentName, Description });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { DepartmentName, Description } = req.body;
  try {
    await pool.request()
      .input('id', id)
      .input('DepartmentName', DepartmentName)
      .input('Description', Description || '')
      .query('UPDATE Departments SET DepartmentName = @DepartmentName, Description = @Description WHERE DepartmentID = @id');
    res.json({ message: '更新成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.deleteDepartment = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.request().input('id', id).query('DELETE FROM Departments WHERE DepartmentID = @id');
    res.json({ message: '删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.getMajors = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT m.*, d.DepartmentName FROM Majors m JOIN Departments d ON m.DepartmentID = d.DepartmentID ORDER BY m.MajorID
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.createMajor = async (req, res) => {
  const { MajorName, DepartmentID, Description } = req.body;
  try {
    const result = await pool.request()
      .input('MajorName', MajorName)
      .input('DepartmentID', DepartmentID)
      .input('Description', Description || '')
      .query('INSERT INTO Majors (MajorName, DepartmentID, Description) VALUES (@MajorName, @DepartmentID, @Description); SELECT SCOPE_IDENTITY() as MajorID');
    res.status(201).json({ MajorID: result.recordset[0].MajorID });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.updateMajor = async (req, res) => {
  const { id } = req.params;
  const { MajorName, DepartmentID, Description } = req.body;
  try {
    await pool.request()
      .input('id', id).input('MajorName', MajorName).input('DepartmentID', DepartmentID).input('Description', Description || '')
      .query('UPDATE Majors SET MajorName = @MajorName, DepartmentID = @DepartmentID, Description = @Description WHERE MajorID = @id');
    res.json({ message: '更新成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.deleteMajor = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.request().input('id', id).query('DELETE FROM Majors WHERE MajorID = @id');
    res.json({ message: '删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.getGrades = async (req, res) => {
  try {
    const result = await pool.request().query('SELECT * FROM Grades ORDER BY GradeID');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.createGrade = async (req, res) => {
  const { GradeName } = req.body;
  try {
    const result = await pool.request().input('GradeName', GradeName)
      .query('INSERT INTO Grades (GradeName) VALUES (@GradeName); SELECT SCOPE_IDENTITY() as GradeID');
    res.status(201).json({ GradeID: result.recordset[0].GradeID, GradeName });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.updateGrade = async (req, res) => {
  const { id } = req.params;
  const { GradeName } = req.body;
  try {
    await pool.request().input('id', id).input('GradeName', GradeName)
      .query('UPDATE Grades SET GradeName = @GradeName WHERE GradeID = @id');
    res.json({ message: '更新成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.deleteGrade = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.request().input('id', id).query('DELETE FROM Grades WHERE GradeID = @id');
    res.json({ message: '删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.getClasses = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT c.*, m.MajorName, g.GradeName FROM Classes c
      JOIN Majors m ON c.MajorID = m.MajorID
      JOIN Grades g ON c.GradeID = g.GradeID
      ORDER BY c.ClassID
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.createClass = async (req, res) => {
  const { ClassName, MajorID, GradeID, StudentCount } = req.body;
  try {
    const result = await pool.request()
      .input('ClassName', ClassName).input('MajorID', MajorID).input('GradeID', GradeID).input('StudentCount', StudentCount || 0)
      .query('INSERT INTO Classes (ClassName, MajorID, GradeID, StudentCount) VALUES (@ClassName, @MajorID, @GradeID, @StudentCount); SELECT SCOPE_IDENTITY() as ClassID');
    res.status(201).json({ ClassID: result.recordset[0].ClassID });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.updateClass = async (req, res) => {
  const { id } = req.params;
  const { ClassName, MajorID, GradeID, StudentCount } = req.body;
  try {
    await pool.request()
      .input('id', id).input('ClassName', ClassName).input('MajorID', MajorID).input('GradeID', GradeID).input('StudentCount', StudentCount || 0)
      .query('UPDATE Classes SET ClassName = @ClassName, MajorID = @MajorID, GradeID = @GradeID, StudentCount = @StudentCount WHERE ClassID = @id');
    res.json({ message: '更新成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.deleteClass = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.request().input('id', id).query('DELETE FROM Classes WHERE ClassID = @id');
    res.json({ message: '删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT c.*, d.DepartmentName FROM Courses c
      JOIN Departments d ON c.DepartmentID = d.DepartmentID ORDER BY c.CourseID
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.createCourse = async (req, res) => {
  const { CourseName, CourseCode, DepartmentID, Credit, Description } = req.body;
  try {
    const result = await pool.request()
      .input('CourseName', CourseName).input('CourseCode', CourseCode).input('DepartmentID', DepartmentID)
      .input('Credit', Credit).input('Description', Description || '')
      .query('INSERT INTO Courses (CourseName, CourseCode, DepartmentID, Credit, Description) VALUES (@CourseName, @CourseCode, @DepartmentID, @Credit, @Description); SELECT SCOPE_IDENTITY() as CourseID');
    res.status(201).json({ CourseID: result.recordset[0].CourseID });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  const { CourseName, CourseCode, DepartmentID, Credit, Description } = req.body;
  try {
    await pool.request()
      .input('id', id).input('CourseName', CourseName).input('CourseCode', CourseCode)
      .input('DepartmentID', DepartmentID).input('Credit', Credit).input('Description', Description || '')
      .query('UPDATE Courses SET CourseName = @CourseName, CourseCode = @CourseCode, DepartmentID = @DepartmentID, Credit = @Credit, Description = @Description WHERE CourseID = @id');
    res.json({ message: '更新成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.request().input('id', id).query('DELETE FROM Courses WHERE CourseID = @id');
    res.json({ message: '删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.getTeachers = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT t.*, d.DepartmentName FROM Teachers t
      JOIN Departments d ON t.DepartmentID = d.DepartmentID ORDER BY t.TeacherID
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.createTeacher = async (req, res) => {
  const { TeacherName, TeacherCode, DepartmentID, Title, Phone, Email } = req.body;
  try {
    const result = await pool.request()
      .input('TeacherName', TeacherName).input('TeacherCode', TeacherCode).input('DepartmentID', DepartmentID)
      .input('Title', Title || '').input('Phone', Phone || '').input('Email', Email || '')
      .query('INSERT INTO Teachers (TeacherName, TeacherCode, DepartmentID, Title, Phone, Email) VALUES (@TeacherName, @TeacherCode, @DepartmentID, @Title, @Phone, @Email); SELECT SCOPE_IDENTITY() as TeacherID');
    res.status(201).json({ TeacherID: result.recordset[0].TeacherID });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.updateTeacher = async (req, res) => {
  const { id } = req.params;
  const { TeacherName, TeacherCode, DepartmentID, Title, Phone, Email } = req.body;
  try {
    await pool.request()
      .input('id', id).input('TeacherName', TeacherName).input('TeacherCode', TeacherCode)
      .input('DepartmentID', DepartmentID).input('Title', Title || '').input('Phone', Phone || '').input('Email', Email || '')
      .query('UPDATE Teachers SET TeacherName = @TeacherName, TeacherCode = @TeacherCode, DepartmentID = @DepartmentID, Title = @Title, Phone = @Phone, Email = @Email WHERE TeacherID = @id');
    res.json({ message: '更新成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.deleteTeacher = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.request().input('id', id).query('DELETE FROM Teachers WHERE TeacherID = @id');
    res.json({ message: '删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT s.*, c.ClassName, m.MajorName, g.GradeName FROM Students s
      JOIN Classes c ON s.ClassID = c.ClassID
      JOIN Majors m ON c.MajorID = m.MajorID
      JOIN Grades g ON c.GradeID = g.GradeID
      ORDER BY s.StudentID
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.createStudent = async (req, res) => {
  const { StudentName, StudentCode, ClassID, Gender, Phone, Email } = req.body;
  try {
    const result = await pool.request()
      .input('StudentName', StudentName).input('StudentCode', StudentCode).input('ClassID', ClassID)
      .input('Gender', Gender || '').input('Phone', Phone || '').input('Email', Email || '')
      .query('INSERT INTO Students (StudentName, StudentCode, ClassID, Gender, Phone, Email) VALUES (@StudentName, @StudentCode, @ClassID, @Gender, @Phone, @Email); SELECT SCOPE_IDENTITY() as StudentID');
    res.status(201).json({ StudentID: result.recordset[0].StudentID });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  const { StudentName, StudentCode, ClassID, Gender, Phone, Email } = req.body;
  try {
    await pool.request()
      .input('id', id).input('StudentName', StudentName).input('StudentCode', StudentCode)
      .input('ClassID', ClassID).input('Gender', Gender || '').input('Phone', Phone || '').input('Email', Email || '')
      .query('UPDATE Students SET StudentName = @StudentName, StudentCode = @StudentCode, ClassID = @ClassID, Gender = @Gender, Phone = @Phone, Email = @Email WHERE StudentID = @id');
    res.json({ message: '更新成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.request().input('id', id).query('DELETE FROM Students WHERE StudentID = @id');
    res.json({ message: '删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.getSemesters = async (req, res) => {
  try {
    const result = await pool.request().query('SELECT * FROM Semesters ORDER BY SemesterID DESC');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.createSemester = async (req, res) => {
  const { SemesterName, StartDate, EndDate, IsCurrent } = req.body;
  try {
    if (IsCurrent) {
      await pool.request().query('UPDATE Semesters SET IsCurrent = 0');
    }
    const result = await pool.request()
      .input('SemesterName', SemesterName).input('StartDate', StartDate).input('EndDate', EndDate).input('IsCurrent', IsCurrent || 0)
      .query('INSERT INTO Semesters (SemesterName, StartDate, EndDate, IsCurrent) VALUES (@SemesterName, @StartDate, @EndDate, @IsCurrent); SELECT SCOPE_IDENTITY() as SemesterID');
    res.status(201).json({ SemesterID: result.recordset[0].SemesterID });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.updateSemester = async (req, res) => {
  const { id } = req.params;
  const { SemesterName, StartDate, EndDate, IsCurrent } = req.body;
  try {
    if (IsCurrent) {
      await pool.request().query('UPDATE Semesters SET IsCurrent = 0');
    }
    await pool.request()
      .input('id', id).input('SemesterName', SemesterName).input('StartDate', StartDate).input('EndDate', EndDate).input('IsCurrent', IsCurrent || 0)
      .query('UPDATE Semesters SET SemesterName = @SemesterName, StartDate = @StartDate, EndDate = @EndDate, IsCurrent = @IsCurrent WHERE SemesterID = @id');
    res.json({ message: '更新成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.deleteSemester = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.request().input('id', id).query('DELETE FROM Semesters WHERE SemesterID = @id');
    res.json({ message: '删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.getPublishers = async (req, res) => {
  try {
    const result = await pool.request().query('SELECT * FROM Publishers ORDER BY PublisherID');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.createPublisher = async (req, res) => {
  const { PublisherName, ContactPerson, ContactPhone, Address, Email } = req.body;
  try {
    const result = await pool.request()
      .input('PublisherName', PublisherName).input('ContactPerson', ContactPerson || '')
      .input('ContactPhone', ContactPhone || '').input('Address', Address || '').input('Email', Email || '')
      .query('INSERT INTO Publishers (PublisherName, ContactPerson, ContactPhone, Address, Email) VALUES (@PublisherName, @ContactPerson, @ContactPhone, @Address, @Email); SELECT SCOPE_IDENTITY() as PublisherID');
    res.status(201).json({ PublisherID: result.recordset[0].PublisherID });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.updatePublisher = async (req, res) => {
  const { id } = req.params;
  const { PublisherName, ContactPerson, ContactPhone, Address, Email } = req.body;
  try {
    await pool.request()
      .input('id', id).input('PublisherName', PublisherName).input('ContactPerson', ContactPerson || '')
      .input('ContactPhone', ContactPhone || '').input('Address', Address || '').input('Email', Email || '')
      .query('UPDATE Publishers SET PublisherName = @PublisherName, ContactPerson = @ContactPerson, ContactPhone = @ContactPhone, Address = @Address, Email = @Email WHERE PublisherID = @id');
    res.json({ message: '更新成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.deletePublisher = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.request().input('id', id).query('DELETE FROM Publishers WHERE PublisherID = @id');
    res.json({ message: '删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.getBookTypes = async (req, res) => {
  try {
    const result = await pool.request().query('SELECT * FROM BookTypes ORDER BY TypeID');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.createBookType = async (req, res) => {
  const { TypeName } = req.body;
  try {
    const result = await pool.request().input('TypeName', TypeName)
      .query('INSERT INTO BookTypes (TypeName) VALUES (@TypeName); SELECT SCOPE_IDENTITY() as TypeID');
    res.status(201).json({ TypeID: result.recordset[0].TypeID, TypeName });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.updateBookType = async (req, res) => {
  const { id } = req.params;
  const { TypeName } = req.body;
  try {
    await pool.request().input('id', id).input('TypeName', TypeName)
      .query('UPDATE BookTypes SET TypeName = @TypeName WHERE TypeID = @id');
    res.json({ message: '更新成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};

exports.deleteBookType = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.request().input('id', id).query('DELETE FROM BookTypes WHERE TypeID = @id');
    res.json({ message: '删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error });
  }
};