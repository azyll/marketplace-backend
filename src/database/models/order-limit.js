'use strict';
import {Model, DataTypes} from 'sequelize';
import {Joi, sequelizeJoi} from 'sequelize-joi';

export default (sequelize) => {
  class OrderLimit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  sequelizeJoi(sequelize);

  OrderLimit.init(
    {
      limit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        schema: Joi.number().integer().min(0).required(),
        defaultValue: 1
      }
    },
    {
      sequelize,
      paranoid: true,
      modelName: 'OrderLimits'
    }
  );
  return OrderLimit;
};

