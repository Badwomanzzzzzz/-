const express = require('express');
const router = express.Router();
const basicInfoController = require('../controllers/basicInfo');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/departments', basicInfoController.getDepartments);
router.post('/departments', basicInfoController.createDepartment);
router.put('/departments/:id', basicInfoController.updateDepartment);
router.delete('/departments/:id', basicInfoController.deleteDepartment);

router.get('/majors', basicInfoController.getMajors);
router.post('/majors', basicInfoController.createMajor);
router.put('/majors/:id', basicInfoController.updateMajor);
router.delete('/majors/:id', basicInfoController.deleteMajor);

router.get('/grades', basicInfoController.getGrades);
router.post('/grades', basicInfoController.createGrade);
router.put('/grades/:id', basicInfoController.updateGrade);
router.delete('/grades/:id', basicInfoController.deleteGrade);

router.get('/classes', basicInfoController.getClasses);
router.post('/classes', basicInfoController.createClass);
router.put('/classes/:id', basicInfoController.updateClass);
router.delete('/classes/:id', basicInfoController.deleteClass);

router.get('/courses', basicInfoController.getCourses);
router.post('/courses', basicInfoController.createCourse);
router.put('/courses/:id', basicInfoController.updateCourse);
router.delete('/courses/:id', basicInfoController.deleteCourse);

router.get('/teachers', basicInfoController.getTeachers);
router.post('/teachers', basicInfoController.createTeacher);
router.put('/teachers/:id', basicInfoController.updateTeacher);
router.delete('/teachers/:id', basicInfoController.deleteTeacher);

router.get('/students', basicInfoController.getStudents);
router.post('/students', basicInfoController.createStudent);
router.put('/students/:id', basicInfoController.updateStudent);
router.delete('/students/:id', basicInfoController.deleteStudent);

router.get('/semesters', basicInfoController.getSemesters);
router.post('/semesters', basicInfoController.createSemester);
router.put('/semesters/:id', basicInfoController.updateSemester);
router.delete('/semesters/:id', basicInfoController.deleteSemester);

router.get('/publishers', basicInfoController.getPublishers);
router.post('/publishers', basicInfoController.createPublisher);
router.put('/publishers/:id', basicInfoController.updatePublisher);
router.delete('/publishers/:id', basicInfoController.deletePublisher);

router.get('/booktypes', basicInfoController.getBookTypes);
router.post('/booktypes', basicInfoController.createBookType);
router.put('/booktypes/:id', basicInfoController.updateBookType);
router.delete('/booktypes/:id', basicInfoController.deleteBookType);

module.exports = router;