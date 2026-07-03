const express = require('express');
const router = express.Router();
const distributionController = require('../controllers/distribution');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/lists', distributionController.getDistributionLists);
router.delete('/lists/:id', distributionController.deleteDistributionList);
router.get('/records', distributionController.getDistributionRecords);
router.get('/records/:id', distributionController.getDistributionRecord);
router.post('/records', distributionController.addDistributionRecord);
router.put('/records/:id', distributionController.updateDistributionRecord);
router.delete('/records/:id', distributionController.deleteDistributionRecord);
router.post('/generate-list', distributionController.generateClassDistributionList);

module.exports = router;