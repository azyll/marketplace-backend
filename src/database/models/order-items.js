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
      OrderItems.belongsTo(models.ProductVariant);
    }
  }
  OrderItems.init(
    {
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${this.firstName} ${this.lastName}`;
        },

        set() {
          throw new Error("Do not try to set the `total` value!");
        },
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName: "OrderItems",
    },
  );
  OrderItems.removeAttribute("id");
  return OrderItems;
};
