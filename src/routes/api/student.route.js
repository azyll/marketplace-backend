import express from "express";
import { validate } from "../../middleware/validation.js";
import { Joi } from "sequelize-joi";
import {
  createStudent,
  getStudentByUserId,
} from "../../controllers/student.controller.js";
import { auth } from "../../middleware/auth.js";

import {
  createStudentCart,
  getStudentCartByStudentId,
  updateStudentCart,
  deleteStudentCart,
} from "../../controllers/cart.controller.js";
import {
  createOrder,
  getStudentOrdersByStudentId,
  updateStudentOrder,
  deleteStudentOrder,
} from "../../controllers/order.controller.js";

const router = express.Router();

// Create Student Cart
router.post("/cart/:studentId", createStudentCart);
// Get Student`s Cart
router.get("/cart/:studentId", getStudentCartByStudentId);
// Update item in Student Cart
router.put("/cart/:studentId", updateStudentCart);
// Delete item in Student Cart
router.delete("/cart/:studentId", deleteStudentCart);

// Create Student Order
router.post("/order/:studentId", createOrder);
// Get Student Orders by StudentId
router.get("/order/:studentId", getStudentOrdersByStudentId);
// Update Student Order
router.put("/order/:studentId", updateStudentOrder);
// Delete Student Order
router.delete("/order/:studentId", deleteStudentOrder);

// Create Student
router.post(
  "/:userId",
  auth(["admin"]),
  validate({
    // Question? ano i type isesend ng frontend? progId ba or name?
    id: Joi.number().required(),
    programId: Joi.string().required(),
    level: Joi.string().required().valid("shs", "tertiary"),
  }),
  createStudent,
);

// Get Student by UserId
router.get(
  "/user/:userId",
  auth(["student"], { selfOnly: { param: "userId", roles: ["student"] } }),
  getStudentByUserId,
);

export default router;
