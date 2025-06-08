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
        }
      });

      // !WAG MUNA
      //   Notification.belongsTo(models.User, {
      //   foreignKey: {
      //     name: 'userId',
      //     allowNull: false
      //   },
      //   as:'notifier',
      // });
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
        type: DataTypes.STRING
      },
      message: {
        allowNull: false,
        type: DataTypes.STRING
      },
      type: {
        type: DataTypes.ENUM,
        values: ['order', 'sale', 'announcement', 'n/a']
      },
      audience: {
        type: DataTypes.ENUM,
        values: ['all', 'employees', 'students', 'department students', 'individual']
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

