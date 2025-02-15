import { Op } from "sequelize";
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

    const result = await DB.Product.create({
      name,
      description,
      image,
      productType,
      programId,
    });
    const variantsInput = await variants.map(async (variant) => {
      return this.createProductVariants({
        ...variant,
        productId: result.id,
      });
    });

    return { result, variantsInput };
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
    const result = DB.Product.findAll({
      include: DB.ProductVariant,
    });
    return result;
  }
  static async getProductsByProgram(programId) {}
  // Params: id = Product id
  static async getProduct(id) {
    const result = DB.Product.findOne({
      include: [
        {
          model: DB.ProductVariant,
        },
      ],

      where: {
        id,
        deletedAt: { [Op.is]: null },
      },
    });
    console.log(await result);
    return result;
  }
}
