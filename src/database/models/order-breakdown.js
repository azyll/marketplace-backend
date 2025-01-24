"use strict";
import { Model, DataTypes } from "sequelize";
export default (sequelize) => {
  class OrderBreakdown extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrderBreakdown.belongsTo(models.Order);
    }
  }
  OrderBreakdown.init(
    {
      quantity: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "OrderBreakdown",
    },
  );
  return OrderBreakdown;
};
