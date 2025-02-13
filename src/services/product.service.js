import { DB } from "../database/index.js";

export class ProductService {
  /**
   * Get User
   * @param product
   * @returns {Promise<result>}
   */
  static async createProduct(product) {
    // Destruct Product Object
    const { name, description, image, productType, programId, variants } =
      product;

    try {
      const result = await DB.Product.create({
        name,
        description,
        image,
        productType,
        programId,
      });
      const variantsInput = await variants.map(
        async (variant) =>
          await this.createProductVariants({
            ...variant,
            productId: result.id,
          }),
      );

      return { result, variantsInput };
    } catch (error) {
      throw new Error(error);
    }
  }
  // Array Product Variants
  static async createProductVariants(variant) {
    const { productId, name, size, price, stockQuantity } = variant;
    const result = DB.ProductVariant.create({
      productId,
      name,
      size,
      price,
      stockQuantity,
    });
    return result;
  }

  static async getProducts() {
    const result = DB.Product.findAll();
    return result;
  }
}
