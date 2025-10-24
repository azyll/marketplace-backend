'use strict';
import {v4 as uuid} from 'uuid';
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {

  await queryInterface.bulkInsert('CarouselAnnouncementImages', [
    {
      id: uuid(),
      image: 'carousel/1761286815670-ryqf8k5hxy.png',
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date(2025, 5, 5)
    },
    {
      id: uuid(),
      image: 'carousel/1761286824499-zq1o0lludq.png',
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date(2025, 5, 5)
    },
    {
      id: uuid(),
      image: 'carousel/1761286820659-nuulsmr8q2o.png',
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date(2025, 5, 5)
    },
    {
      id: uuid(),
      image: 'carousel/1761286828486-d4lmmjczskq.png',
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date(2025, 5, 5)
    }
  ]);
}
export async function down(queryInterface, Sequelize) {
  /**
   * Add commands to revert seed here.
   *
   * Example:
   * await queryInterface.bulkDelete('People', null, {});
   */
  await queryInterface.bulkDelete('CarouselAnnouncementImages', null, {});
}

