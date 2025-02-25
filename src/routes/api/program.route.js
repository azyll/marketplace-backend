import { Router } from "express";

import { createProgram } from "../../controllers/program.controller.js";

const router = Router();

// Create Program
router.post("/", createProgram);

export default router;
