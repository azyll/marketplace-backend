import { Router } from "express";

import {
  createOrder,
  getStudentOrdersByStudentId,
  updateStudentOrder,
  deleteStudentOrder,
} from "../../controllers/order.controller.js";
const router = Router();

// Create Student Order
router.post("/:studentId", createOrder);
// Get Student Orders by StudentId
router.get("/:studentId", getStudentOrdersByStudentId);
// Update Student Order
router.put("/:studentId", updateStudentOrder);
// Delete Student Order
router.delete("/:studentId", deleteStudentOrder);

export default router;
