import { Model, DataTypes } from "sequelize";
import { v4 as uuid } from "uuid";

export default (sequelize) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Role.init(
    {
      name: DataTypes.STRING,
      systemTag: {
        type: DataTypes.ENUM,
        values: ["student", "admin", "employee"],
      },
    },
    {
      sequelize,
      modelName: "Roles",
    },
  );

  Role.beforeCreate((role) => (role.id = uuid()));
  return Role;
};
