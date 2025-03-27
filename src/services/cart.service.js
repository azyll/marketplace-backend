import {DB} from '../database/index.js';
import {NotFoundException} from '../exceptions/notFound.js';

const {Cart, Student, ProductVariant} = DB;

export class CartService {
  /** 
    @todo improve the code
    @param {string} studentId -student id   
    @param {string[]} products  - ids of product variant
    @throws {NotFoundException} - if product or user does not exist 
    @returns {Promise<Cart[]>}  inserted product variants
   **/
  static async createCart(studentId, products) {
    const student = await Student.findOne({where: {id: studentId}});
    if (!student) throw new NotFoundException('Student not found');
    const variantsInsert = await Promise.all(
      // Iterate the ids
      products.map(async (productVariantId) => {
        const variant = await ProductVariant.findOne({
          where: {id: productVariantId}
        });
        // Not Product Not found
        if (!variant) throw new NotFoundException('Product variant not found');

        const productVariant = await Cart.findOne({
          where: {studentId, productVariantId}
        });

        if (!productVariant) {
          return await Cart.create({
            quantity: 1,
            studentId,
            productVariantId
          });
        }
        await productVariant.update({
          quantity: productVariant.quantity + 1
        });
        return await productVariant.save();
      })
    );

    return variantsInsert;
  }

  /**
   *
   * @param {string} studentId
   * @returns {Promise<Cart[]>} student cart
   */
  static async getCartByStudentId(studentId) {
    const student = await Student.findOne({where: {id: studentId}});
    if (!student) throw new NotFoundException('Student not found');

    const carts = await Cart.findAll({where: {studentId}});
    return carts;
  }

  //Student ID: Number, CarId:Number
  static async updateCart({studentId, cartId}) {}
  //Student ID: Number, CarIds:Number
  static async deleteCart({studentId, cartId}) {}
}
