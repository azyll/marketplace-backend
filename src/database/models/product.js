import Joi from "joi";
import { Model, DataTypes } from "sequelize";
import { sequelizeJoi } from "sequelize-joi";

export default (sequelize) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.ProductTypes, {
        foreignKey: "typeId",
        as: "type",
      });
      models.ProductTypes.hasMany(Product, {
        foreignKey: "typeId",
        as: "product",
      });
    }
  }
  sequelizeJoi(sequelize);
  Product.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      subId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        schema: Joi.string().trim().required(),
      },
      price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        schema: Joi.number().positive().precision(2).required(),
      },
    },
    {
      sequelize,
      modelName: "Products",
    },
  );
  return Product;
};
