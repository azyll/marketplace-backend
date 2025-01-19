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
import { validate } from "../../middleware/validation.js";
import { Joi } from "sequelize-joi";
import { auth } from "../../middleware/auth.js";

const router = express.Router();

router.get("/:userId", auth(["admin"]), getUser);

router.get("/", auth(["admin", "student"]), getAllUsers);

router.post("/", auth(["admin"]), addUser);

router.put(
  "/:userId",
  auth(["admin", "student", "employee"], {
    selfOnly: {
      param: "userId",
      roles: ["employee", "student"],
    },
  }),
  validate({
    firstName: Joi.string(),
    lastName: Joi.string(),
  }),
  updateUser,
);

router.delete("/:userId", auth(["admin"]), archiveUser);

router.post("/:userId/restore", auth(["admin"]), restoreUser);

router.post(
  "/:userId/update-password",
  auth(["admin", "student", "employee"], {
    selfOnly: {
      param: "userId",
      roles: ["employee", "student"],
    },
  }),
  validate({
    newPassword: Joi.string().required(),
    oldPassword: Joi.string().required(),
  }),
  updatePassword,
);

export default router;
