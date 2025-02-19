import { Op } from "sequelize";
import { DB } from "../database/index.js";

export class ProductService {
  /**
   * Add Product
   * @param {object} product
   *
   */
  static async createProduct(product) {
    // Destruct Product Object
    const { name, description, image, type, category, programId, variants } =
      product;

    const result = await DB.Product.create({
      name,
      description,
      image,
      type,
      category,
      programId,
    });
    const variantsPromises = await variants.map(async (variant) => {
      return this.createProductVariants({
        ...variant,
        productId: result.id,
      });
    });
    const variantsInput = await Promise.all(variantsPromises);

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
