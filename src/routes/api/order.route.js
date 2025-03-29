import {Router} from 'express';
import {validate} from '../../middleware/validation.js';
import {
  createOrder,
  getStudentOrder,
  updateOrderStatus,
  updateStudentOrder,
  deleteStudentOrder,
  getOrders,
  getOrder
} from '../../controllers/order.controller.js';
import {Joi} from 'sequelize-joi';
const router = Router();

router.get('/', getOrders);

// Get Student Orders by StudentId
router.get('/student/:studentId', getStudentOrder);

// Update Order Status
router.put('/status/:studentId', updateOrderStatus);

// Update Order Items
router.put('/:studentId', updateStudentOrder);

// Delete Order
router.delete('/:studentId', deleteStudentOrder);

// Get Order
router.get('/:orderId', getOrder);

// Create Order
router.post('/:studentId', createOrder);

export default router;
