'use strict';
import {Model, DataTypes} from 'sequelize';
import {Joi, sequelizeJoi} from 'sequelize-joi';
export default (sequelize) => {
  class ProductAttribute extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductAttribute.hasMany(models.ProductVariant, {
        foreignKey: {
          name: 'productAttributeId',
          allowNull: false
        }
      });
    }
  }
  sequelizeJoi(sequelize);
  ProductAttribute.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        schema: Joi.string().trim().required(),
        unique: true
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        schema: Joi.date().allow(null)
      }
    },
    {
      sequelize,
      modelName: 'ProductAttributes'
    }
  );
  return ProductAttribute;
};

