// @ts-check

import {DB} from '../database/index.js';
import {NotFoundException} from '../exceptions/notFound.js';

const {Order, Student, User, OrderItems, ProductVariant, Product} = DB;

/**
 * @typedef {import('../types/index.js').QueryParams} QueryParams
 * @typedef {import ("../types/index.js").PaginatedResponse<Order>} PaginatedOrders
 */

export class OrderService {
  /**
   * Create order for student
   * @param {string} studentId - Student Id
   * @param {{productVariantId:string, quantity:number} []} orderItems - Order items
   * @returns {Promise<Order>} Order Data
   * @throws {NotFoundException}  Student or Product not found
   */
  static async createOrder(studentId, orderItems) {
    const student = await Student.findByPk(studentId);
    if (!student) throw new NotFoundException('Student not found', 404);

    const status = 'ongoing';

    // Check if all variant ids exists
    await Promise.all(
      orderItems.map(async (item) => {
        const productVariant = await ProductVariant.findOne({
          where: {
            id: item.productVariantId
          }
        });
        if (!productVariant) throw new NotFoundException('Product variant not found', 404);

        return item;
      })
    );

    const order = await Order.create(
      {
        total: 0,
        status,
        studentId,
        OrderItems: orderItems
      },
      {
        include: [OrderItems]
      }
    );
    // @ts-ignore
    return order;
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

  // UpdateData[] = {type: increment:decrement:delete, orderItemId}
  static async updateOrderByStudentId({studentId, orderId, updateData}) {}

  // Student ID: Number, orderId:Number
  static async deleteOrderByStudentId({studentId, orderId}) {}
}
