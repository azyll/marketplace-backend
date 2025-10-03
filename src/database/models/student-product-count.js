import {DataTypes, Model} from 'sequelize';
import {Joi, sequelizeJoi} from 'sequelize-joi';

export default (sequelize) => {
  class StudentProductCount extends Model {
    static associate(models) {
      StudentProductCount.belongsTo(models.Student, {
        foreignKey: {
          name: 'studentId',
          allowNull: false
        },
        as: 'student'
      });
      StudentProductCount.belongsTo(models.ProductVariant, {
        foreignKey: {
          name: 'productVariantId',
          allowNull: false
        },
        as: 'productVariant'
      });
    }
  }
  sequelizeJoi(sequelize);
  StudentProductCount.init(
    {
      // The value of count should not exceed to the value of order limit
      count: {
        type: DataTypes.INTEGER,
        schema: Joi.number().integer().min(1),
        allowNull: true,
        defaultValue: 1
      }
    },
    {
      sequelize,
      modelName: 'StudentProductCounts',
      paranoid: true
    }
  );
  return StudentProductCount;
};

