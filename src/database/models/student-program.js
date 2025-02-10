"use strict";
import { Model, DataTypes } from "sequelize";
export default (sequelize) => {
  class StudentProgram extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StudentProgram.hasMany(models.Product);
      StudentProgram.belongsTo(models.Student);
    }
  }
  StudentProgram.init(
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
      modelName: "StudentPrograms",
    },
  );
  return StudentProgram;
};
