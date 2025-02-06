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
      Order.hasOne(models.Sale);
      Order.hasMany(models.OrderItems);
      Order.belongsTo(models.User);
    }
  }
  Order.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUID,
      },
      total: DataTypes.DOUBLE,
      status: {
        type: DataTypes.ENUM,
        values: ["completed", "ongoing", "failed"],
      },
    },
    {
      sequelize,
      modelName: "Orders",
    },
  );
  return Order;
};
