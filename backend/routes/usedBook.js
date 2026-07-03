const express = require('express');
const router = express.Router();
const usedBookController = require('../controllers/usedBook');
const authMiddleware = require('../middleware/auth');

// 应用认证中间件
router.use(authMiddleware);

// 旧教材管理路由
router.get('/records', usedBookController.getUsedBookRecords);
router.get('/records/:id', usedBookController.getUsedBookRecord);
router.post('/records', usedBookController.addUsedBookRecord);
router.put('/records/:id', usedBookController.updateUsedBookRecord);
router.delete('/records/:id', usedBookController.deleteUsedBookRecord);

// 旧教材发放路由
router.get('/distribution', usedBookController.getUsedBookDistributionRecords);
router.post('/distribution', usedBookController.addUsedBookDistributionRecord);

module.exports = router;