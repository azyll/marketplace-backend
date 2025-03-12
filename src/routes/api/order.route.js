import { Router } from "express";
import { validate } from "../../middleware/validation.js";
import {
  createOrder,
  getStudentOrdersByStudentId,
  updateStudentOrderStatus,
  updateStudentOrder,
  deleteStudentOrder,
} from "../../controllers/order.controller.js";
import { Joi } from "sequelize-joi";
const router = Router();

// Create Student Order
router.post("/:studentId", createOrder);
// Get Student Orders by StudentId
router.get("/:studentId", getStudentOrdersByStudentId);
// Update Student Order
router.put("/status/:studentId", updateStudentOrderStatus);

// validate({
//   type: Joi.string()
//     .required()
//     .trim()
//     .valid("increment", "decrement", "delete"),
// })
router.put("/:studentId", updateStudentOrder);

// Delete Student Order
router.delete("/:studentId", deleteStudentOrder);

export default router;
