'use strict';
import {Model, DataTypes} from 'sequelize';
import {Joi, sequelizeJoi} from 'sequelize-joi';
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
        },
        as: 'notification'
      });
      NotificationReceiver.belongsTo(models.User, {
        foreignKey: {
          name: 'userId'
        },
        as: 'user'
      });
    }
  }
  sequelizeJoi(sequelize);
  NotificationReceiver.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      isRead: {
        defaultValue: false,
        type: DataTypes.BOOLEAN,
        schema: Joi.boolean().required()
      },
      readAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
        schema: Joi.date()
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

