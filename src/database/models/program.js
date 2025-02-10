"use strict";
import { Model, DataTypes } from "sequelize";
export default (sequelize) => {
  class Program extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Program.hasMany(models.Product);
      Program.hasOne(models.Student);
    }
  }
  Program.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUID,
      },
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Programs",
    },
  );
  return Program;
};
