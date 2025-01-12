import bcrypt from "bcrypt";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    const password = bcrypt.hashSync("password", 12);

    await queryInterface.bulkInsert(
      "Users",
      [
        {
          firstName: "John",
          lastName: "Doe",
          email: "john@doe.com",
          password,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Johns",
          lastName: "Does",
          email: "john@does.com",
          password,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
