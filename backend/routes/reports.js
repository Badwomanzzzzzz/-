const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/dashboard', reportsController.getDashboardStats);
router.get('/usage', reportsController.getBookUsageStats);
router.get('/distribution', reportsController.getClassDistributionStats);
router.get('/fees', reportsController.getFeeStats);
router.get('/purchasing', reportsController.getPurchasingStats);
router.get('/inventory', reportsController.getInventoryStats);

module.exports = router;