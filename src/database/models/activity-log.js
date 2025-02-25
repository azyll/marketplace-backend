"use strict";
import { Model, DataTypes } from "sequelize";
import { Joi, sequelizeJoi } from "sequelize-joi";

export default (sequelize) => {
  class ActivityLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ActivityLog.belongsTo(models.Role, {
        foreignKey: {
          name: "roleId",
          allowNull: false,
        },
        as: "actor",
      });
    }
  }
  sequelizeJoi(sequelize);
  ActivityLog.init(
    {
      title: {
        type: DataTypes.STRING,
        schema: Joi.string().trim().required(),
      },
      content: {
        type: DataTypes.STRING,
        schema: Joi.string().trim().required(),
      },
      type: {
        type: DataTypes.ENUM,
        values: ["SALES", "Admin", "asd"],
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        schema: Joi.date().allow(null),
      },
    },
    {
      sequelize,
      modelName: "ActivityLogs",
    },
  );

  return ActivityLog;
};
