import { Model, DataTypes } from "sequelize";
import useBcrypt from "sequelize-bcrypt";
import { Joi, sequelizeJoi } from "sequelize-joi";

export default (sequelize) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  sequelizeJoi(sequelize);
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        schema: Joi.string().trim().required(),
      },
      lastName: {
        type: DataTypes.STRING,
        schema: Joi.string().trim().required(),
      },
      email: {
        type: DataTypes.STRING,
        schema: Joi.string().trim().email().required(),
      },
      password: {
        type: DataTypes.STRING,
        schema: Joi.string().required(),
      },
      deletedAt: {
        type: DataTypes.DATE,
        schema: Joi.date().allow(null),
      },
    },
    {
      sequelize,
      modelName: "Users",
      defaultScope: {
        attributes: { exclude: ["password"] },
      },
    },
  );

  useBcrypt(User, { field: "password", rounds: 12, compare: "authenticate" });

  return User;
};
