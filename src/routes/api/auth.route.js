import express from "express";
import { login } from "../../controllers/auth.controller.js";
import { validate } from "../../middleware/validation.js";
import { Joi } from "sequelize-joi";

const router = express.Router();

// User Login
router.post(
  "/login",
  validate({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  login,
);

export default router;
