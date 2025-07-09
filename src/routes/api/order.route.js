import {Router} from 'express';
import {validate} from '../../middleware/validation.js';
import {
  createOrder,
  getStudentOrder,
  updateOrderStatus,
  updateStudentOrder,
  deleteStudentOrder,
  getOrders,
  getOrder,
  getAnnualOrders
} from '../../controllers/order.controller.js';
import {Joi} from 'sequelize-joi';
const router = Router();

router.get('/', getOrders);
router.get('/annual', getAnnualOrders);

// Get Student Orders by StudentId
router.get('/student/:userId', getStudentOrder);

// Update Order Status
router.put('/status/:userId', updateOrderStatus);

// Update Order Items
router.put('/:userId', updateStudentOrder);

// Delete Order
router.delete('/:userId', deleteStudentOrder);

// Get Order
router.get('/:orderId', getOrder);

// Create Order
router.post('/:userId', createOrder);

export default router;
