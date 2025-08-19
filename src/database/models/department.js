'use strict';
import {Model, DataTypes} from 'sequelize';
import {Joi, sequelizeJoi} from 'sequelize-joi';
export default (sequelize) => {
  class Department extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Department.hasMany(models.Product, {
        foreignKey: {
          name: 'departmentId',
          allowNull: false
        },
        as: 'product'
      });

      Department.hasMany(models.Program, {
        foreignKey: {
          name: 'departmentId',
          allowNull: false
        },
        as: 'program'
      });
    }
  }
  sequelizeJoi(sequelize);
  Department.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        schema: Joi.string().trim().required()
      }
    },
    {
      sequelize,
      modelName: 'Departments',
      paranoid: true
    }
  );
  return Department;
};
