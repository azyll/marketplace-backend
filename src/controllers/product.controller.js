import { ProductService } from "../services/product.service.js";

export const addProduct = async (req, res) => {
  const { name, description, image, type, category, variants, programId } =
    req.body;

  try {
    const result = await ProductService.createProduct({
      name,
      description,
      image,
      type,
      category,
      programId,
      variants,
    });
    return res.status(200).json({ message: "post", result });
  } catch (error) {
    console.table(error);
    return res.status(404).json({ message: error.message || "error", error });
  }
};

export const getProducts = async (req, res) => {
  try {
    const result = await ProductService.getProducts();
    return res.status(200).json({ message: "products", result });
  } catch (error) {
    return res.status(404).json({ message: "error", error });
  }
};
export const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await ProductService.getProduct(id);
    return res.status(200).json({ message: "product", result });
  } catch (error) {
    return res.status(404).json({ message: "error", error });
  }
};
