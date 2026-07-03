const express = require('express');
const router = express.Router();
const purchasingController = require('../controllers/purchasing');

// 供应商管理路由
router.get('/suppliers', purchasingController.getSuppliers);
router.post('/suppliers', purchasingController.addSupplier);
router.put('/suppliers', purchasingController.updateSupplier);
router.delete('/suppliers/:SupplierID', purchasingController.deleteSupplier);

// 采购单管理路由
router.get('/orders', purchasingController.getPurchaseOrders);
router.post('/orders', purchasingController.addPurchaseOrder);
router.put('/orders', purchasingController.updatePurchaseOrder);
router.delete('/orders/:PurchaseOrderID', purchasingController.deletePurchaseOrder);

// 采购进度管理路由
router.get('/progress/:PurchaseOrderID', purchasingController.getPurchaseProgress);
router.post('/progress', purchasingController.addPurchaseProgress);

// 发票管理路由
router.get('/invoices', purchasingController.getInvoices);
router.post('/invoices', purchasingController.addInvoice);
router.put('/invoices', purchasingController.updateInvoice);
router.delete('/invoices/:InvoiceID', purchasingController.deleteInvoice);

module.exports = router;