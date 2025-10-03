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
        schema: Joi.number().min(0),
        allowNull: true,
        defaultValue: 0
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

