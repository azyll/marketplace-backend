import express from 'express';
import {getInventory, getInventoryAlerts, getInventoryValue} from '../../controllers/product.controller.js';

const router = express.Router();
router.get('/inventory/alerts', getInventoryAlerts);
router.get('/inventory/value', getInventoryValue);
router.get('/inventory', getInventory);
export default router;

