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
    }
  }
  Sales.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      total: DataTypes.DOUBLE,
    },
    {
      sequelize,
      modelName: "Sales",
    },
  );
  return Sales;
};
