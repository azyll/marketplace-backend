// @ts-check
import {Op} from 'sequelize';
import {DB} from '../database/index.js';
import {AlreadyExistException} from '../exceptions/alreadyExist.js';
import {NotFoundException} from '../exceptions/notFound.js';
import {NotificationService} from './notification.service.js';

const {Program, Department} = DB;

/**
 * @typedef {import('../types/index.js').QueryParams} QueryParams
 */
export class ProgramService {
  /**
   * Create program
   * @param {string} name - program name
   * @param {string} acronym - program acronym
   * @param {string} departmentId - department Id
   * @returns {Promise<Program>} data from the database
   * @throws {AlreadyExistException} if the program is already exists
   */
  static async createProgram(name, acronym, departmentId) {
    const department = await Department.findByPk(departmentId);
    if (!department) throw new NotFoundException('Department not found', 404);
    const [program, isJustCreated] = await Program.findOrCreate({
      where: {
        [Op.or]: [{name}, {acronym}]
      },
      defaults: {
        departmentId,
        name,
        acronym
      }
    });

    if (!isJustCreated) {
      throw new AlreadyExistException('This program is already exists');
    }
    await NotificationService.createNotification('New Program', 'A new Program Created', 'announcement', 'students', {
      departmentId: null,
      userId: null
    });

    return program;
  }

  /**
   * Delete program
   * @throws {NotFoundException}
   * @param {string} programId
   */
  static async archiveProgram(programId) {
    const program = await DB.Program.findByPk(programId);
    if (!program) throw new NotFoundException('Program not found');
    const student = await DB.Student.findOne({where: {programId}});
    if (student) {
      throw new Error(`Cannot archive program ${program.name} because it is associated with an active students.`);
    }
    return await program.destroy();
  }

  /**
   * Delete program
   * @throws {NotFoundException}
   * @param {string} programId
   */
  static async restoreProgram(programId) {
    const program = await DB.Program.findByPk(programId, {
      paranoid: false
    });
    if (!program) throw new NotFoundException('Program not found');

    return await program.restore();
  }

  /**
   * Get all program

   */
  static async getPrograms(query) {
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;
    const whereClause = {};
    if (query.search) {
      const searchTerm = query.search.trim();

      whereClause[Op.or] = [{name: {[Op.iLike]: `%${searchTerm}%`}}, {acronym: {[Op.iLike]: `%${searchTerm}%`}}];
    }

    if (query.department) {
      const departmentNamesToFind = [query.department];

      const departments = await DB.Department.findAll({
        where: {
          [Op.or]: [{name: {[Op.in]: departmentNamesToFind}}, {acronym: {[Op.in]: departmentNamesToFind}}]
        }
      });

      // If not enough departments found (either Proware or requested one missing)
      if (departments.length < 0) {
        return {
          data: [],
          meta: {
            currentPage: page,
            itemsPerPage: limit,
            totalItems: 0
          }
        };
      }

      whereClause.departmentId = {
        [Op.or]: [departments[0].id]
      };
    }

    let isAll = false;

    if (query.all === 'true') {
      isAll = true;
    } else if (query.all === 'false') {
      isAll = false;
    }
    if (query.status === 'archived') {
      whereClause.deletedAt = {
        [Op.not]: null
      };
    } else if (query.status === 'active') {
      whereClause.deletedAt = {
        [Op.is]: null
      };
    }

    const programs = await Program.findAndCountAll({
      include: [{model: Department, as: 'department', paranoid: false}],
      distinct: true,
      where: whereClause,
      paranoid: !isAll,
      offset: (page - 1) * limit,
      limit,
      order: [['name', 'ASC']]
    });
    return {
      data: programs.rows,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: programs.count
      }
    };
  }

  /**
   * Update program
   * @param {string} programId
   * @param {object} newProgram
   * @throws {NotFoundException}
   * @throws {AlreadyExistException}
   */
  static async updateProgram(programId, newProgram) {
    const program = await DB.Program.findByPk(programId);
    if (!program) throw new NotFoundException('Program not found');

    return await program.update(newProgram);
  }

  /**
   * Get a single program
   * @param {string} programId
   * @throws {NotFoundException}
   */
  static async getProgram(programId) {
    const program = await DB.Program.findByPk(programId, {
      paranoid: false
    });
    if (!program) throw new NotFoundException('Program not found');

    return program;
  }
}
