import express from "express";
import { validate } from "../../middleware/validation.js";
import { Joi } from "sequelize-joi";
import {
  createStudent,
  getStudentByUserId,
} from "../../controllers/student.controller.js";
import { auth } from "../../middleware/auth.js";

const router = express.Router();

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
