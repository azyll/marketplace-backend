"use strict";
import { Model, DataTypes } from "sequelize";
export default (sequelize) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      total: DataTypes.DOUBLE,
      status: {
        type: DataTypes.ENUM,
      },
    },
    {
      sequelize,
      modelName: "Order",
    },
  );
  return Order;
};
