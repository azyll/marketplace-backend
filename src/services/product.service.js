import {Op} from 'sequelize';
import {DB} from '../database/index.js';
import {NotFoundException} from '../exceptions/notFound.js';
import {AlreadyExistException} from '../exceptions/alreadyExist.js';

const {Product, Program, ProductVariant} = DB;
export class ProductService {
  /**
   * @param {{name:string, description:string, image:string
   * , type:"top"| "bottom"| "n/a", category:string, programId:string, variants:{
   *  name:string,
   *  size:string,
   *  price:number,
   *  stockQuantity:number
   * }[]}} Product - New Product
   * @returns {Promise<Product>} Product data from the database
   * @throws {NotFoundException} If Program does not exists
   * @throws {AlreadyExistException} if Product is already existing
   */
  static async createProduct(Product) {
    const {category, description, image, name, programId, type, variants} = Product;
    const program = await Program.findOne({
      where: {id: programId}
    });
    if (!program) throw new NotFoundException('Program not found', 404);

    const productName = await Product.findOne({
      where: {name}
    });
    if (productName) throw new AlreadyExistException('Product is already exists');
    const product = await Product.create(
      {
        name,
        description,
        image,
        type,
        category,
        programId,
        ProductVariants: variants
      },
      {
        include: [ProductVariant]
      }
    );

    return {product};
  }

  /**
   *
   * @returns {Promise<Product[]>} All products
   */
  static async getProducts() {
    const products = await Product.findAll({
      include: ProductVariant
    });
    return products;
  }
  /**
   *
   * @param {string} programId
   * @throws {NotFoundException} if program does not exists
   * @returns {Promise<Product[]>} all products filtered by program
   */
  static async getProductsByProgram(programId) {
    const program = await DB.Program.findOne({
      where: {id: programId}
    });
    if (!program) throw new NotFoundException('Program not found', 404);

    const productsFilteredByProgram = await DB.Product.findAll({
      where: {
        programId
      }
    });
    return productsFilteredByProgram;
  }

  /**
   * Get a single Product
   * @param {string} productId
   * @returns {Promise<Product>} get a product and its variants
   * @throws {NotFoundException} if product does not exists
   */
  static async getProduct(productId) {
    const product = await DB.Product.findOne({
      include: [
        {
          model: DB.ProductVariant
        }
      ],
      where: {
        id: productId,
        deletedAt: {[Op.is]: null}
      }
    });
    if (!product) throw new NotFoundException('Product not found', 404);
    return product;
  }
  static async deleteProduct(productId) {}
  static async editProduct(product) {}
}
