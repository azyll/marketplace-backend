'use strict';
import {Model, DataTypes} from 'sequelize';
import {Joi, sequelizeJoi} from 'sequelize-joi';

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
          name: 'studentId',
          allowNull: false
        }
      });
      Cart.belongsTo(models.ProductVariant, {
        foreignKey: {
          name: 'productVariantId',
          allowNull: false
        }
      });
    }
  }
  sequelizeJoi(sequelize);

  Cart.init(
    {
      quantity: {
        type: DataTypes.INTEGER,
        schema: Joi.number().integer().min(0).required()
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        schema: Joi.date().allow(null)
      }
    },

    {
      sequelize,
      modelName: 'Carts',
      paranoid: true
    }
  );

  return Cart;
};
