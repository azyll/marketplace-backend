import { Model, DataTypes } from "sequelize";
import { v4 as uuid } from "uuid";
import { Joi, sequelizeJoi } from "sequelize-joi";

export default (sequelize) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Role.hasMany(models.ActivityLog, {
        foreignKey: "actorId",
      });
    }
  }
  sequelizeJoi(sequelize);
  Role.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        schema: Joi.string().trim().required(),
      },
      systemTag: {
        type: DataTypes.ENUM,
        values: ["student", "admin", "employee"],
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        schema: Joi.date().allow(null),
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
