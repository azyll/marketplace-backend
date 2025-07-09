'use strict';
import {DataTypes, Model} from 'sequelize';
import {Joi, sequelizeJoi} from 'sequelize-joi';
export default (sequelize) => {
  class ModulePermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ModulePermission.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  }
  sequelizeJoi(sequelize);
  ModulePermission.init(
    {
      module: {
        type: DataTypes.ENUM,
        values: ['sales', 'orders', 'inventory'],
        schema: Joi.string().trim().required().valid('sales', 'orders', 'inventory')
      },
      permission: {
        type: DataTypes.ENUM,
        values: ['view', 'edit', 'n/a'],
        schema: Joi.string().trim().required().valid('view', 'edit', 'n/a')
      }
    },
    {
      sequelize,
      paranoid: true,
      modelName: 'ModulePermissions'
    }
  );
  return ModulePermission;
};

