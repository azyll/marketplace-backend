import {Op} from 'sequelize';
import {DB} from '../database/index.js';
import {AlreadyExistException} from '../exceptions/alreadyExist.js';
import {NotFoundException} from '../exceptions/notFound.js';
import sequelize from '../database/config/sequelize.js';
import {OrderService} from './order.service.js';

const {Cart, Student, User, ProductVariant, Product, ProductAttribute} = DB;

/**
 * @typedef {import('../types/index.js').QueryParams} QueryParams
 * @typedef {import('../types/index.js').PaginatedResponse<Cart>} PaginatedCart
 */

export class CartService {
  /** 
   * Add Item To Student Cart
   * @param {string} studentId - Student id   
   * @param {string} productVariantId  - ID of product variant
   * @param {number} quantity
   * @throws {NotFoundException} Product or student not found
   * @throws {AlreadyExistException} Since one order for student, 
    throws error if the item is already exist in the student cart
   * @returns {Promise<ProductVariant>}  Inserted Product to the database
   **/
  static async addItemToCart(studentId, productVariantId, quantity = 1) {
    const user = await User.findByPk(studentId, {
      include: [
        {
          model: Student,
          as: 'student'
        }
      ]
    });

    if (!user) {
      throw new NotFoundException('Student not found', 404);
    }
    const orderLimit = await OrderService.getOrderLimit();
    if (quantity > orderLimit) {
      throw new Error('Failed to add to cart: exceeds order limit');
    }

    const product = await ProductVariant.findByPk(productVariantId);
    if (!product) {
      throw new NotFoundException('Product not found', 404);
    }

    return await sequelize.transaction(async (transaction) => {
      const [cartItem, isNewItem] = await Cart.findOrCreate({
        where: {studentId: user.student.id, productVariantId},
        defaults: {
          quantity: quantity,
          studentId: user.student.id,
          productVariantId
        },
        transaction
      });

      if (isNewItem) {
        return cartItem;
      }

      const newQuantity = cartItem.quantity + quantity;

      if (newQuantity > orderLimit) {
        throw new Error('Failed to add to cart: exceeds order limit');
      }

      cartItem.quantity = newQuantity;

      let fields = {
        title: 'A user added item to its cart',
        content: 'New item to cart',
        type: 'user'
      };
      await DB.ActivityLog.create(fields, {transaction: transaction});
      await cartItem.save({transaction});

      return cartItem;
    });
  }

  /**
   * Get Student Cart
   * @param {string} studentId
   * @param {QueryParams|undefined} query -Query for pagination
   * @returns {Promise<PaginatedCart>} Student cart
   * @throws {NotFoundException}  Student not found
   */
  static async getCart(studentId, query) {
    const user = await User.findByPk(studentId, {
      include: [
        {
          model: Student,
          as: 'student'
        }
      ]
    });
    if (!user) throw new NotFoundException('Student not found');

    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;
    const {count, rows: cartItems} = await Cart.findAndCountAll({
      where: {
        studentId: Number(user.student.id)
      },
      offset: (page - 1) * limit,
      limit,
      distinct: true,
      include: [
        {
          model: ProductVariant,
          required: true,
          include: [
            {model: Product, as: 'product', required: true},
            {model: ProductAttribute, as: 'productAttribute'}
          ],
          as: 'productVariant'
        }
      ],
      order: [['createdAt', 'DESC']]
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

  static async addCartItemQuantity(studentId, cartItemId) {
    return await sequelize.transaction(async (transaction) => {
      const student = await User.findByPk(studentId, {
        include: [
          {
            model: Student,
            as: 'student'
          }
        ]
      });
      if (!student) throw new NotFoundException('Student not found', 404);

      const orderLimit = await OrderService.getOrderLimit();
      const cartItem = await Cart.findByPk(cartItemId, {transaction});

      if (!cartItem) throw new NotFoundException('Cart item not found', 404);

      const newQuantity = cartItem.quantity + 1;

      if (newQuantity > orderLimit) {
        throw new Error('Failed to add to cart quantity: exceeds order limit');
      }
      cartItem.quantity = newQuantity;

      let fields = {
        title: 'A user added quantity to its cart',
        content: 'New item quantity to cart',
        type: 'user'
      };
      await DB.ActivityLog.create(fields, {transaction: transaction});
      return await cartItem.save({transaction});
    });
  }

  static async deductCartItemQuantity(studentId, cartItemId) {
    return await sequelize.transaction(async (transaction) => {
      const student = await User.findByPk(studentId, {
        include: [
          {
            model: Student,
            as: 'student'
          }
        ],
        transaction
      });
      if (!student) throw new NotFoundException('Student not found', 404);

      const cartItem = await Cart.findByPk(cartItemId, {transaction});

      if (!cartItem) throw new NotFoundException('Cart item not found', 404);

      const newQuantity = cartItem.quantity - 1;
      if (newQuantity < 1) {
        throw new Error('Failed to deduct to cart quantity: quantity too low, you can remove the cart item ');
      }
      cartItem.quantity = newQuantity;
      let fields = {
        title: 'A user deduct quantity to its cart',
        content: 'New item quantity to cart',
        type: 'user'
      };
      await DB.ActivityLog.create(fields, {transaction: transaction});
      return await cartItem.save({transaction});
    });
  }
  //Student ID: Number, CarIds:Number
  /**
   *
   * @param {string} studentId
   * @param {string[]} productVariantIds
   */
  static async archiveCart(studentId, productVariantIds) {
    return await sequelize.transaction(async (transaction) => {
      const student = await User.findByPk(studentId, {
        include: [
          {
            model: Student,
            as: 'student'
          }
        ],
        transaction
      });
      if (!student) throw new NotFoundException('Student not found', 404);

      const productVariants = await Cart.findAll({
        where: {
          productVariantId: {
            [Op.in]: productVariantIds
          },
          studentId: student.student.id
        },
        transaction
      });

      if (productVariants.length !== productVariantIds.length) throw new NotFoundException('Cart item not found');

      const cart = await Cart.destroy({
        where: {
          productVariantId: {
            [Op.in]: productVariantIds
          },
          studentId: student.student.id
        },
        transaction
      });
      let fields = {
        title: 'A user delete a item to its cart',
        content: 'Delete cart item ',
        type: 'user'
      };
      await DB.ActivityLog.create(fields, {transaction: transaction});
      return cart;
    });
  }
}
