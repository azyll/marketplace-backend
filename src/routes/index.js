import express from "express";
import userRoutes from "./api/user.route.js";
import studentRoute from "./api/student.route.js";
const router = express.Router();

router.use("/user", userRoutes);
router.use("/student", studentRoute);

export default router;
