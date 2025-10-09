'use strict';
import {DataTypes, Model} from 'sequelize';
import {Joi, sequelizeJoi} from 'sequelize-joi';
export default (sequelize) => {
  class ReturnedItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ReturnedItem.belongsTo(models.ProductVariant, {
        foreignKey: {
          name: 'productVariantId',
          allowNull: false
        },
        as: 'productVariant'
      });
    }
  }
  sequelizeJoi(sequelize);
  ReturnedItem.init(
    {
      reason: {
        type: DataTypes.TEXT,
        schema: Joi.string().trim().required(),
        allowNull: false,
        defaultValue: 'N/A'
      },
      quantity: {
        type: DataTypes.INTEGER,
        schema: Joi.number().integer().min(0).required()
      }
    },
    {
      sequelize,
      modelName: 'ReturnedItems',
      paranoid: true
    }
  );
  return ReturnedItem;
};

