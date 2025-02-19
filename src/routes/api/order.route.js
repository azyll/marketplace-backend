import { Router } from "express";
import { OrderService } from "../../services/order.service.js";

const orderRoute = Router();

orderRoute.get("/", async (req, res) => {});
orderRoute.post("/", async (req, res) => {
  const { studentId, orderItems } = req.body;
  try {
    const result = OrderService.createOrder({ studentId, orderItems });
    return res.status(200).json({ message: "success", result });
  } catch (error) {
    return res.status(400).json({ message: "error", error });
  }
});
orderRoute.get("/:id", async (req, res) => {});
export default orderRoute;
