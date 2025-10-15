import express from 'express';

import {validate} from '../../middleware/validation.js';
import {Joi} from 'sequelize-joi';
import {auth} from '../../middleware/auth.js';
import {getInventory, getOrders, getProducts, getSales} from '../../controllers/report.controller.js';

const router = express.Router();

// Get Order Report Login
router.get('/order', auth(['admin', 'employee']), getOrders);

// Get Order Report Login
router.get('/sales', auth(['admin', 'employee']), getSales);
// Get Order Report Login
router.get('/product', auth(['admin', 'employee']), getProducts);

// Get Order Report Login
router.get('/inventory', auth(['admin', 'employee']), getInventory);

export default router;

