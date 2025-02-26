import express from "express";
import userRoutes from "./api/user.route.js";
import studentRoute from "./api/student.route.js";
import authRoute from "./api/auth.route.js";
import productRoute from "./api/product.route.js";
import programRoute from "./api/program.route.js";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/student", studentRoute);
router.use("/auth", authRoute);
router.use("/product", productRoute);
router.use("/program", programRoute);

export default router;
