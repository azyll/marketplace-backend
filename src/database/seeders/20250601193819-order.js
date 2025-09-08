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
  await DB.OrderLimit.findOrCreate({
    where: {
      id: 1
    },
    defaults: {
      limit: 1
    }
  });
}
export async function down(queryInterface, Sequelize) {
  /**
   * Add commands to revert seed here.
   *
   * Example:
   * await queryInterface.bulkDelete('People', null, {});
   */

  await queryInterface.bulkDelete('Sales', null, {});
  await queryInterface.bulkDelete('Orders', null, {});
  await queryInterface.bulkDelete('OrderItems', null, {});
}

