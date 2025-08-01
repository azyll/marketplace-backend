'use strict';
import {Model, DataTypes} from 'sequelize';
import {Joi, sequelizeJoi} from 'sequelize-joi';
import {customAlphabet} from 'nanoid';
import {getDateAndTimeStamp} from '../../utils/date-helper.js';

const nanoid = customAlphabet('1234567890', 5);

export default (sequelize) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.hasOne(models.Sales, {
        foreignKey: {
          name: 'orderId',
          allowNull: false
        },
        as: 'sales'
      });
      Order.hasMany(models.OrderItems, {
        foreignKey: {
          name: 'orderId',
          allowNull: false
        },
        as: 'orderItems'
      });
      Order.belongsTo(models.Student, {
        foreignKey: {
          name: 'studentId',
          allowNull: false
        },
        as: 'student'
      });
    }
  }
  sequelizeJoi(sequelize);
  Order.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.STRING
      },
      total: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        schema: Joi.number().min(0).precision(2).required()
      },
      status: {
        type: DataTypes.ENUM,
        values: ['completed', 'ongoing', 'cancelled'],
        schema: Joi.string().required().trim().valid('completed', 'ongoing', 'cancelled')
      }
    },
    {
      sequelize,
      paranoid: true,
      modelName: 'Orders'
    }
  );
  Order.beforeCreate(async (order) => {
    let id;
    let exists = true;

    while (exists) {
      id = nanoid();
      const existing = await Order.findByPk(`OR-${getDateAndTimeStamp()}-${id}`);
      exists = !!existing;
    }

    order.id = `OR-${getDateAndTimeStamp()}-${id}`;
  });
  return Order;
};
