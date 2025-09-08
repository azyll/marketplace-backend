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
      name: {type: DataTypes.STRING, schema: Joi.string().trim().required(), defaultValue: 'N/A'},
      size: {
        type: DataTypes.STRING,
        schema: Joi.string().required(),
        defaultValue: 'N/A'
      },
      price: {
        type: DataTypes.DOUBLE,
        schema: Joi.number().min(0).precision(2).required()
      },
      // Initial Stock
      stockAvailable: {
        type: DataTypes.INTEGER,
        schema: Joi.number().integer().min(0).required()
      },
      // Total stock
      stockQuantity: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.stockReserved + this.stockAvailable;
        }
      },
      // Ordered Stock
      stockReserved: {
        type: DataTypes.INTEGER,
        schema: Joi.number().integer().min(0),
        allowNull: true,
        defaultValue: 0
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
