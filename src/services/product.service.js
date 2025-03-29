// @ts-check
import {Op} from 'sequelize';
import {DB} from '../database/index.js';
import {NotFoundException} from '../exceptions/notFound.js';
import {AlreadyExistException} from '../exceptions/alreadyExist.js';

const {Product, Program, ProductVariant} = DB;

/**
 * @typedef {import ('../types/index.js').PaginatedResponse<Product>} ProductResponse
 * @typedef {import ('../types/index.js').QueryParams} QueryParams
 */

export class ProductService {
  /**
   * @param {{name:string, description:string, image:string
   * , type:"top"| "bottom"| "n/a", category:"uniform"| "proware"| "stationery accessory", programId:string, variants:{
   *  name:string,
   *  size:string,
   *  price:number,
   *  stockQuantity:number
   * }[]}} newProduct - New Product
   * @returns {Promise<Product>} Product data from the database
   * @throws {NotFoundException} If Program does not exists
   * @throws {AlreadyExistException} if Product is already existing
   */
  static async createProduct(newProduct) {
    const {category, description, image, name, programId, type, variants} = newProduct;
    const program = await Program.findByPk(programId);
    if (!program) {
      throw new NotFoundException('Program not found', 404);
    }

    const [product, isJustCreated] = await Product.findOrCreate({
      where: {name},
      defaults: {
        name,
        description,
        image,
        type,
        category,
        programId,
        ProductVariants: variants
      },
      include: [ProductVariant]
    });
    if (!isJustCreated) {
      throw new AlreadyExistException('Product is already exists');
    }
    // @ts-ignore
    return product;
  }

  /**
   * @param {QueryParams} query Query
   * @returns {Promise<ProductResponse>} All products
   */
  static async getProducts(query) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const {count, rows: productData} = await Product.findAndCountAll({
      include: [ProductVariant]
    });

    return {
      data: productData,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: count
      }
    };
  }
  /**
   *
   * @param {string} programId
   * @param {QueryParams} query
   * @throws {NotFoundException}  Program not found
   * @returns {Promise<ProductResponse>} All products filtered by program
   */
  static async getProductsByProgram(programId, query) {
    const program = await Program.findByPk(programId);
    if (!program) throw new NotFoundException('Program not found', 404);

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const {count, rows: productData} = await Product.findAndCountAll({
      where: {
        programId
      },
      include: [ProductVariant]
    });
    return {
      data: productData,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: count
      }
    };
  }

  /**
   * Get a single Product
   * @param {string} id - Product Id
   * @returns {Promise<Product>} get a product and its variants
   * @throws {NotFoundException} Product not found
   */
  static async getProduct(id) {
    const product = await Product.findOne({
      include: [ProductVariant],
      where: {
        id,
        deletedAt: {[Op.is]: null}
      }
    });
    if (!product) throw new NotFoundException('Product not found', 404);
    return product;
  }
  static async deleteProduct(productId) {}
  static async editProduct(product) {}
}
