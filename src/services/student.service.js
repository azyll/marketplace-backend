import {UserService} from './user.service.js';
import {NotFoundException} from '../exceptions/notFound.js';
import {DB} from '../database/index.js';
import {Op} from 'sequelize';
import {AlreadyExistException} from '../exceptions/alreadyExist.js';

const {Student} = DB;

export class StudentService {
  /**
   * @typedef CreateStudentInput
   * @property {string} program
   * @property {string} level
   */

  /**
   * Create Student by UserId
   * @param {string} userId - user id
   * @param {{
   * program:string,
   * level: 'shs'|'tertiary'
   * }} studentData
   *
   * @throws {NotFoundException} - user does not exists
   * @throws {AlreadyExistException} - student already exist
   * @returns {Promise<Student>} student from the database
   */
  static async createStudent(userId, studentData) {
    const user = await UserService.getUser(userId);

    if (!user) throw new NotFoundException(`Can't get user with id of '${userId}'`, 404);

    const hasStudent = await this.getStudentByUserId(userId);

    if (hasStudent) throw new AlreadyExistException('Student already exists', 409);

    return await DB.Student.create({
      userId,
      ...studentData
    });
  }

  /**
   *
   * @param {string} userId - user id
   * @returns {Promise<Student>} student with users data
   * @throws {NotFoundException}  student does not exists
   */
  static async getStudentByUserId(userId) {
    const student = await DB.Student.findOne({
      where: {userId, deletedAt: {[Op.is]: null}},
      include: [
        {
          model: DB.User,
          as: 'user'
        }
      ]
    });
    if (!student) throw new NotFoundException(`Student not found`, 404);

    return student;
  }
}
