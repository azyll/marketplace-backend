import sequelize from "./config/sequelize.js";
import UserModel from "./models/user.js";
import RoleModel from "./models/role.js";
import ProductModel from "./models/product.js";
import StudentModel from "./models/student.js";
import ProductTypesModel from "./models/product-type.js";
import SaleModel from "./models/sales.js";
import OrderModel from "./models/order.js";
import OrderItemsModel from "./models/order-items.js";
import ProductVariantModel from "./models/product-variant.js";
import CartModel from "./models/cart.js";
import ActivityHistoryModel from "./models/activity-history.js";

export const DB = {
  sequelize,
  User: UserModel(sequelize),
  Role: RoleModel(sequelize),
  Student: StudentModel(sequelize),
  Product: ProductModel(sequelize),
  ProductTypes: ProductTypesModel(sequelize),
  Sale: SaleModel(sequelize),
  Order: OrderModel(sequelize),
  OrderItems: OrderItemsModel(sequelize),
  ProductVariant: ProductVariantModel(sequelize),
  Cart: CartModel(sequelize),
  ActivityHistory: ActivityHistoryModel(sequelize),
};

Object.values(DB).forEach((model) => {
  if (model.associate) {
    model.associate(DB);
  }
});
