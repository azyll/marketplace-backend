"use strict";
import { Model, DataTypes } from "sequelize";
export default (sequelize) => {
  class ProductTypes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductTypes.hasMany(models.Product, {
        foreignKey: "typeId",
        as: "product",
      });
    }
  }
  ProductTypes.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName: "ProductTypes",
    },
  );
  return ProductTypes;
};
