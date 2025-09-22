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
      lastName: 'Peralta',
      username: 'alissa.232375',
      password,
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date(),
      roleId: studentRole.id
    },
    {
      id: uuid(),
      firstName: 'Admin',
      lastName: 'User',
      username: 'admin',
      password,
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date(),
      roleId: adminRole.id
    },
    {
      id: uuid(),
      firstName: 'Kimberly',
      lastName: 'Mangulabnan',
      username: 'proware',
      password,
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date(),
      roleId: employeeRole.id
    },
    {
      id: uuid(),
      firstName: 'Ken',
      lastName: 'Carlon',
      username: 'carlon.309926',
      password,
      createdAt: new Date(2025, 5, 5),
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
        createdAt: new Date(2025, 5, 5),
        updatedAt: new Date(),
        programId: programs[0].id
      },
      {
        id: 2000232375,
        userId: users[0].id,
        level: 'tertiary',
        sex: 'female',
        createdAt: new Date(2025, 5, 5),
        updatedAt: new Date(),
        programId: programs[0].id
      }
    ],
    {}
  );
  // await DB.User.bulkCreate(
  //   [
  //     {
  //       id: uuid(),
  //       firstName: 'Kyan Ray',
  //       lastName: 'Villarin',
  //       username: 'villarin@test.com',
  //       password,
  //       createdAt: new Date(2025, 5, 5),
  //       updatedAt: new Date(),
  //       roleId: studentRole.id,
  //       student: {
  //         id: 200030923,

  //         level: 'tertiary',
  //         sex: 'female',
  //         createdAt: new Date(2025, 5, 5),
  //         updatedAt: new Date(),
  //         programId: programs[1].id
  //       }
  //     },
  //     {
  //       id: uuid(),
  //       firstName: 'Enzo',
  //       lastName: 'Daniela',
  //       username: 'daniela@test.com',
  //       password,
  //       createdAt: new Date(2025, 5, 5),
  //       updatedAt: new Date(),
  //       roleId: studentRole.id,
  //       student: {
  //         id: 2000309232,

  //         level: 'tertiary',
  //         sex: 'male',
  //         createdAt: new Date(2025, 5, 5),
  //         updatedAt: new Date(),
  //         programId: programs[2].id
  //       }
  //     },
  //     {
  //       id: uuid(),
  //       firstName: 'Clarence',
  //       lastName: 'Lastimoso',
  //       username: 'lastimoso@test.com',
  //       password,
  //       createdAt: new Date(2025, 5, 5),
  //       updatedAt: new Date(),
  //       roleId: studentRole.id,
  //       student: {
  //         id: 2000309231,

  //         level: 'tertiary',
  //         sex: 'male',
  //         createdAt: new Date(2025, 5, 5),
  //         updatedAt: new Date(),
  //         programId: programs[3].id
  //       }
  //     },
  //     {
  //       id: uuid(),
  //       firstName: 'Jan Latrell',
  //       lastName: 'Arquillo',
  //       username: 'arquillo@test.com',
  //       password,
  //       createdAt: new Date(2025, 5, 5),
  //       updatedAt: new Date(),
  //       roleId: studentRole.id,
  //       student: {
  //         id: 2000309233,

  //         level: 'tertiary',
  //         sex: 'male',
  //         createdAt: new Date(2025, 5, 5),
  //         updatedAt: new Date(),
  //         programId: programs[4].id
  //       }
  //     },
  //     {
  //       id: uuid(),
  //       firstName: 'King Gio',
  //       lastName: 'Visoria',
  //       username: 'visoria@test.com',
  //       password,
  //       createdAt: new Date(2025, 5, 5),
  //       updatedAt: new Date(),
  //       roleId: studentRole.id,
  //       student: {
  //         id: 2000309234,

  //         level: 'tertiary',
  //         sex: 'male',
  //         createdAt: new Date(2025, 5, 5),
  //         updatedAt: new Date(),
  //         programId: programs[1].id
  //       }
  //     },
  //     {
  //       id: uuid(),
  //       firstName: 'Asher Joseph',
  //       lastName: 'Balatucan',
  //       username: 'balatucan@test.com',
  //       password,
  //       createdAt: new Date(2025, 5, 5),
  //       updatedAt: new Date(),
  //       roleId: studentRole.id,
  //       student: {
  //         id: 2000309235,
  //         level: 'tertiary',
  //         sex: 'male',
  //         createdAt: new Date(2025, 5, 5),
  //         updatedAt: new Date(),
  //         programId: programs[5].id
  //       }
  //     },
  //     {
  //       id: uuid(),
  //       firstName: 'Jun Gin Joseph',
  //       lastName: 'De Jose',
  //       username: 'dejose@test.com',
  //       password,
  //       createdAt: new Date(2025, 5, 5),
  //       updatedAt: new Date(),
  //       roleId: studentRole.id,
  //       student: {
  //         id: 2000309236,
  //         level: 'tertiary',
  //         sex: 'male',
  //         createdAt: new Date(2025, 5, 5),
  //         updatedAt: new Date(),
  //         programId: programs[6].id
  //       }
  //     },
  //     {
  //       id: uuid(),
  //       firstName: 'Sean Russel',
  //       lastName: 'Villaranda',
  //       username: 'villaranda@test.com',
  //       password,
  //       createdAt: new Date(2025, 5, 5),
  //       updatedAt: new Date(),
  //       roleId: studentRole.id,
  //       student: {
  //         id: 2000309237,
  //         level: 'shs',
  //         sex: 'male',
  //         createdAt: new Date(2025, 5, 5),
  //         updatedAt: new Date(),
  //         programId: programs[7].id
  //       }
  //     },
  //     {
  //       id: uuid(),
  //       firstName: 'Juna Mae',
  //       lastName: 'Emillio',
  //       username: 'emillo@test.com',
  //       password,
  //       createdAt: new Date(2025, 5, 5),
  //       updatedAt: new Date(),
  //       roleId: studentRole.id,
  //       student: {
  //         id: 2000309238,
  //         level: 'tertiary',
  //         sex: 'female',
  //         createdAt: new Date(2025, 5, 5),
  //         updatedAt: new Date(),
  //         programId: programs[5].id
  //       }
  //     }
  //   ],
  //   {
  //     include: [
  //       {
  //         model: DB.Student,
  //         as: 'student'
  //       }
  //     ]
  //   }
  // );
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

