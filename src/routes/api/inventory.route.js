import express from 'express';
import {getInventory, getInventoryAlerts, getInventoryValue} from '../../controllers/product.controller.js';
import {auth} from '../../middleware/auth.js';

const router = express.Router();
router.get('/inventory/alerts', auth(['admin', 'employee']), getInventoryAlerts);
router.get('/inventory/value', auth(['admin', 'employee']), getInventoryValue);
router.get('/inventory', auth(['admin', 'employee']), getInventory);
export default router;

