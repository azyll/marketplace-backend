import {
  createReturnItem,
  getReturnItems,
  restoreReturnedItems,
  updateReturnItemQuantity
} from '../../controllers/returned.item.controller.js';
import express from 'express';
const router = express.Router();

router.get('/', getReturnItems);
router.post('/', createReturnItem);
router.put('/quantity', updateReturnItemQuantity);
router.delete('/', restoreReturnedItems);
export default router;

