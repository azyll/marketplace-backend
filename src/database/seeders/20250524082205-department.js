'use strict';
import {v4 as uuid} from 'uuid';
import {DB} from '../index.js';
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

  const departments = await DB.Department.bulkCreate([
    {
      name: 'Information and Communication Technology',
      level: 'tertiary'
    },
    {
      name: 'Business & Management',
      level: 'tertiary'
    },
    {
      name: 'Hospitality Management',
      level: 'tertiary'
    },
    {
      name: 'Tourism Management',
      level: 'tertiary'
    },
    {
      name: 'Arts & Sciences',
      level: 'tertiary'
    },
    {
      name: 'Senior High School',
      level: 'shs'
    },
    {
      name: 'Proware',
      level: 'all'
    },
    {
      name: 'Tertiary',
      level: 'tertiary'
    }
  ]);

  await queryInterface.bulkInsert(
    'Programs',
    [
      {
        id: uuid(),
        name: 'Bachelor of Science in Information Technology',
        createdAt: new Date(),
        updatedAt: new Date(),
        departmentId: departments[0].id
      },
      {
        id: uuid(),
        name: 'Bachelor of Science in Computer Science',
        createdAt: new Date(),
        updatedAt: new Date(),
        departmentId: departments[0].id
      },
      {
        id: uuid(),
        name: 'Bachelor of Science in Computer Engineering',
        createdAt: new Date(),
        updatedAt: new Date(),
        departmentId: departments[0].id
      },
      {
        id: uuid(),
        name: 'Bachelor of Science in Business Administration',
        createdAt: new Date(),
        updatedAt: new Date(),
        departmentId: departments[1].id
      },
      {
        id: uuid(),
        name: 'Bachelor of Science in Hospitality Management',
        createdAt: new Date(),
        updatedAt: new Date(),
        departmentId: departments[2].id
      },
      {
        id: uuid(),
        name: 'Bachelor of Science in Tourism Management',
        createdAt: new Date(),
        updatedAt: new Date(),
        departmentId: departments[3].id
      },
      {
        id: uuid(),
        name: 'Bachelor of Arts in Communication',
        createdAt: new Date(),
        updatedAt: new Date(),
        departmentId: departments[4].id
      },
      {
        id: uuid(),
        name: 'IT In Mobile app and Web Development',
        createdAt: new Date(),
        updatedAt: new Date(),
        departmentId: departments[5].id
      },
      {
        id: uuid(),
        name: 'Science, Technology, Engineering, and Mathematics',
        createdAt: new Date(),
        updatedAt: new Date(),
        departmentId: departments[5].id
      },
      {
        id: uuid(),
        name: 'Accountancy, Business, and Management',
        createdAt: new Date(),
        updatedAt: new Date(),
        departmentId: departments[5].id
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
  await queryInterface.bulkDelete('Programs', null, {});
  await queryInterface.bulkDelete('Departments', null, {});
}

