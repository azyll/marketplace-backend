import { Router } from "express";

import { createProgram } from "../../controllers/program.controller.js";

const router = Router();

router.post("/", createProgram);

export default router;
