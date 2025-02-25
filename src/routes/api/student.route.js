import express from "express";
import { validate } from "../../middleware/validation.js";
import { Joi } from "sequelize-joi";
import {
  createStudent,
  getStudentByUserId,
  getStudentOrdersByStudentId,
} from "../../controllers/student.controller.js";
import { auth } from "../../middleware/auth.js";
import { CartService } from "../../services/cart.service.js";

const router = express.Router();
router.post("/cart", async (req, res) => {
  const { studentId, productVariantsIds } = req.body;
  try {
    const result = await CartService.createCart(studentId, productVariantsIds);
    return res.status(200).json({ message: "success", result });
  } catch (error) {
    return res
      .status(error.statusCode || 400)
      .json({ message: "error", error: error?.message || "error" });
  }
});
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
// Get Cart by StudentId
router.get("/:studentId/cart", getStudentOrdersByStudentId);

export default router;
