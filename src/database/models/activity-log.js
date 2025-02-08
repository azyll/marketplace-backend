"use strict";
import { Model, DataTypes } from "sequelize";
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
        as: "actor",
      });
    }
  }
  ActivityLog.init(
    {
      title: {
        type: DataTypes.STRING,
      },
      content: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.ENUM,
        values: ["SALES", "Admin", "asd"],
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName: "ActivityLogs",
    },
  );
  ActivityLog.removeAttribute("id");
  return ActivityLog;
};
