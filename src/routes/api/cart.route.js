import { Router } from "express";
import {
  createStudentCart,
  getStudentCartByStudentId,
  updateStudentCart,
  deleteStudentCart,
} from "../../controllers/cart.controller.js";
const router = Router();

// Create Student Cart
router.post("/:studentId", createStudentCart);
// Get Student`s Cart
router.get("/:studentId", getStudentCartByStudentId);
// Update item in Student Cart
router.put("/:studentId", updateStudentCart);
// Delete item in Student Cart
router.delete("/:studentId", deleteStudentCart);

export default router;
