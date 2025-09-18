//@ts-check

import {UserService} from './user.service.js';
import {NotFoundException} from '../exceptions/notFound.js';
import {DB} from '../database/index.js';
import {Op} from 'sequelize';
import {AlreadyExistException} from '../exceptions/alreadyExist.js';
import sequelize from '../database/config/sequelize.js';
import student from '../database/models/student.js';

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
   * @returns {Promise<Student>} student with users data
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

        if (!firstName || !lastName || !programAcronym) {
          // Skip incomplete data
          continue;
        }

        // Find program once per student
        const program = await DB.Program.findOne({
          where: {acronym: programAcronym},
          transaction
        });
        if (!program) throw new Error(`Program not found: ${programAcronym}`);

        // Try to find student + user by student ID
        let student = await DB.Student.findByPk(studentId, {
          include: [{model: DB.User, as: 'user'}],
          transaction
        });

        if (student) {
          // Update existing student and user
          student.level = 'tertiary';
          student.sex = gender;
          student.programId = program.id;

          if (student.user) {
            student.user.firstName = firstName;
            student.user.lastName = lastName;
            await student.user.save({transaction});
          }

          await student.save({transaction});
          results.push(student);
        } else {
          // Create new user + student in one go
          const username = (lastName + '.' + String(studentId).slice(4)).toLowerCase();

          // Note: NEVER store raw passwords like this in production!
          // Use proper hashing (e.g. bcrypt) and generate secure passwords or random tokens.
          const password = 'password';

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
                programId: program.id
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

      return results;
    });
  }
  static async getAllStudents() {
    return DB.Student.findAll({
      include: [
        {
          model: DB.User,
          as: 'user'
        },
        {
          model: DB.Program,
          as: 'program'
        }
      ]
    });
  }
}
