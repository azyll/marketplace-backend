'use strict';
import {Model, DataTypes, ENUM} from 'sequelize';
import {Joi, sequelizeJoi} from 'sequelize-joi';

export default (sequelize) => {
  class ProductVariant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProductVariant.belongsTo(models.Product, {
        foreignKey: {
          name: 'productId',
          allowNull: false
        },
        as: 'product'
      });
      ProductVariant.belongsTo(models.ProductAttribute, {
        foreignKey: {
          name: 'productAttributeId',
          allowNull: false
        },
        as: 'productAttribute'
      });
    }
  }
  sequelizeJoi(sequelize);
  ProductVariant.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      name: {type: DataTypes.STRING, schema: Joi.string().trim().required()},
      size: {
        type: DataTypes.STRING,
        schema: Joi.string().required()
      },
      price: {
        type: DataTypes.DOUBLE,
        schema: Joi.number().min(0).precision(2).required()
      },
      stockQuantity: {
        type: DataTypes.INTEGER,
        schema: Joi.number().integer().min(0).required()
      },
      stockCondition: {
        type: DataTypes.ENUM,
        values: ['out-of-stock', 'low-stock', 'in-stock'],
        schema: Joi.string().trim().required().valid('out-of-stock', 'low-stock', 'in-stock')
      }
    },
    {
      sequelize,
      paranoid: true,
      modelName: 'ProductVariants'
    }
  );
  return ProductVariant;
};
