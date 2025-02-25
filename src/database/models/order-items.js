"use strict";
import { Model, DataTypes } from "sequelize";
import { Joi, sequelizeJoi } from "sequelize-joi";

export default (sequelize) => {
  class OrderItems extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrderItems.belongsTo(models.Order, {
        foreignKey: {
          name: "orderId",
          allowNull: false,
        },
      });
      OrderItems.belongsTo(models.ProductVariant, {
        foreignKey: {
          name: "productVariantId",
          allowNull: false,
        },
      });
    }
  }
  sequelizeJoi(sequelize);

  OrderItems.init(
    {
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        schema: Joi.number().integer().min(0).required(),
      },
      total: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${this.firstName} ${this.lastName}`;
        },
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        schema: Joi.date().allow(null),
      },
    },
    {
      sequelize,
      modelName: "OrderItems",
    },
  );
  return OrderItems;
};
