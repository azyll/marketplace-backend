import express from "express";
import userRoutes from "./api/user.route.js";
const router = express.Router();

router.use("/user", userRoutes);

export default router;
