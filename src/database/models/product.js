import {Model, DataTypes} from 'sequelize';
import {sequelizeJoi, Joi} from 'sequelize-joi';
import {convertToSlug} from '../../utils/slug-helper.js';
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
          name: 'productId',
          allowNull: false
        },
        as: 'productVariant'
      });
      Product.belongsTo(models.Department, {
        foreignKey: {
          name: 'departmentId',
          allowNull: false
        },
        as: 'department'
      });
    }
  }
  sequelizeJoi(sequelize);
  Product.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        schema: Joi.string().trim().required(),
        unique: true
      },
      description: {
        type: DataTypes.STRING,
        schema: Joi.string().trim().required()
      },
      image: {
        type: DataTypes.STRING,
        schema: Joi.string().trim().required()
      },
      type: {
        type: DataTypes.ENUM,
        values: ['upper-wear', 'lower-wear', 'non-wearable'],
        schema: Joi.string().trim().required().valid('upper-wear', 'lower-wear', 'non-wearable')
      },
      category: {
        type: DataTypes.ENUM,
        values: ['uniform', 'proware', 'stationery', 'accessory'],
        schema: Joi.string().required().valid('uniform', 'proware', 'stationery', 'accessory')
      },
      productSlug: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${convertToSlug(this.name)}`;
        }
      }
    },
    {
      sequelize,
      paranoid: true,
      modelName: 'Products'
    }
  );

  return Product;
};
