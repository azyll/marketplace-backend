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
   * @param {{name:string,acronym:string}} body - Department name
   * @returns {Promise<Department>} data from the database
   * @throws {AlreadyExistException} if the Department is already exists
   */
  static async createDepartment({name, acronym}) {
    const [department, isJustCreated] = await Department.findOrCreate({
      where: {
        [Op.or]: [{name: name.trim()}, {acronym: acronym.trim()}]
      },
      defaults: {name: name.trim(), acronym: acronym.trim()}
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
    const db = await DB.Program.findOne({where: {departmentId: department.id}});
    if (db)
      throw new Error(`Cannot archive department ${department.name} because it is associated with an active program.`);
    return await department.destroy();
  }

  /**
   * Get all Department
   */
  static async getDepartments(query) {
    const where = {};

    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;

    if (query.search) {
      const searchTerm = query.search.trim();

      where[Op.or] = [{name: {[Op.iLike]: `%${searchTerm}%`}}, {acronym: {[Op.iLike]: `%${searchTerm}%`}}];
    }

    let isAll = false;

    if (query.all === 'true') {
      isAll = true;
    } else if (query.all === 'false') {
      isAll = false;
    }
    if (query.status === 'archived') {
      where.deletedAt = {
        [Op.not]: null
      };
    } else if (query.status === 'active') {
      where.deletedAt = {
        [Op.is]: null
      };
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
      paranoid: !isAll,
      offset: (page - 1) * limit,
      limit,
      order: [['name', 'ASC']]
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
      paranoid: false,
      include: [
        {
          model: DB.Program,
          as: 'program'
        }
      ]
    });
    return department;
  }

  /**
   * Delete program
   * @throws {NotFoundException}
   * @param {string} departmentId
   */
  static async restoreDepartment(departmentId) {
    const department = await DB.Department.findByPk(departmentId, {
      paranoid: false
    });
    if (!department) throw new NotFoundException('Department not found');

    return await department.restore();
  }
}
