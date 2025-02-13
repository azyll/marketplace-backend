"use strict";
import { Model, DataTypes } from "sequelize";
export default (sequelize) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cart.belongsTo(models.Student, {
        foreignKey: {
          name: "studentId",
          allowNull: false,
        },
      });
      Cart.belongsTo(models.ProductVariant, {
        foreignKey: {
          name: "productVariantId",
          allowNull: false,
        },
      });
    }
  }
  Cart.init(
    {
      quantity: DataTypes.INTEGER,
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },

    {
      sequelize,
      modelName: "Carts",
    },
  );
  Cart.removeAttribute("id");
  return Cart;
};
