import { Router } from "express";

import { createOrder } from "../../controllers/student.controller.js";

const orderRoute = Router();

orderRoute.get("/", async (req, res) => {});
orderRoute.post("/", createOrder);
orderRoute.get("/:id", async (req, res) => {});
export default orderRoute;
