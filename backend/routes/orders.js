const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders');
const authMiddleware = require('../middleware/auth');

// 应用认证中间件
router.use(authMiddleware);

// 订购管理路由
router.get('/', ordersController.getOrders);
router.get('/:id', ordersController.getOrder);
router.post('/', ordersController.addOrder);
router.put('/:id', ordersController.updateOrder);
router.delete('/:id', ordersController.deleteOrder);

module.exports = router;