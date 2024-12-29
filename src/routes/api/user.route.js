import express from "express";
import {
  addUser,
  deleteUser,
  getAllUsers,
  getUser,
} from "../../controllers/UserController.js";

const router = express.Router();

router.get("/:id", getUser);

router.get("/", getAllUsers);

router.post("/", addUser);

router.put("/:id", (req, res) => {});

router.delete("/:id", deleteUser);

export default router;
