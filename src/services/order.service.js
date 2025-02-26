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

    const totalOrder = await Promise.all(
      orderItems.map(async (item) => {
        const productVariant = await DB.ProductVariant.findOne({
          where: {
            id: item.productVariantId,
          },
        });
        if (!productVariant)
          throw new NotFoundException("Product variant not found", 404);

        return Number(productVariant.price);
      }),
    ).then((prices) => prices.reduce((acc, price) => acc + price, 0));

    const status = "ongoing";

    await Promise.all(
      orderItems.map(async (item) => {
        const productVariant = await DB.ProductVariant.findOne({
          where: {
            id: item.productVariantId,
          },
        });

        if (!productVariant)
          throw new NotFoundException("Product variant not found", 404);
      }),
    );

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
  // Student ID: Number, orderId:Number
  static async updateStudentOrdersByStudentId({ studentId, orderId }) {}
  // Student ID: Number, orderId:Number
  static async deleteStudentOrdersByStudentId({ studentId, orderId }) {}
}
