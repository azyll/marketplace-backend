import { Joi, sequelizeJoi } from "sequelize-joi";

import { Model, DataTypes } from "sequelize";
export default (sequelize) => {
  class Sales extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Sales.belongsTo(models.Order, {
        foreignKey: {
          name: "orderId",
          allowNull: false,
        },
      });
    }
  }
  sequelizeJoi(sequelize);
  Sales.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      total: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        schema: Joi.number().integer().min(0).required(),
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
        schema: Joi.date().allow(null),
      },
    },
    {
      sequelize,
      modelName: "Sales",
    },
  );
  return Sales;
};
