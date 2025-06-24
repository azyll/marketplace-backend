import Joi from 'joi';
import {DB} from '../database/index.js';
import {AlreadyExistException} from '../exceptions/alreadyExist.js';
import {NotFoundException} from '../exceptions/notFound.js';

const {User, ModulePermission} = DB;

export class ModulePermissionService {
  /**
   * @param {string} userId
   * @param {'sales' | 'orders' | 'inventory'} module
   * @param {'view' | 'edit' | 'n/a'} permission
   */
  static async createModulePermission(userId, module, permission) {
    const [newModulePermission, isJustCreated] = await ModulePermission.findOrCreate({
      where: {
        userId,
        module
      },
      defaults: {
        userId,
        module,
        permission
      }
    });

    if (!isJustCreated) throw new AlreadyExistException('The Module Permission is already exists for this user');

    return newModulePermission;
  }
  /**
   *
   * @param {string} userId
   */
  static async getUserModulePermission(userId) {
    const user = await User.findByPk(userId);

    if (!user) throw new NotFoundException('User not found');

    const userModulesPermission = await ModulePermission.findAll({
      where: {
        userId
      }
    });

    if (!userModulesPermission) throw new NotFoundException('User modules permission not found');

    return userModulesPermission;
  }
}

