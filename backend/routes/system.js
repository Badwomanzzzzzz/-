const express = require('express');
const router = express.Router();
const systemController = require('../controllers/system');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/users', systemController.getUsers);
router.get('/users/:id', systemController.getUser);
router.get('/users/:id/roles', systemController.getUserRoles);
router.post('/users', systemController.createUser);
router.put('/users/:id', systemController.updateUser);
router.delete('/users/:id', systemController.deleteUser);

router.get('/roles', systemController.getRoles);
router.post('/roles', systemController.createRole);
router.put('/roles/:id', systemController.updateRole);
router.delete('/roles/:id', systemController.deleteRole);

router.get('/roles/:roleID/menus', systemController.getRoleMenus);
router.put('/roles/:roleID/menus', systemController.updateRoleMenus);

router.get('/menus', systemController.getMenus);

router.get('/logs', systemController.getLogs);

router.post('/change-password', systemController.changePassword);

module.exports = router;