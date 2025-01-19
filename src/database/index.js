import sequelize from "./config/sequelize.js";
import UserModel from "./models/user.js";
import RoleModel from "./models/role.js";
import StudentModel from "./models/student.js";
export const DB = {
  sequelize,
  User: UserModel(sequelize),
  Role: RoleModel(sequelize),
  Student: StudentModel(sequelize),
};

Object.values(DB).forEach((model) => {
  if (model.associate) {
    model.associate(DB);
  }
});
