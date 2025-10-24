import {Model, DataTypes} from 'sequelize';
import {Joi, sequelizeJoi} from 'sequelize-joi';

export default (sequelize) => {
  class ActivityLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      ActivityLog.belongsTo(models.Product, {
        foreignKey: {
          name: 'productId',
          allowNull: true
        },
        as: 'product'
      });
      ActivityLog.belongsTo(models.Sales, {
        foreignKey: {
          name: 'salesId',
          allowNull: true
        },
        as: 'sales'
      });
      ActivityLog.belongsTo(models.Order, {
        foreignKey: {
          name: 'orderId',
          allowNull: true
        },
        as: 'order'
      });
      ActivityLog.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
          allowNull: true
        },
        as: 'user'
      });
    }
  }
  sequelizeJoi(sequelize);
  ActivityLog.init(
    {
      title: {
        type: DataTypes.TEXT,
        schema: Joi.string().trim().required(),
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT,
        schema: Joi.string().trim().required()
      },
      type: {
        type: DataTypes.ENUM,
        values: ['user', 'system', 'inventory', 'sales', 'order'],
        schema: Joi.string().required().valid('user', 'system', 'inventory', 'sales', 'order')
      }
    },
    {
      sequelize,
      paranoid: true,
      modelName: 'ActivityLogs'
    }
  );

  return ActivityLog;
};
