import { CartService } from "../services/cart.service.js";
export const createStudentCart = async (req, res) => {
  const { studentId } = req.params;
  const { productVariantsIds } = req.body;
  try {
    const result = await CartService.createCart(studentId, productVariantsIds);
    return res.status(200).json({ message: "success", result });
  } catch (error) {
    return res
      .status(error.statusCode || 400)
      .json({ message: "error", error: error?.message || "error" });
  }
};

export const getStudentCartByStudentId = async (req, res) => {
  const { studentId } = req.params;

  try {
    //
    const result = await CartService.getStudentCartByStudentId(studentId);
    return res.status(200).json({ message: "success", result });
  } catch (error) {
    return res
      .status(error.statusCode || 400)
      .json({ message: "error", error: error?.message || "error" });
  }
};
export const updateStudentCart = async (req, res) => {
  const { studentId } = req.params;
  const { cartId } = req.body;
  try {
    //
    const result = await CartService.updateStudentCart({ studentId, cartId });
    return res.status(200).json({ message: "success", result });
  } catch (error) {
    return res
      .status(error.statusCode || 400)
      .json({ message: "error", error: error?.message || "error" });
  }
};
export const deleteStudentCart = async (req, res) => {
  const { studentId } = req.params;
  const { cartId } = req.body;
  try {
    //
    const result = await CartService.deleteStudentCart({ studentId, cartId });
    return res.status(200).json({ message: "success", result });
  } catch (error) {
    return res
      .status(error.statusCode || 400)
      .json({ message: "error", error: error?.message || "error" });
  }
};
