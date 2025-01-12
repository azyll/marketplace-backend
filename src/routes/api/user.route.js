import express from "express";
import {
  addUser,
  archiveUser,
  updateUser,
  getAllUsers,
  getUser,
  restoreUser,
} from "../../controllers/user.controller.js";

const router = express.Router();

router.get("/:id", getUser);

router.get("/", getAllUsers);

router.post("/", addUser);

router.put("/:id", updateUser);

router.delete("/:id", archiveUser);

router.post("/:id/restore", restoreUser);

export default router;
