// @ts-check
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
      where: {name}
    });

    if (!isJustCreated) {
      throw new AlreadyExistException('This Department is already exists');
    }

    return Department;
  }

  /**
   * Delete Department
   * @throws {NotFoundException}
   * @param {string} DepartmentId
   */
  static async archiveDepartment(DepartmentId) {}

  /**
   * Get all Department

   */
  static async getDepartments() {
    const Departments = await Department.findAll();
    return Departments;
  }

  /**
   * Update Department
   * @param {string} DepartmentId
   * @param {object} newDepartment
   * @throws {NotFoundException}
   * @throws {AlreadyExistException}
   */
  static async updateDepartment(DepartmentId, newDepartment) {}

  /**
   * Get a single Department
   * @param {string} DepartmentId
   * @throws {NotFoundException}
   */
  static async getDepartment(DepartmentId) {}
}
