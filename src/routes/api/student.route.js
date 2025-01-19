import express from "express";
import { validate } from "../../middleware/validation.js";
import { Joi } from "sequelize-joi";
import {
  createStudent,
  getStudentByUserId,
} from "../../controllers/student.controller.js";

const router = express.Router();

router.post(
  "/:userId",
  validate({
    program: Joi.string().required(),
    level: Joi.string().required().valid("shs", "tertiary"),
  }),
  createStudent,
);

router.get("/user/:userId", getStudentByUserId);

export default router;
