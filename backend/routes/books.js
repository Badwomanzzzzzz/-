const express = require('express');
const router = express.Router();
const booksController = require('../controllers/books');
const auth = require('../middleware/auth');

// 获取教材列表
router.get('/', auth, booksController.getBooks);

// 获取单个教材
router.get('/:id', auth, booksController.getBook);

// 添加教材
router.post('/', auth, booksController.addBook);

// 更新教材
router.put('/:id', auth, booksController.updateBook);

// 删除教材
router.delete('/:id', auth, booksController.deleteBook);

module.exports = router;
