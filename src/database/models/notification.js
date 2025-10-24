'use strict';
import {Model, DataTypes} from 'sequelize';
import {sequelizeJoi} from 'sequelize-joi';
export default (sequelize) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Notification.hasMany(models.NotificationReceiver, {
        foreignKey: {
          name: 'notificationId',
          allowNull: false
        },
        as: 'notificationReceiver'
      });
      Notification.belongsTo(models.Product, {
        foreignKey: {
          name: 'productId',
          allowNull: true
        },
        as: 'product'
      });
      Notification.belongsTo(models.Sales, {
        foreignKey: {
          name: 'salesId',
          allowNull: true
        },
        as: 'sales'
      });
      Notification.belongsTo(models.Order, {
        foreignKey: {
          name: 'orderId',
          allowNull: true
        },
        as: 'order'
      });
    }
  }
  sequelizeJoi(sequelize);
  Notification.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      title: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      message: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      type: {
        type: DataTypes.ENUM,
        values: ['order', 'sale', 'announcement', 'n/a']
      }
    },
    {
      sequelize,
      paranoid: true,
      modelName: 'Notifications'
    }
  );
  return Notification;
};

