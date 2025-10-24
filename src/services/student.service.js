//@ts-check

import {UserService} from './user.service.js';
import {NotFoundException} from '../exceptions/notFound.js';
import {DB} from '../database/index.js';
import {Op} from 'sequelize';
import {AlreadyExistException} from '../exceptions/alreadyExist.js';
import sequelize from '../database/config/sequelize.js';
import {ActivityLogService} from './activity-log.service.js';

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
        },
        {
          model: DB.Program,
          as: 'program',
          include: [{model: DB.Department, as: 'department'}]
        }
      ]
    });

    return student;
  }
  /**
   * @typedef {Object} StudentRecord
   * @property {string} StudentID - Student ID
   * @property {string} LastName - Last Name
   * @property {string} FirstName - First Name
   * @property {string} MiddleName - Middle Name
   * @property {string} Address - Address
   * @property {string} ContactType - Contact Type
   * @property {string} ContactNo - Contact number
   * @property {string} Birthdate - Birthdate (e.g., '7/15/04')
   * @property {string} Gender - Gender
   * @property {string} Program - Program
   * @property {string} AdmitType - Admit Type
   * @property {string} AdmitTerm - Admit Term
   * @property {string} ReqTerm - Required Term
   * @property {string} Level - Level (e.g., '4y1')
   * @property {string} Status - Status
   * @property {string} DateCancelWithdraw - Date Cancel/Withdraw
   * @property {string} EnrollSubjects - Enrolled Subjects
   * @property {string} StudentGroup - Student Group
   * @property {string} Assessment - Assessment
   * @property {string} Scholarship - Scholarship
   * @property {string} Sponsorship - Sponsorship
   * @property {string} CreditMemo - Credit Memo
   * @property {string} Receipts - Receipts
   * @property {string} Refund - Refund
   * @property {string} Balance - Balance
   */

  /**
   *
   * @param {StudentRecord[]} students - user id
   * @returns {Promise<Student[]>} student with users data
   * @throws {NotFoundException}  student does not exists
   */
  static async bulkCreateStudent(students) {
    return sequelize.transaction(async (transaction) => {
      const studentRole = await DB.Role.findOne({
        where: {systemTag: 'student'},
        transaction
      });
      if (!studentRole) throw new NotFoundException('Role not found');

      const results = [];

      for (const newStudent of students) {
        // Normalize input keys and values
        const studentIdRaw = newStudent['Student ID'];
        if (!studentIdRaw) continue; // Skip if no student ID

        const studentId = Number(studentIdRaw.trim());
        if (isNaN(studentId)) continue; // Skip invalid ID

        const firstName = (newStudent['First Name'] || '').trim();
        const lastName = (newStudent['Last Name'] || '').trim();
        const gender = (newStudent['Gender'] || '').trim().toLowerCase();
        const programAcronym = (newStudent.Program || '').toLowerCase().trim();
        const birthdate = (newStudent['Birthdate'] || '').toLowerCase();

        if (
          !firstName ||
          !lastName ||
          !programAcronym ||
          !gender ||
          isNaN(studentId) ||
          studentId < 1000000000 ||
          studentId > 9999999999
        ) {
          continue;
        }
        const [day, month, year] = birthdate.split('/').map(Number);

        // Determine the full year: if the year is less than 30, assume it's 2000s; otherwise, it's 1900s
        const fullYear = year < 30 ? year + 2000 : year + 1900;

        // Format the date to YYYYMMDD
        const formattedDate = `${fullYear}${String(day).padStart(2, '0')}${String(month).padStart(2, '0')}`;

        // Find program once per student
        const program = await DB.Program.findOne({
          where: {acronym: programAcronym},
          transaction,
          include: [{model: DB.Department, as: 'department'}]
        });
        if (!program) throw new Error(`Failed to create users one the program is invalid: ${programAcronym}`);

        // Try to find student + user by student ID
        let student = await DB.Student.findByPk(studentId, {
          include: [{model: DB.User, as: 'user', required: true, paranoid: false}],
          transaction
        });
        const level = program.department.level;
        if (student) {
          // Update existing student and user
          student.level = level;
          student.sex = gender;
          student.programId = program.id;

          if (student.user) {
            student.user.firstName = firstName;
            student.user.lastName = lastName;
            student.user.deletedAt = null;

            const username = (lastName + '.' + String(studentId).slice(4)).toLowerCase();
            student.user.username = username;
            await student.user.save({transaction});
          }

          await student.save({transaction});
          results.push(student);
        } else {
          const username = (lastName + '.' + String(studentId).slice(4)).toLowerCase();

          const password = `${lastName.toLowerCase()}${formattedDate}`;

          const createdUser = await DB.User.create(
            {
              firstName,
              lastName,
              username,
              password,
              roleId: studentRole.id,
              student: {
                id: studentId,
                level: 'tertiary',
                sex: gender,
                programId: program.id,
                level
              }
            },
            {
              include: [{model: DB.Student, as: 'student'}],
              transaction
            }
          );

          results.push(createdUser.student);
        }
      }
      await ActivityLogService.createLog('A bulk create student used', `${results.length} students created`, 'user');

      return results;
    });
  }

  /**
   * @typedef GetAllStudentFilters
   * @property {string=} q Query by FullName, Username or Student ID
   */

  /**
   *
   * @param {GetAllStudentFilters} filters
   * @return {Promise<Student[]>}
   */
  static async getAllStudents(filters) {
    const where = {};

    if (filters.q) {
      const q = filters.q.trim();
      const isNumeric = /^\d+$/.test(q);

      where[Op.or] = [
        sequelize.where(sequelize.literal(`("user"."firstName" || ' ' || "user"."lastName")`), {[Op.iLike]: `%${q}%`}),
        {
          '$user.username$': {[Op.iLike]: `%${q}%`}
        }
      ];

      if (isNumeric) {
        where[Op.or].push(
          sequelize.where(sequelize.cast(sequelize.col('Students.id'), 'TEXT'), {[Op.iLike]: `%${q}%`})
        );
      }
    }

    return DB.Student.findAll({
      where,
      include: [
        {
          model: DB.User,
          as: 'user',
          required: false
        },
        {
          model: DB.Program,
          as: 'program'
        }
      ]
    });
  }
}
