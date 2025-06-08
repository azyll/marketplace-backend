'use strict';
import {Model, DataTypes} from 'sequelize';
export default (sequelize) => {
  class NotificationReceiver extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      NotificationReceiver.belongsTo(models.Notification, {
        foreignKey: {
          name: 'notificationId',
          allowNull: false
        }
      });
      NotificationReceiver.belongsTo(models.User, {
        foreignKey: {
          name: 'userId'
        }
      });
    }
  }
  NotificationReceiver.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      isRead: {
        defaultValue: false,
        type: DataTypes.BOOLEAN
      },
      readAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
      }
    },
    {
      sequelize,
      paranoid: true,
      modelName: 'NotificationReceivers'
    }
  );
  return NotificationReceiver;
};

