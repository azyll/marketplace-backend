import { OrderService } from "../services/order.service.js";

export const createOrder = async (req, res) => {
  const { studentId } = req.params;
  const { orderItems } = req.body;
  try {
    const result = await OrderService.createOrder({ studentId, orderItems });
    return res.status(200).json({ message: "success", result });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "error", error: error?.message || "error" });
  }
};

export const getStudentOrdersByStudentId = async (req, res) => {
  const { studentId } = req.params;
  try {
    const result = await OrderService.getStudentOrdersByStudentId(studentId);
    return res.status(200).json({ message: "success", result });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "error", error: error?.message || "error" });
  }
};

export const updateStudentOrder = async (req, res) => {
  const { studentId } = req.params;
  const { orderId } = req.body;
  try {
    const result = await OrderService.updateStudentOrdersByStudentId({
      studentId,
      orderId,
    });
    return res.status(200).json({ message: "success", result });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "error", error: error?.message || "error" });
  }
};

export const deleteStudentOrder = async (req, res) => {
  const { studentId } = req.params;
  const { orderId } = req.body;
  try {
    const result = await OrderService.deleteStudentOrdersByStudentId({
      studentId,
      orderId,
    });
    return res.status(200).json({ message: "success", result });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "error", error: error?.message || "error" });
  }
};
