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
      ModulePermission.belongsTo(models.Role, {
        foreignKey: 'roleId',
        as: 'role'
      });
    }
  }
  sequelizeJoi(sequelize);
  ModulePermission.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      module: {
        type: DataTypes.ENUM,
        values: [
          'users',
          'roles',
          'departments',
          'programs',
          'products',
          'orders',
          'sales',
          'inventory',
          'return-items',
          'announcement-carousel',
          'activity-logs',
          'reports'
        ],
        schema: Joi.string()
          .trim()
          .required()
          .valid(
            'users',
            'roles',
            'departments',
            'programs',
            'products',
            'orders',
            'sales',
            'inventory',
            'return-items',
            'announcement-carousel',
            'activity-logs',
            'reports'
          )
      },
      permission: {
        type: DataTypes.ENUM,
        values: ['view', 'edit'],
        schema: Joi.string().trim().required().valid('view', 'edit')
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

