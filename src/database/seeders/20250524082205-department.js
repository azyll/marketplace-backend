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
      name: 'Information & Communications Technology',
      level: 'tertiary',
      acronym: 'ict'
    },
    {
      name: 'Business & Management',
      level: 'tertiary',
      acronym: 'bm'
    },
    {
      name: 'Hospitality Management',
      level: 'tertiary',
      acronym: 'hm'
    },
    {
      name: 'Tourism Management',
      level: 'tertiary',
      acronym: 'tm'
    },
    {
      name: 'Arts & Sciences',
      level: 'tertiary',
      acronym: 'a&s'
    },
    {
      name: 'Senior High School',
      level: 'shs',
      acronym: 'shs'
    },
    {
      name: 'Proware',
      level: 'all',
      acronym: 'proware'
    }
  ]);

  await queryInterface.bulkInsert(
    'Programs',
    [
      {
        id: uuid(),
        name: 'Bachelor of Science in Information Technology',
        acronym: 'bsit',
        createdAt: new Date(2025, 5, 5),
        updatedAt: new Date(),
        departmentId: departments[0].id
      },
      {
        id: uuid(),
        name: 'Bachelor of Science in Computer Science',
        acronym: 'bscs',
        createdAt: new Date(2025, 5, 5),
        updatedAt: new Date(),
        departmentId: departments[0].id
      },
      {
        id: uuid(),
        name: 'Bachelor of Science in Computer Engineering',
        acronym: 'bscpe',
        createdAt: new Date(2025, 5, 5),
        updatedAt: new Date(),
        departmentId: departments[0].id
      },
      {
        id: uuid(),
        name: 'Bachelor of Science in Business Administration',
        acronym: 'bsba',
        createdAt: new Date(2025, 5, 5),
        updatedAt: new Date(),
        departmentId: departments[1].id
      },
      {
        id: uuid(),
        name: 'Bachelor of Science in Hospitality Management',
        acronym: 'bshm',
        createdAt: new Date(2025, 5, 5),
        updatedAt: new Date(),
        departmentId: departments[2].id
      },
      {
        id: uuid(),
        name: 'Bachelor of Science in Tourism Management',
        acronym: 'bstm',
        createdAt: new Date(2025, 5, 5),
        updatedAt: new Date(),
        departmentId: departments[3].id
      },
      {
        id: uuid(),
        name: 'Bachelor of Arts in Communication',
        acronym: 'bacomm',
        createdAt: new Date(2025, 5, 5),
        updatedAt: new Date(),
        departmentId: departments[4].id
      },
      {
        id: uuid(),
        name: 'IT In Mobile app and Web Development',
        acronym: 'ict',
        createdAt: new Date(2025, 5, 5),
        updatedAt: new Date(),
        departmentId: departments[5].id
      },
      {
        id: uuid(),
        name: 'Science, Technology, Engineering, and Mathematics',
        acronym: 'stem',
        createdAt: new Date(2025, 5, 5),
        updatedAt: new Date(),
        departmentId: departments[5].id
      },
      {
        id: uuid(),
        name: 'Accountancy, Business, and Management',
        acronym: 'abm',
        createdAt: new Date(2025, 5, 5),
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

