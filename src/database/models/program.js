"use strict";
import { Model, DataTypes } from "sequelize";
import { Joi, sequelizeJoi } from "sequelize-joi";
export default (sequelize) => {
  class Program extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Program.hasMany(models.Product, {
        foreignKey: {
          name: "programId",
          allowNull: false,
        },
      });
      Program.hasOne(models.User, {
        foreignKey: {
          name: "programId",
          allowNull: false,
        },
      });
    }
  }
  sequelizeJoi(sequelize);
  Program.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        schema: Joi.string().trim().required(),
        allowNull: false,
        unique: true,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
        schema: Joi.date().allow(null),
      },
    },
    {
      sequelize,
      modelName: "Programs",
    },
  );
  return Program;
};
