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
      // models.Product.belongsTo(ProductTypes, {
      //   foreignKey: "typeId",
      //   as: "type",
      // });
      // ProductTypes.hasMany(Product, {
      //   foreignKey: "typeId",
      //   as: "product",
      // });
    }
  }
  ProductTypes.init(
    {
      typeId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      typeName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ProductTypes",
    },
  );
  return ProductTypes;
};
