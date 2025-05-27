import express from "express";
import {
  addUser,
  archiveUser,
  updateUser,
  getAllUsers,
  getUser,
  restoreUser,
  updatePassword,
  createRole,
} from "../../controllers/user.controller.js";
import { validate } from "../../middleware/validation.js";
import { Joi } from "sequelize-joi";
import { auth } from "../../middleware/auth.js";

const router = express.Router();

// Get User by UserId
router.get("/:userId", auth(["admin"]), getUser);

// Get All Users
router.get("/", auth(["admin", "student"]), getAllUsers);

// Create User
// router.post("/", auth(["admin"]), addUser);
router.post("/", addUser);
// router.post("/", addUser);

// Update User
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

// Archive User
router.delete("/:userId", auth(["admin"]), archiveUser);

// Restore User
router.post("/:userId/restore", auth(["admin"]), restoreUser);

// Update User Password
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

// Create Role
router.post(
  "/role",
  validate({
    name: Joi.string().required(),
    systemTag: Joi.string().required().valid("student", "admin", "employee"),
  }),
  createRole,
);

export default router;
