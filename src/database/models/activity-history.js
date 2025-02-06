"use strict";
import { Model, DataTypes } from "sequelize";
export default (sequelize) => {
  class ActivityHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ActivityHistory.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ActivityHistory",
    },
  );
  return ActivityHistory;
};
