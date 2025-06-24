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

  const program = await DB.Program.findOne({
    where: {
      name: {[Op.eq]: 'Bachelor of Science in Information Technology'}
    }
  });
  await queryInterface.bulkInsert(
    'Students',
    [
      {
        id: 2000309926,
        userId: users[3].id,
        level: 'tertiary',
        createdAt: new Date(),
        updatedAt: new Date(),
        programId: program.id
      },
      {
        id: 2000309921,
        userId: users[0].id,
        level: 'tertiary',
        createdAt: new Date(),
        updatedAt: new Date(),
        programId: program.id
      }
    ],
    {}
  );
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

