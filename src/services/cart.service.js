// @ts-check
import {DB} from '../database/index.js';
import {AlreadyExistException} from '../exceptions/alreadyExist.js';
import {NotFoundException} from '../exceptions/notFound.js';

const {Cart, Student, ProductVariant, Product} = DB;

/**
 * @typedef {import('../types/index.js').QueryParams} QueryParams
 * @typedef {import('../types/index.js').PaginatedResponse<Cart>} PaginatedCart
 */

export class CartService {
  /** 
   * Add Item To Student Cart
   * @param {string} studentId - Student id   
   * @param {string} productVariantId  - ID of product variant
   * @throws {NotFoundException} Product or student not found
   * @throws {AlreadyExistException} Since one order for student, 
    throws error if the item is already exist in the student cart
   * @returns {Promise<ProductVariant>}  Inserted Product to the database
   **/
  static async addItemToCart(studentId, productVariantId) {
    const student = await Student.findByPk(studentId);

    if (!student) {
      throw new NotFoundException('Student not found', 404);
    }
    const product = await ProductVariant.findByPk(productVariantId);
    // if product null
    if (!product) {
      throw new NotFoundException('Product not found', 404);
    }

    const [productVariant, isNewItem] = await Cart.findOrCreate({
      where: {studentId, productVariantId},
      defaults: {
        quantity: 1,
        studentId,
        productVariantId
      }
    });

    // If already exists, and not just created
    if (!isNewItem) {
      throw new AlreadyExistException('The selected product is already in your cart', 409);
    }

    return productVariant;
  }

  /**
   * Get Student Cart
   * @param {string} studentId
   * @param {QueryParams|undefined} query -Query for pagination
   * @returns {Promise<PaginatedCart>} Student cart
   * @throws {NotFoundException}  Student not found
   */
  static async getCart(studentId, query) {
    const student = await Student.findByPk(studentId);
    if (!student) throw new NotFoundException('Student not found');

    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;
    const {count, rows: cartItems} = await Cart.findAndCountAll({
      where: {
        studentId
      },
      offset: limit * (page - 1),
      limit,
      distinct: true,
      include: [
        {
          model: ProductVariant,
          include: [Product]
        }
      ]
    });

    return {
      data: cartItems,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: count
      }
    };
  }

  //Student ID: Number, CarId:Number
  static async updateCartItems(studentId, cartId) {}
  //Student ID: Number, CarIds:Number
  /**
   *
   * @param {string} studentId
   * @param {string} cartId
   */
  static async archiveCart(studentId, cartId) {
    const student = await Student.findByPk(studentId);
    if (!student) throw new NotFoundException('Student not found', 404);

    const cartItem = await Cart.findByPk(cartId);
    if (!cartItem) throw new NotFoundException('Cart not found', 404);

    cartItem.destroy();
    cartItem.save();

    return cartItem;
  }
}
