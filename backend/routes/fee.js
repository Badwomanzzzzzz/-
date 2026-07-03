const express = require('express');
const router = express.Router();
const feeController = require('../controllers/fee');
const authMiddleware = require('../middleware/auth');

// 应用认证中间件
router.use(authMiddleware);

// 教材费管理路由
router.get('/', feeController.getFeeRecords);
router.get('/:id', feeController.getFeeRecord);
router.post('/', feeController.addFeeRecord);
router.put('/:id', feeController.updateFeeRecord);
router.delete('/:id', feeController.deleteFeeRecord);
router.post('/settle', feeController.settleSemesterFees);

module.exports = router;