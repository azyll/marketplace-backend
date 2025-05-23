// @ts-check

import {literal, Op} from 'sequelize';
import {DB} from '../database/index.js';
import {NotFoundException} from '../exceptions/notFound.js';
import {ActivityLogService} from './activity-log.service.js';
import sequelize from '../database/config/sequelize.js';
import {calculateStockCondition} from '../utils/stock-helper.js';

const {Order, Student, User, OrderItems, ProductVariant, Product} = DB;

/**
 * @typedef {import('../types/index.js').QueryParams} QueryParams
 * @typedef {import ("../types/index.js").PaginatedResponse<Order>} PaginatedOrders
 */

export class OrderService {
  /**
   * TODO: Add create notification and  log
   */

  /**
   * Create order for student
   * @param {string} studentId - Student ID
   * @param {{productVariantId:string, quantity:number} []} orderItems - Order items
   * @returns {Promise<Order>} Order Data
   * @throws {NotFoundException}  Student or Product not found
   */
  static async createOrder(studentId, orderItems) {
    const student = await Student.findByPk(studentId, {
      include: [
        {
          model: User,
          as: 'user'
        }
      ]
    });
    if (!student) throw new NotFoundException('Student not found', 404);

    const status = 'on going';

    const variantIds = orderItems.map((item) => item.productVariantId);

    const productVariants = await ProductVariant.findAll({
      include: [Product],
      where: {
        id: {
          [Op.in]: variantIds
        }
      }
    });

    if (productVariants.length !== variantIds.length || !productVariants) {
      throw new NotFoundException('Invalid credential, The product not found', 404);
    }

    const plainProductVariants = productVariants.map((variant) => variant.get({plain: true}));

    const productVariantWithLowStock = plainProductVariants.filter((variant) => variant.stockQuantity <= 20);

    if (productVariantWithLowStock.length >= 1) {
      //Check The last transaction of the user
      console.log(student);
      throw new Error(
        `The item you want to order is currently in low stock, since you order this same item in the last 3 months, you can go to proware department to approve your order`
      );
      //Write into a new table specific for problem order
    }

    //Used transaction so when have a over order product all the stock update will be roll back
    let totalOrder = await sequelize.transaction(async (transaction) => {
      //For total order
      let total = 0;

      for (const plainProductVariant of plainProductVariants) {
        const orderItem = orderItems.find((order) => order.productVariantId === plainProductVariant.id);
        if (!orderItem) {
          throw new NotFoundException('A product not found', 404);
        }
        const productVariant = await ProductVariant.findByPk(orderItem.productVariantId, {
          include: [Product]
        });

        if (!productVariant) throw new NotFoundException('Invalid credential, The product not found', 404);

        let newStockQuantity = Number(productVariant?.stockQuantity) - Number(orderItem.quantity);
        if (newStockQuantity < 0) {
          throw new Error(`You over order the item ${productVariant.Product.name}`);
        }

        productVariant.stockQuantity = newStockQuantity;
        productVariant.stockCondition = calculateStockCondition(newStockQuantity);
        await productVariant?.save({
          transaction
        });

        total += Number(productVariant.price) * orderItem.quantity;
      }

      return total;
    });

    const order = await Order.create(
      {
        total: totalOrder || 0,
        status,
        studentId,
        OrderItems: orderItems
      },
      {
        include: [OrderItems]
      }
    );
    return order;

    // await ActivityLogService.createLog(
    //   'Order Created Successfully',
    //   `Order created with a total of ${totalOrder}`,
    //   'order'
    // );
  }

  /**
   * Get all Orders
   * @param {QueryParams} query
   * @returns {Promise<PaginatedOrders>} All of the orders
   */
  static async getOrders(query) {
    const page = query.page || 1;
    const limit = query.limit || 10;

    const {rows: orderData, count} = await Order.findAndCountAll({
      distinct: true,
      include: [
        {
          model: OrderItems,
          include: [
            {
              model: ProductVariant,
              include: [Product]
            }
          ]
        },
        {
          model: Student,
          include: [
            {
              model: User,
              as: 'user'
            }
          ]
        }
      ]
    });

    return {
      data: orderData,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: count
      }
    };
  }
  /**
   * Get All Orders of Student
   * @param {string} studentId
   * @param {{page:number|string,limit:number|string}} query
   * @returns {Promise<PaginatedOrders>} All of the student orders
   * @throws {NotFoundException} Student not found
   */
  static async getStudentOrders(studentId, query) {
    const student = await Student.findByPk(studentId);
    if (!student) {
      throw new NotFoundException('Student not found', 404);
    }

    const page = query.page || 1;
    const limit = query.limit || 10;
    const {rows: orderData, count} = await Order.findAndCountAll({
      distinct: true,
      where: {
        studentId
      },
      include: [
        {
          model: OrderItems,
          include: [
            {
              model: ProductVariant,
              include: [Product]
            }
          ]
        },
        {
          model: Student,
          include: [
            {
              model: User,
              as: 'user'
            }
          ]
        }
      ]
    });

    return {
      data: orderData,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: count
      }
    };
  }

  /**
   *
   * @param {string} orderId Order Id
   * @returns {Promise<Order>}
   * @throws {NotFoundException} Order not found
   */
  static async getOrder(orderId) {
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: OrderItems,
          include: [
            {
              model: ProductVariant,
              include: [Product]
            }
          ]
        },
        {
          model: Student,
          include: [
            {
              model: User,
              as: 'user'
            }
          ]
        }
      ]
    });

    if (!order) {
      throw new NotFoundException('Order not found', 404);
    }

    // @ts-ignore
    return order;
  }

  /**
   * Update Order Status
   * @param {string} studentId - Student Id
   * @param {string} orderId - Order ID
   * @param {'completed'|'ongoing'|'failed'} newStatus - new Status
   * @throws {NotFoundException} Student or Order not found
   */
  static async updateOrderStatus(studentId, orderId, newStatus) {
    if (newStatus == 'completed') {
      // write Sales
    }
  }
  /**
   *
   * @param {string} studentId
   * @param {string} orderId
   * @param {string} newOrder
   */
  static async updateStudentOrder(studentId, orderId, newOrder) {}

  /**
   * Delete Student Order
   * @param {string} studentId
   * @param {string} orderId
   * @throws {NotFoundException} Student and order not found
   */
  static async archiveStudentOrder(studentId, orderId) {}
}
