import {Model, DataTypes} from 'sequelize';
import useBcrypt from 'sequelize-bcrypt';
import {Joi, sequelizeJoi} from 'sequelize-joi';
import Role from './role.js';
import {v4 as uuid} from 'uuid';

export default (sequelize) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Role, {
        foreignKey: {
          name: 'roleId',
          allowNull: false
        },
        as: 'role'
      });
      User.hasOne(models.Student, {
        foreignKey: 'userId',
        as: 'student'
      });
      User.hasMany(models.NotificationReceiver, {
        foreignKey: 'userId',
        as: 'notificationReceiver'
      });
      User.hasMany(models.ModulePermission, {
        foreignKey: 'userId',
        as: 'modulePermission'
      });
    }
  }
  sequelizeJoi(sequelize);
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true
      },
      firstName: {
        type: DataTypes.STRING,
        schema: Joi.string().trim().required()
      },

      lastName: {
        type: DataTypes.STRING,
        schema: Joi.string().trim().required()
      },
      fullName: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${this.firstName} ${this.lastName}`;
        }
      },
      email: {
        type: DataTypes.STRING,
        schema: Joi.string().trim().email().required(),
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        schema: Joi.string().required()
      },
      roleId: {
        type: DataTypes.UUID,
        references: {
          model: Role(sequelize),
          key: 'id'
        },
        allowNull: false
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        schema: Joi.date().allow(null)
      }
    },
    {
      sequelize,
      modelName: 'Users',
      defaultScope: {
        attributes: {exclude: ['password', 'roleId']}
      },
      scopes: {
        withPassword: {
          attributes: {include: ['password']}
        }
      }
    }
  );

  User.beforeCreate((user) => (user.id = uuid()));

  useBcrypt(User);

  return User;
};
