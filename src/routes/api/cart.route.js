import {Router} from 'express';
import {
  createStudentCart,
  getStudentCart,
  updateStudentCart,
  deleteStudentCart
} from '../../controllers/cart.controller.js';
const router = Router();

// Create Student Cart
router.post('/:userId', createStudentCart);
// Get Student`s Cart
router.get('/:userId', getStudentCart);
// Update item in Student Cart
router.put('/:userId', updateStudentCart);
// Delete item in Student Cart
router.delete('/:userId', deleteStudentCart);

export default router;
