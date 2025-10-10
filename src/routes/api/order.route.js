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
import {auth} from '../../middleware/auth.js';

const router = Router();

//Get All Order
router.get('/', auth(['admin', 'employee', 'student']), getOrders);

//Get Annual Orders
router.get('/annual', auth(['admin', 'employee']), getAnnualOrders);

// Get Student Orders by StudentId
router.get(
  '/student/:userId',
  auth(['student'], {
    selfOnly: {
      param: 'userId',
      roles: ['student']
    }
  }),
  getStudentOrder
);

// Update Order Status
router.put(
  '/status/:userId',
  auth(['admin', 'employee']),
  validate({
    orderId: Joi.string().uuid().required(),
    newStatus: Joi.string().required().trim().valid('completed', 'ongoing', 'cancelled', 'confirmed'),
    oracleInvoice: Joi.string().optional()
  }),
  updateOrderStatus
);

// Update Order Items
router.put(
  '/:orderId',
  auth(['admin', 'employee', 'student']),
  validate({
    orderItems: Joi.array()
      .items(
        Joi.object({
          productVariantId: Joi.string().uuid().required(),
          quantity: Joi.number().integer().positive().required()
        })
      )
      .min(1)
      .required()
  }),
  updateStudentOrder
);

// Delete Order
router.delete(
  '/:userId',
  auth(['admin', 'employee', 'student']),
  validate({
    orderId: Joi.string().uuid().required()
  }),
  deleteStudentOrder
);

// Get Order by order id
router.get('/:orderId', auth(['admin', 'employee', 'student']), getOrder);

// Create Order
router.post(
  '/:userId',
  auth(['student'], {
    selfOnly: {
      param: 'userId',
      roles: ['student']
    }
  }),
  validate({
    orderItems: Joi.array()
      .items(
        Joi.object({
          productVariantId: Joi.string().uuid().required(),
          quantity: Joi.number().integer().positive().required()
        })
      )
      .min(1)
      .required()
  }),
  createOrder
);

export default router;
