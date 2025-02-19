import { Model, DataTypes } from "sequelize";
import { sequelizeJoi, Joi } from "sequelize-joi";
export default (sequelize) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasMany(models.ProductVariant, {
        foreignKey: {
          name: "productId",
          allowNull: false,
        },
      });
      Product.belongsTo(models.Program, {
        foreignKey: {
          name: "programId",
          allowNull: false,
        },
      });
    }
  }
  sequelizeJoi(sequelize);
  Product.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        schema: Joi.string().trim().required(),
        unique: true,
      },

      description: {
        type: DataTypes.STRING,
        schema: Joi.string().trim().required(),
      },
      image: {
        type: DataTypes.STRING,
        schema: Joi.string().trim().required(),
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        schema: Joi.date().allow(null),
      },
      type: {
        type: DataTypes.ENUM,
        values: ["top", "bottom", "n/a"],
      },
      category: {
        type: DataTypes.ENUM,
        values: ["uniform", "proware", "stationery accessory"],
      },
    },
    {
      sequelize,
      modelName: "Products",
    },
  );

  return Product;
};
