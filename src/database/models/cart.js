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
        },
        as: 'student'
      });
      Cart.belongsTo(models.ProductVariant, {
        foreignKey: {
          name: 'productVariantId',
          allowNull: false
        },
        as: 'productVariant'
      });
    }
  }
  sequelizeJoi(sequelize);

  Cart.init(
    {
      quantity: {
        type: DataTypes.INTEGER,
        schema: Joi.number().integer().min(0).required()
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
