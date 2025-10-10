import {
  createReturnItem,
  getReturnItems,
  restoreReturnedItems,
  updateReturnItemQuantity
} from '../../controllers/returned.item.controller.js';
import express from 'express';
import {auth} from '../../middleware/auth.js';
import {Joi} from 'sequelize-joi';
import {validate} from '../../middleware/validation.js';
const router = express.Router();

router.get(
  '/',
  auth(['admin', 'employee']),

  getReturnItems
);
router.post(
  '/',
  auth(['admin', 'employee']),
  validate({
    productVariant: Joi.string().trim().uuid().required(),
    reason: Joi.string().required(),
    quantity: Joi.number().integer().min(1).default(1)
  }),
  createReturnItem
);
router.put(
  '/quantity',
  auth(['admin', 'employee']),
  validate({
    quantity: Joi.number().integer().min(1).default(1)
  }),
  updateReturnItemQuantity
);
router.delete('/', auth(['admin', 'employee']), restoreReturnedItems);
export default router;

