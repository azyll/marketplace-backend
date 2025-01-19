import express from "express";
import userRoutes from "./api/user.route.js";
import studentRoute from "./api/student.route.js";
import authRoute from "./api/auth.route.js";
const router = express.Router();

router.use("/user", userRoutes);
router.use("/student", studentRoute);
router.use("/auth", authRoute);

export default router;
