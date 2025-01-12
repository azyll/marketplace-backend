import sequelize from "./config/sequelize.js";
import UserModel from "./models/user.js";

export const DB = {
  sequelize,
  User: UserModel(sequelize),
};
