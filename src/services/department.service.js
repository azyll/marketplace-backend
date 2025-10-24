// @ts-check
import {Op, Transaction} from 'sequelize';
import {DB} from '../database/index.js';
import {AlreadyExistException} from '../exceptions/alreadyExist.js';
import {NotFoundException} from '../exceptions/notFound.js';
import sequelize from '../database/config/sequelize.js';

const {Department} = DB;

/**
 * @typedef {import('../types/index.js').QueryParams} QueryParams
 */
export class DepartmentService {
  /**
   * Create Department
   * @param {{name:string,acronym:string}} body - Department name
  
   * @throws {AlreadyExistException} if the Department is already exists
   */
  static async createDepartment({name, acronym}) {
    return await sequelize.transaction(async (transaction) => {
      const [department, isJustCreated] = await Department.findOrCreate({
        where: {
          [Op.or]: [{name: name.trim()}, {acronym: acronym.trim()}]
        },
        defaults: {name: name.trim(), acronym: acronym.trim()},
        transaction
      });

      if (!isJustCreated) {
        throw new AlreadyExistException('This Department is already exists');
      }
      let fields = {
        title: `A new department was added ${department.name}`,
        content: `New Department ${department.name} ${department.acronym}`,
        type: 'system'
      };
      await DB.ActivityLog.create(fields, {transaction: transaction});

      return department;
    });
  }

  /**
   * Delete Department
   * @throws {NotFoundException}
   * @param {string} DepartmentId
   */
  static async archiveDepartment(DepartmentId) {
    return await sequelize.transaction(async (transaction) => {
      const department = await DB.Department.findByPk(DepartmentId, {transaction});
      if (!department) throw new NotFoundException('Department not found');

      const db = await DB.Program.findOne({where: {departmentId: department.id}, transaction});
      if (db)
        throw new Error(
          `Cannot archive department ${department.name} because it is associated with an active program.`
        );

      let fields = {
        title: `A department was put to archived ${department.name}`,
        content: `Department put to archived ${department.name} ${department.acronym}`,
        type: 'system'
      };
      await DB.ActivityLog.create(fields, {transaction: transaction});
      return await department.destroy({transaction});
    });
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
    return await sequelize.transaction(async (transaction) => {
      const department = await DB.Department.findByPk(DepartmentId, {transaction});
      if (!department) throw new NotFoundException('Department not found');

      let fields = {
        title: `A department was updated ${department.name}`,
        content: `Department was updated ${department.name} ${department.acronym}`,
        type: 'system'
      };
      await DB.ActivityLog.create(fields, {transaction: transaction});
      return await department.update(newDepartment, {transaction});
    });
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
    return await sequelize.transaction(async (transaction) => {
      const department = await DB.Department.findByPk(departmentId, {
        paranoid: false,
        transaction
      });
      if (!department) throw new NotFoundException('Department not found');
      let fields = {
        title: `A department was put to active ${department.name}`,
        content: `Department was put to active ${department.name} ${department.acronym}`,
        type: 'system'
      };
      await DB.ActivityLog.create(fields, {transaction: transaction});
      return await department.restore({transaction});
    });
  }
}
