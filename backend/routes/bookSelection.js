const express = require('express');
const router = express.Router();
const bookSelectionController = require('../controllers/bookSelection');

// 教材选用申请路由
router.get('/applications', bookSelectionController.getBookSelectionApplications);
router.post('/applications', bookSelectionController.addBookSelectionApplication);
router.put('/applications', bookSelectionController.updateBookSelectionApplication);
router.delete('/applications/:ApplicationID', bookSelectionController.deleteBookSelectionApplication);

// 征订计划路由
router.get('/plans', bookSelectionController.getSubscriptionPlans);
router.post('/plans', bookSelectionController.addSubscriptionPlan);
router.put('/plans', bookSelectionController.updateSubscriptionPlan);
router.delete('/plans/:PlanID', bookSelectionController.deleteSubscriptionPlan);

// 教材版本路由
router.get('/versions', bookSelectionController.getBookVersions);
router.post('/versions', bookSelectionController.addBookVersion);
router.put('/versions', bookSelectionController.updateBookVersion);
router.delete('/versions/:VersionID', bookSelectionController.deleteBookVersion);

module.exports = router;