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
        as: "type",
        foreignKey: "typeId",
      });
      Product.hasMany(models.ProductVariant);
      Product.belongsTo(models.Program);
    }
  }
  sequelizeJoi(sequelize);
  Product.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUID,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        schema: Joi.string().trim().required(),
      },
      description: {
        type: DataTypes.STRING,
      },
      image: {
        type: DataTypes.STRING,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName: "Products",
    },
  );
  return Product;
};
