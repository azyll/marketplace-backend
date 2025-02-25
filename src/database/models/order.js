"use strict";
import { Model, DataTypes } from "sequelize";
import { Joi, sequelizeJoi } from "sequelize-joi";

export default (sequelize) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.hasOne(models.Sales, {
        foreignKey: {
          name: "orderId",
          allowNull: false,
        },
      });
      Order.hasMany(models.OrderItems, {
        foreignKey: {
          name: "orderId",
          allowNull: false,
        },
      });
      Order.belongsTo(models.Student, {
        foreignKey: {
          name: "studentId",
          allowNull: false,
        },
      });
    }
  }
  sequelizeJoi(sequelize);
  Order.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      // Tanggalin ko ba?
      total: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        schema: Joi.number().min(0).precision(2).required(),
      },
      status: {
        type: DataTypes.ENUM,
        values: ["completed", "ongoing", "failed"],
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        schema: Joi.date().allow(null),
      },
    },
    {
      sequelize,
      modelName: "Orders",
    },
  );
  return Order;
};
