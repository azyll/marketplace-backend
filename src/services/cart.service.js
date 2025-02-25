import { DB } from "../database/index.js";
import { NotFoundException } from "../exceptions/notFound.js";

export class CartService {
  static async createCart(studentId, productVariantIds) {
    const student = await DB.Student.findOne({ where: { id: studentId } });
    if (!student) throw new NotFoundException("Student not found");

    const variantsInsert = await Promise.all(
      productVariantIds.map(async (productVariantId) => {
        console.log("product variant id: ", productVariantId);
        const variant = await DB.ProductVariant.findOne({
          where: { id: productVariantId },
        });
        if (!variant) throw new NotFoundException("Product variant not found");

        const productVariant = await DB.Cart.findOne({
          where: { studentId, productVariantId },
        });
        // Not Found
        if (!productVariant) {
          return await DB.Cart.create({
            quantity: 1,
            studentId,
            productVariantId,
          });
        }
        await productVariant.update({
          quantity: productVariant.quantity + 1,
        });
        return await productVariant.save();
      }),
    );
    return variantsInsert;
  }

  static async getStudentCart(studentId) {}
}
