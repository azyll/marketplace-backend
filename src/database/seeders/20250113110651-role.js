import { v4 as uuid } from "uuid";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Roles",
      [
        {
          id: uuid(),
          name: "Student",
          systemTag: "student",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuid(),
          name: "Admin",
          systemTag: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuid(),
          name: "Employee",
          systemTag: "employee",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
