// @ts-check
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
   * @param {string} departmentId - department Id
   * @returns {Promise<Program>} data from the database
   * @throws {AlreadyExistException} if the program is already exists
   */
  static async createProgram(name, departmentId) {
    const department = await Department.findByPk(departmentId);
    if (!department) throw new NotFoundException('Department not found', 404);
    const [program, isJustCreated] = await Program.findOrCreate({
      where: {name},
      defaults: {
        departmentId
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
  static async archiveProgram(programId) {}

  /**
   * Get all program

   */
  static async getPrograms() {
    const programs = await Program.findAll({
      include: [{model: Department, as: 'department'}]
    });
    return programs;
  }

  /**
   * Update program
   * @param {string} programId
   * @param {object} newProgram
   * @throws {NotFoundException}
   * @throws {AlreadyExistException}
   */
  static async updateProgram(programId, newProgram) {}

  /**
   * Get a single program
   * @param {string} programId
   * @throws {NotFoundException}
   */
  static async getProgram(programId) {}
}
