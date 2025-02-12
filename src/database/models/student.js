import { Model, DataTypes, Model as Users } from "sequelize";
import User from "./user.js";
import { v4 as uuid } from "uuid";

export default (sequelize) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Student.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      Student.belongsTo(models.Program);
      Student.hasMany(models.Cart);
    }
  }
  Student.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        references: {
          model: User(sequelize),
          key: "id",
        },
      },
      level: {
        type: DataTypes.ENUM,
        values: ["shs", "tertiary"],
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Students",
    },
  );
  return Student;
};
