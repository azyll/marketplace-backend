import sequelize from "./config/sequelize.js";
import UserModel from "./models/user.js";
import RoleModel from "./models/role.js";
import ProductModel from "./models/product.js";
import StudentModel from "./models/student.js";
import SaleModel from "./models/sales.js";
import OrderModel from "./models/order.js";
import OrderItemsModel from "./models/order-items.js";
import ProductVariantModel from "./models/product-variant.js";
import CartModel from "./models/cart.js";
import ActivityLogModel from "./models/activity-log.js";
import ProgramModel from "./models/program.js";

export const DB = {
  sequelize,
  User: UserModel(sequelize),
  Role: RoleModel(sequelize),
  Student: StudentModel(sequelize),
  Product: ProductModel(sequelize),
  Sales: SaleModel(sequelize),
  Order: OrderModel(sequelize),
  OrderItems: OrderItemsModel(sequelize),
  ProductVariant: ProductVariantModel(sequelize),
  Cart: CartModel(sequelize),
  ActivityLog: ActivityLogModel(sequelize),
  Program: ProgramModel(sequelize),
};

Object.values(DB).forEach((model) => {
  if (model.associate) {
    model.associate(DB);
  }
});
