import {or} from 'sequelize';
import {DB} from '../database/index.js';
import {NotFoundException} from '../exceptions/notFound.js';

const {Order} = DB;

export class OrderService {
  /**
   * Create order for student
   *
   * @param {string} studentId - id of student
   * @param {{
   * productVariantId:string,
   * quantity:number
   * } []} orderItems - The parameters for creating an order.
   *
   * @returns {Promise<Order>} order of student
   *
   * @throws {NotFoundException}  if student or product does not exists
   */
  static async createOrder(studentId, orderItems) {
    const student = await DB.Student.findOne({
      where: {id: studentId}
    });
    if (!student) throw new NotFoundException('Student not found', 404);
    // !NO NEED FOR THIS, the frontend will send a total value
    const status = 'ongoing';
    await Promise.all(
      orderItems.map(async (item) => {
        const productVariant = await DB.ProductVariant.findOne({
          where: {
            id: item.productVariantId
          }
        });
        if (!productVariant) throw new NotFoundException('Product variant not found', 404);

        return item;
      })
    );
    const order = await DB.Order.create(
      {
        total: totalOrder || 0,
        status,
        studentId,
        OrderItems: orderItems
      },
      {
        include: [DB.OrderItems]
      }
    );
    return order;
  }

  /**
   * Get Orders
   * @param userId
   * @returns {Promise<Order[]>} All of the orders
   */

  static async getOrders(page, limit, search) {
    const orders = await DB.Order.findAll({
      include: [DB.OrderItems, DB.Student]
    });
    return orders;
  }
  /**
   *
   * @param {string} studentId
   * @returns {Promise<Order[]>} All of the student orders
   * @throws {NotFoundException} If Student does not exists
   */
  static async getOrdersByStudentId(studentId) {
    const student = await DB.Student.findOne({
      where: {id: studentId}
    });
    if (!student) throw new NotFoundException('Student not found', 404);

    const orders = await DB.Order.findAll({
      where: {studentId: studentId}
    });
    return orders;
  }
  // Student ID: Number, orderId:Number
  static async updateOrderStatusByStudentId({studentId, orderId, newStatus}) {
    if (newStatus == 'completed') {
      // write Sales
    }
  }

  // UpdateData[] = {type: increment:decrement:delete, orderItemId}
  static async updateOrderByStudentId({studentId, orderId, updateData}) {}

  // Student ID: Number, orderId:Number
  static async deleteOrderByStudentId({studentId, orderId}) {}
}
