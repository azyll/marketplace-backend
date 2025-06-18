//@ts-check
import {DB} from '../database/index.js';
import {AlreadyExistException} from '../exceptions/alreadyExist.js';
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
   * @param {string} programId
   */
  static async archiveRole(programId) {}

  /**
   * Get all program
   */
  static async getRoles() {
    const roles = await Role.findAll();
    return roles;
  }

  /**
   * Update program
   * @param {string} programId
   * @param {object} newProgram
   * @throws {NotFoundException}
   * @throws {AlreadyExistException}
   */
  static async updateRole(programId, newProgram) {}
}

