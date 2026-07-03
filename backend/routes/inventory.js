const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory');

router.get('/query', inventoryController.getInventory);
router.get('/low-stock', inventoryController.getLowStock);

router.get('/warehouses', inventoryController.getWarehouses);
router.post('/warehouses', inventoryController.addWarehouse);
router.put('/warehouses', inventoryController.updateWarehouse);
router.delete('/warehouses/:WarehouseID', inventoryController.deleteWarehouse);

router.get('/inbound', inventoryController.getInboundRecords);
router.post('/inbound', inventoryController.addInbound);

router.get('/outbound', inventoryController.getOutboundRecords);
router.post('/outbound', inventoryController.addOutbound);

router.get('/checks', inventoryController.getInventoryChecks);
router.get('/checks/:CheckID', inventoryController.getInventoryCheckDetail);
router.post('/checks', inventoryController.addInventoryCheck);
router.put('/checks/detail', inventoryController.updateInventoryCheckDetail);
router.put('/checks/complete', inventoryController.completeInventoryCheck);
router.delete('/checks/:CheckID', inventoryController.deleteInventoryCheck);

module.exports = router;