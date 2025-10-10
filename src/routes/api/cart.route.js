import {Router} from 'express';
import {
  createStudentCart,
  getStudentCart,
  updateStudentCart,
  deleteStudentCart,
  addCartItemQuantity,
  deductCartItemQuantity
} from '../../controllers/cart.controller.js';
import {auth} from '../../middleware/auth.js';
import {validate} from '../../middleware/validation.js';
import {Joi} from 'sequelize-joi';
const router = Router();

// Create Student Cart
router.post(
  '/:userId',
  auth(['student'], {
    selfOnly: {
      param: 'userId',
      roles: ['student']
    }
  }),
  validate({
    product: Joi.string().uuid().required(),
    quantity: Joi.number().integer().min(0).required()
  }),
  createStudentCart
);
// Get Student`s Cart
router.get(
  '/:userId',
  auth(['student'], {
    selfOnly: {
      param: 'userId',
      roles: ['student']
    }
  }),
  getStudentCart
);

router.put(
  '/:userId/add',
  auth(['student'], {
    selfOnly: {
      param: 'userId',
      roles: ['student']
    }
  }),
  validate({
    cartId: Joi.number().integer().min(0).required()
  }),
  addCartItemQuantity
);
router.put(
  '/:userId/deduct',
  auth(['student'], {
    selfOnly: {
      param: 'userId',
      roles: ['student']
    }
  }),
  validate({
    cartId: Joi.number().integer().min(0).required()
  }),
  deductCartItemQuantity
);
// Update item in Student Cart
router.put(
  '/:userId',
  auth(['student'], {
    selfOnly: {
      param: 'userId',
      roles: ['student']
    }
  }),
  validate({
    cartId: Joi.number().integer().min(0).required()
  }),
  updateStudentCart
);

// Archive cart item
router.delete(
  '/:userId',
  auth(['student'], {
    selfOnly: {
      param: 'userId',
      roles: ['student']
    }
  }),
  validate({
    productVariantIds: Joi.array().items(Joi.string().uuid()).required()
  }),
  deleteStudentCart
);

export default router;
