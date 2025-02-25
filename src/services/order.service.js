import { or } from "sequelize";
import { DB } from "../database/index.js";
import { NotFoundException } from "../exceptions/notFound.js";

export class OrderService {
  // Params Object { studentId:UUID, orderItems:Array }
  static async createOrder({ studentId, orderItems }) {
    const student = await DB.Student.findOne({
      where: { id: studentId },
    });
    if (!student) throw new NotFoundException("Student not found", 404);

    const totalOrder = orderItems.reduce((acc, current) => {
      return acc + Number(current.price);
    }, 0);
    const status = "ongoing";

    const order = await DB.Order.create({
      total: totalOrder || 1,
      status,
      studentId,
    });

    const resultPromises = await Promise.all(
      orderItems.map(
        async (item) =>
          await this.createOrderItem({
            ...item,
            orderId: order.id,
          }),
      ),
    );

    return { order, resultPromises };
  }
  // Params Object   {quantity,orderId,productVariantId}
  static async createOrderItem(item) {
    const orderItem = await DB.OrderItems.create(item);
    return orderItem;
  }
  static async getOrders() {
    const orders = await DB.Order.findAll({
      include: [DB.OrderItems, DB.Student],
    });
    return orders;
  }
  static async getOrder(orderId) {
    const order = await DB.Order.findOne({
      include: [DB.OrderItems, DB.Student],
      where: {
        id: orderId,
      },
    });

    if (!order) throw new NotFoundException("Order not found", 404);
    return order;
  }
  static async getStudentOrdersByStudentId(studentId) {
    const student = await DB.Student.findOne({
      where: { id: studentId },
    });
    if (!student) throw new NotFoundException("Student not found", 404);

    const orders = await DB.Order.findAll({
      where: { studentId: studentId },
    });
    return orders;
  }
  static async updateOrder(order) {}
}
