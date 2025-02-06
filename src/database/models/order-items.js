"use strict";
import { Model, DataTypes } from "sequelize";
export default (sequelize) => {
  class OrderItems extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrderItems.belongsTo(models.Order);
      OrderItems.belongsTo(models.Product);
    }
  }
  OrderItems.init(
    {
      quantity: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "OrderItems",
    },
  );
  return OrderItems;
};
