'use strict';
import {v4 as uuid} from 'uuid';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert(
    'Programs',
    [
      {
        id: uuid(),
        name: 'Bachelor of Science in Computer Science',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuid(),
        name: 'Bachelor of Science in Information Technology',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuid(),
        name: 'Bachelor of Science in Hospitality Management',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuid(),
        name: 'Bachelor of Science in Tourism Management',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuid(),
        name: 'Bachelor of Arts in Communication',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    {}
  );
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('Programs', null, {});
}

