//@ts-check
import {Op} from 'sequelize';
import {DB} from '../database/index.js';
import {AlreadyExistException} from '../exceptions/alreadyExist.js';
import {NotFoundException} from '../exceptions/notFound.js';
const {Role} = DB;
export class RoleService {
  /**
   *
   * @param {{name:string,systemTag:"student"| "admin"| "employee"}} roleData
   * @returns {Promise<Role>}
   */
  static async createRole(roleData) {
    const {name, systemTag} = roleData;
    const [role, isNewItem] = await Role.findOrCreate({
      where: {name, systemTag},
      defaults: {name, systemTag}
    });

    if (!isNewItem) throw new AlreadyExistException('Role is already exists', 409);
    return role;
  }

  /**
   * Delete program
   * @throws {NotFoundException}
   * @param {string} roleId
   */
  static async archiveRole(roleId) {
    const role = await DB.Role.findByPk(roleId);
    if (!role) throw new NotFoundException('Role not found');

    return await role.destroy();
  }

  /**
   * Get all program
   */
  static async getRoles(query) {
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;
    const whereClause = {};
    if (query.search) {
      const searchTerm = query.search.trim();

      whereClause[Op.or] = [{name: {[Op.iLike]: `%${searchTerm}%`}}];
    }
    const roles = await Role.findAndCountAll({
      where: whereClause,
      offset: (page - 1) * limit,
      limit
    });
    return {
      data: roles.rows,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: roles.count
      }
    };
  }

  /**
   * Get role
   * @param {'employee'|'admin'|'student'} systemTag
   */
  static async getRole(systemTag) {
    const role = await Role.findOne({
      where: {
        systemTag
      }
    });
    return role;
  }

  /**
   * Update program
   * @param {string} programId
   * @param {object} newRole
   * @throws {NotFoundException}
   * @throws {AlreadyExistException}
   */
  static async updateRole(programId, newRole) {
    const role = await DB.Program.findByPk(programId);
    if (!role) throw new NotFoundException('Role not found');

    return await role.update(newRole);
  }
}

