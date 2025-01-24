import sequelize from "./config/sequelize.js";
import UserModel from "./models/user.js";
import RoleModel from "./models/role.js";
import ProductModel from "./models/product.js";
import StudentModel from "./models/student.js";
import ProductTypesModel from "./models/product-types.js";

import SaleModel from "./models/sales.js";
import OrderModel from "./models/order.js";
import OrderBreakdownModel from "./models/order-breakdown.js";
export const DB = {
  sequelize,
  User: UserModel(sequelize),
  Role: RoleModel(sequelize),
  Student: StudentModel(sequelize),
  Product: ProductModel(sequelize),
  ProductTypes: ProductTypesModel(sequelize),
  Sale: SaleModel(sequelize),
  Order: OrderModel(sequelize),
  OrderBreakdown: OrderBreakdownModel(sequelize),
};

Object.values(DB).forEach((model) => {
  if (model.associate) {
    model.associate(DB);
  }
});
