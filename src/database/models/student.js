import { Model, DataTypes, Model as Users } from "sequelize";
import User from "./user.js";
import { v4 as uuid } from "uuid";
import { Joi, sequelizeJoi } from "sequelize-joi";

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

      Student.belongsTo(models.Program, {
        foreignKey: {
          name: "programId",
          allowNull: false,
        },
      });
      Student.hasMany(models.Cart, {
        foreignKey: {
          name: "studentId",
          allowNull: false,
        },
      });
    }
  }

  sequelizeJoi(sequelize);
  Student.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        schema: Joi.number().integer().min(1).positive().required(),
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
        schema: Joi.string().trim().required(),
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        schema: Joi.date().allow(null),
      },
    },
    {
      sequelize,
      modelName: "Students",
    },
  );
  return Student;
};
