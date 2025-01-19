import express from "express";
import { updatePassword } from "../../controllers/user.controller.js";
import { validate } from "../../helpers/validation.js";
import { Joi } from "sequelize-joi";
import {
  createStudent,
  getStudentByUserId,
} from "../../controllers/student.controller.js";
import { auth } from "../../middleware/auth.js";

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
