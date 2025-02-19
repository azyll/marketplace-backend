import { DB } from "../database";

export class OrderService {
  static async createOrder(order) {
    const result = await DB.Order.create(order);
    return result;
  }
  static async getOrders() {
    const result = await DB.Order.findAll({
      include: [DB.OrderItems, DB.Student],
    });
    return result;
  }
  static async getOrder(orderId) {
    const result = await DB.Order.findOne({
      include: [DB.OrderItems, DB.Student],
      where: {
        id: orderId,
      },
    });
    return result;
  }
  static async getUserOrders(userId) {}
  static async updateOrder(order) {}
}
