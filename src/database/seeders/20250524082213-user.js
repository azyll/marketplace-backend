'use strict';
//@ts-check
import bcrypt from 'bcrypt';
import {Op} from 'sequelize';
import {DB} from '../index.js';
import {v4 as uuid} from 'uuid';
import {ModulePermissionService} from '../../services/module-permission.service.js';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add seed commands here.
   *
   * Example:
   * await queryInterface.bulkInsert('People', [{
   *   name: 'John Doe',
   *   isBetaMember: false
   * }], {});
   */
  const password = bcrypt.hashSync('password', 12);

  const studentRole = await DB.Role.findOne({
    where: {systemTag: {[Op.eq]: 'student'}}
  });

  const adminRole = await DB.Role.findOne({
    where: {systemTag: {[Op.eq]: 'admin'}}
  });

  const employeeRole = await DB.Role.findOne({
    where: {systemTag: {[Op.eq]: 'employee'}}
  });

  const users = await DB.User.bulkCreate([
    {
      id: uuid(),
      firstName: 'Alissa',
      lastName: 'User',
      email: 'alissa@test.com',
      password,
      createdAt: new Date(),
      updatedAt: new Date(),
      roleId: studentRole.id
    },
    {
      id: uuid(),
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@test.com',
      password,
      createdAt: new Date(),
      updatedAt: new Date(),
      roleId: adminRole.id
    },
    {
      id: uuid(),
      firstName: 'Employee',
      lastName: 'User',
      email: 'employeeg@test.com',
      password,
      createdAt: new Date(),
      updatedAt: new Date(),
      roleId: employeeRole.id
    },
    {
      id: uuid(),
      firstName: 'Ken Andrew',
      lastName: 'User Student',
      email: 'kenandrew@test.com',
      password,
      createdAt: new Date(),
      updatedAt: new Date(),
      roleId: studentRole.id
    }
  ]);

  await ModulePermissionService.createModulePermission(users[2].id, 'inventory', 'edit');
  await ModulePermissionService.createModulePermission(users[2].id, 'orders', 'edit');
  await ModulePermissionService.createModulePermission(users[2].id, 'sales', 'edit');

  const programs = await DB.Program.findAll();
  await queryInterface.bulkInsert(
    'Students',
    [
      {
        id: 2000309926,
        userId: users[3].id,
        level: 'tertiary',
        sex: 'male',
        createdAt: new Date(),
        updatedAt: new Date(),
        programId: programs[0].id
      },
      {
        id: 2000309921,
        userId: users[0].id,
        level: 'tertiary',
        sex: 'female',
        createdAt: new Date(),
        updatedAt: new Date(),
        programId: programs[0].id
      }
    ],
    {}
  );
  const studentUsers = [];

  for (let i = 0; i < 10; i++) {
    const maleUser = {
      id: uuid(),
      firstName: `MaleStudent${i + 1}`,
      lastName: 'User',
      email: `malestudent${i + 1}@test.com`,
      password,
      createdAt: new Date(),
      updatedAt: new Date(),
      roleId: studentRole.id
    };

    const femaleUser = {
      id: uuid(),
      firstName: `FemaleStudent${i + 1}`,
      lastName: 'User',
      email: `femalestudent${i + 1}@test.com`,
      password,
      createdAt: new Date(),
      updatedAt: new Date(),
      roleId: studentRole.id
    };

    studentUsers.push(maleUser, femaleUser);
  }

  const otherStudentUsers = await DB.User.bulkCreate(studentUsers);

  // Create 20 corresponding student records
  const studentRecords = [];

  for (let i = 0; i < 10; i++) {
    const programId = programs[i].id;

    studentRecords.push(
      {
        id: 2000309900 + i * 2 + 0,
        userId: otherStudentUsers[i * 2].id, // Male
        level: i <= 6 ? 'tertiary' : 'shs',
        sex: 'male',
        createdAt: new Date(),
        updatedAt: new Date(),
        programId
      },
      {
        id: 2000309900 + i * 2 + 1,
        userId: otherStudentUsers[i * 2 + 1].id, // Female
        level: i <= 6 ? 'tertiary' : 'shs',
        sex: 'female',
        createdAt: new Date(),
        updatedAt: new Date(),
        programId
      }
    );
  }
  await queryInterface.bulkInsert('Students', studentRecords, {});
}
export async function down(queryInterface, Sequelize) {
  /**
   * Add commands to revert seed here.
   *
   * Example:
   * await queryInterface.bulkDelete('People', null, {});
   */
  await queryInterface.bulkDelete('Users', null, {});
  await queryInterface.bulkDelete('Students', null, {});
}

