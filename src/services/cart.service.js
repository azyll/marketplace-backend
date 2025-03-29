// @ts-check
import {DB} from '../database/index.js';
import {NotFoundException} from '../exceptions/notFound.js';

const {Cart, Student, ProductVariant, Product} = DB;

export class CartService {
  /** 
   * Add Item To Student Cart
    @param {string} studentId - Student id   
    @param {string[]} products  - IDs of product variants
    @throws {NotFoundException} Product or student not found
    @returns {Promise<Cart[]>}  Inserted Product to the database
   **/
  static async addItemToCart(studentId, products) {
    const student = await Student.findByPk(studentId);

    if (!student) {
      throw new NotFoundException('Student not found', 409);
    }
    const variantsInsert = await Promise.all(
      // Iterate the ids
      products.map(async (productVariantId) => {
        const variant = await ProductVariant.findByPk(productVariantId);

        // Not Product Not found
        if (!variant) {
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

        if (!isNewItem) {
          await productVariant.update({
            quantity: productVariant.quantity + 1
          });
          await productVariant.save();
        }

        return productVariant;
      })
    );

    return variantsInsert;
  }

  /**
   * @typedef {import('../types/index.js').PaginatedResponse<Cart>} PaginatedCart
   */
  /**
   * Get Student Cart
   * @param {string} studentId
   * @param {{page:number|string,limit:number|string}} query -Query for pagination
   * @returns {Promise<PaginatedCart>} Student cart
   * @throws {NotFoundException}  Student not found
   */
  static async getCart(studentId, query) {
    const student = await Student.findByPk(studentId);
    if (!student) throw new NotFoundException('Student not found');

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
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
