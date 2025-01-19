import express from "express";
import {
  addUser,
  archiveUser,
  updateUser,
  getAllUsers,
  getUser,
  restoreUser,
  updatePassword,
} from "../../controllers/user.controller.js";
import { validate } from "../../helpers/validation.js";
import { Joi } from "sequelize-joi";
import { auth } from "../../middleware/auth.js";

const router = express.Router();

router.get("/:id", getUser);

router.get("/", getAllUsers);

router.post("/", addUser);

router.put("/:id", updateUser);

router.delete("/:id", archiveUser);

router.post("/:id/restore", restoreUser);

router.post(
  "/:id/update-password",
  validate({
    newPassword: Joi.string().required(),
    oldPassword: Joi.string().required(),
  }),
  updatePassword,
);

export default router;
