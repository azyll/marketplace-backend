import {Model, DataTypes} from 'sequelize';
import useBcrypt from 'sequelize-bcrypt';
import {Joi, sequelizeJoi} from 'sequelize-joi';
import Role from './role.js';
import {v4 as uuid} from 'uuid';

export default (sequelize) => {
  class CarouselAnnouncementImage extends Model {
    static associate(models) {
      CarouselAnnouncementImage.belongsTo(models.Product, {
        foreignKey: {
          name: 'productId',
          allowNull: true
        },
        as: 'product'
      });
    }
  }
  sequelizeJoi(sequelize);
  CarouselAnnouncementImage.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      title: {
        allowNull: true,
        type: DataTypes.TEXT,
        schema: Joi.string().trim().optional()
      },
      message: {
        allowNull: true,
        type: DataTypes.TEXT,
        schema: Joi.string().trim().optional()
      },
      image: {
        type: DataTypes.TEXT,
        schema: Joi.string().trim().required()
      }
    },
    {
      sequelize,
      modelName: 'CarouselAnnouncementImages',
      paranoid: true
    }
  );
  return CarouselAnnouncementImage;
};

