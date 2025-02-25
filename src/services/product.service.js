import { Op } from "sequelize";
import { DB } from "../database/index.js";
import { NotFoundException } from "../exceptions/notFound.js";
import { AlreadyExistException } from "../exceptions/alreadyExist.js";

export class ProductService {
  static async createProduct(productData) {
    const { name, description, image, type, category, programId, variants } =
      productData;

    const program = await DB.Program.findOne({
      where: { id: programId },
    });
    if (!program) throw new NotFoundException("Program not found", 404);

    const productName = await DB.Product.findOne({
      where: { name },
    });
    if (productName)
      throw new AlreadyExistException("Product is already exists");
    const product = await DB.Product.create({
      name,
      description,
      image,
      type,
      category,
      programId,
    });
    const productVariants = await Promise.all(
      variants.map(
        async (variant) =>
          await this.createProductVariant({
            ...variant,
            productId: product.id,
          }),
      ),
    );

    return { product, productVariants };
  }

  // Array Product Variants
  // const { productId, name, size, price, stockQuantity } = variant;
  static async createProductVariant(variant) {
    const productVariant = await DB.ProductVariant.create(variant);
    return productVariant;
  }

  static async getProducts() {
    const products = await DB.Product.findAll({
      include: DB.ProductVariant,
    });
    return products;
  }
  static async getProductsByProgram(programId) {
    const program = await DB.Program.findOne({
      where: { id: programId },
    });
    if (!program) throw new NotFoundException("Program not found", 404);

    const productsFilteredByProgram = await DB.Product.findAll({
      where: {
        programId,
      },
    });
    return productsFilteredByProgram;
  }

  // Params: id = Product id
  static async getProduct(id) {
    const product = await DB.Product.findOne({
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
    if (!product) throw new NotFoundException("Product not found", 404);
    return product;
  }
}
