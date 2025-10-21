// @ts-check
import {Op} from 'sequelize';
import {DB} from '../database/index.js';
import {AlreadyExistException} from '../exceptions/alreadyExist.js';
import {NotFoundException} from '../exceptions/notFound.js';

const {Department} = DB;

/**
 * @typedef {import('../types/index.js').QueryParams} QueryParams
 */
export class DepartmentService {
  /**
   * Create Department
   * @param {string} name - Department name
   * @returns {Promise<Department>} data from the database
   * @throws {AlreadyExistException} if the Department is already exists
   */
  static async createDepartment(name) {
    const [department, isJustCreated] = await Department.findOrCreate({
      where: {name},
      defaults: {name}
    });

    if (!isJustCreated) {
      throw new AlreadyExistException('This Department is already exists');
    }

    return department;
  }

  /**
   * Delete Department
   * @throws {NotFoundException}
   * @param {string} DepartmentId
   */
  static async archiveDepartment(DepartmentId) {
    const department = await DB.Department.findByPk(DepartmentId);
    if (!department) throw new NotFoundException('Department not found');

    return await department.destroy();
  }

  /**
   * Get all Department
   */
  static async getDepartments(all = false, query) {
    const where = {};
    if (!all) {
      where.name = {
        [Op.not]: 'Proware'
      };
    }
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;

    if (query.search) {
      const searchTerm = query.search.trim();

      where[Op.or] = [{name: {[Op.iLike]: `%${searchTerm}%`}}, {acronym: {[Op.iLike]: `%${searchTerm}%`}}];
    }
    const departments = await Department.findAndCountAll({
      include: [
        {
          model: DB.Program,
          as: 'program'
        }
      ],
      distinct: true,
      where,
      offset: (page - 1) * limit,
      limit
    });
    return {
      data: departments.rows,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: departments.count
      }
    };
  }

  /**
   * Update Department
   * @param {string} DepartmentId
   * @param {object} newDepartment
   * @throws {NotFoundException}
   * @throws {AlreadyExistException}
   */
  static async updateDepartment(DepartmentId, newDepartment) {
    const department = await DB.Department.findByPk(DepartmentId);
    if (!department) throw new NotFoundException('Department not found');
    return await department.update(newDepartment);
  }

  /**
   * Get a single Department
   * @param {string} DepartmentId
   * @throws {NotFoundException}
   */
  static async getDepartment(DepartmentId) {
    const department = await Department.findByPk(DepartmentId, {
      include: [
        {
          model: DB.Program,
          as: 'program'
        }
      ]
    });
    return department;
  }
}
