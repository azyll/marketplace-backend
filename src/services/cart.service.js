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
  // /**
  //  * Add Item To Student Cart
  //  * @param {string} studentId - Student id
  //  * @param {string[]} products  - IDs of product variants
  //  * @throws {NotFoundException} Product or student not found
  //  * @returns {Promise<Cart[]>}  Inserted Product to the database
  //  * @throws {AlreadyExistException} Since one order for student,
  //   throws error if the item is already exist in the student cart
  //  **/
  // static async addItemToCart(studentId, products) {
  //   const student = await Student.findByPk(studentId);

  //   if (!student) {
  //     throw new NotFoundException('Student not found', 409);
  //   }

  //   // Iterate the ids
  //   products.forEach(async (productVariantId) => {
  //     const variant = await ProductVariant.findByPk(productVariantId);

  //     // Not Product Not found
  //     if (!variant) {
  //       throw new NotFoundException('Product not found');
  //     }

  //     const [productVariant, isNewItem] = await Cart.findOrCreate({
  //       where: {studentId, productVariantId},
  //       defaults: {
  //         quantity: 1,
  //         studentId,
  //         productVariantId
  //       }
  //     });

  //     if (!isNewItem) {
  //       await productVariant.update({
  //         quantity: productVariant.quantity + 1
  //       });
  //       await productVariant.save();
  //     }

  //   });

  //   const studentCart = await this.getCart(studentId, undefined);

  //   return studentCart;
  // }

  /** 
   * Add Item To Student Cart
   * @param {string} studentId - Student id   
   * @param {string} productVariantId  - IDs of product variants
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
      throw new NotFoundException('Product not found');
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
      throw new AlreadyExistException('The product is already exist in your cart', 409);
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
  static async updateCartItems({studentId, cartId}) {}
  //Student ID: Number, CarIds:Number
  static async deleteCart({studentId, cartId}) {}
}
