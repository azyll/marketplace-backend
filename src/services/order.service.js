import { DB } from "../database/index.js";

export class OrderService {
  // Params Object { studentId:UUID, orderItems:Array }
  static async createOrder({ studentId, orderItems }) {
    const totalOrder = orderItems.reduce((acc, current) => {
      return acc + Number(current.price);
    }, 0);
    const status = "ongoing";

    const resultOrderCreate = await DB.Order.create({
      total: totalOrder || 6,
      status,
      studentId,
    });

    const resultPromises = await orderItems.map(
      async (item) =>
        await this.createOrderItem({
          ...item,
          orderId: resultOrderCreate.id,
        }),
    );
    const variantsInput = Promise.all(resultPromises);

    return { resultOrderCreate, variantsInput };
  }
  // Params Object   {quantity,orderId,productVariantId}
  static async createOrderItem(orderItem) {
    const result = await DB.OrderItems.create(orderItem);
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
