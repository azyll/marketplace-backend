'use strict';

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
    }
  }
  sequelizeJoi(sequelize);
  ActivityLog.init(
    {
      title: {
        type: DataTypes.STRING,
        schema: Joi.string().trim().required(),
        allowNull: false
      },
      content: {
        type: DataTypes.STRING,
        schema: Joi.string().trim().required()
      },
      type: {
        type: DataTypes.ENUM,
        values: ['user', 'application', 'stock', 'sales', 'order'],
        schema: Joi.string().required().valid('user', 'application', 'stock', 'sales', 'order')
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
