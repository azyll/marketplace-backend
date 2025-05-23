'use strict';
import {v4 as uuid} from 'uuid';

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

  await queryInterface.bulkInsert(
    'Roles',
    [
      {
        id: uuid(),
        name: 'Student',
        systemTag: 'student',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuid(),
        name: 'Admin',
        systemTag: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuid(),
        name: 'Employee',
        systemTag: 'employee',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    {}
  );

  // const studentUser = await DB.User.findOne({
  //   where: { email: { [Op.eq]: "alissa@test.com" } },
  // });
  //
  // await queryInterface.bulkInsert("Students", [
  //   {
  //     id: uuid(),
  //     userId: studentUser.id,
  //     program: "IT",
  //     level: "shs",
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   },
  // ]);
}
export async function down(queryInterface, Sequelize) {
  /**
   * Add commands to revert seed here.
   *
   * Example:
   * await queryInterface.bulkDelete('People', null, {});
   */

  await queryInterface.bulkDelete('Roles', null, {});
}

