import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { DB } from "../index.js";
import { v4 as uuid } from "uuid";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    const password = bcrypt.hashSync("password", 12);

    const studentRole = await DB.Role.findOne({
      where: { systemTag: { [Op.eq]: "student" } },
    });

    const adminRole = await DB.Role.findOne({
      where: { systemTag: { [Op.eq]: "admin" } },
    });

    const employeeRole = await DB.Role.findOne({
      where: { systemTag: { [Op.eq]: "employee" } },
    });

    await queryInterface.bulkInsert(
      "Users",
      [
        {
          id: uuid(),
          firstName: "Alissa",
          lastName: "User",
          email: "alissa@test.com",
          password,
          createdAt: new Date(),
          updatedAt: new Date(),
          roleId: studentRole.id,
        },
        {
          id: uuid(),
          firstName: "Admin",
          lastName: "User",
          email: "admin@test.com",
          password,
          createdAt: new Date(),
          updatedAt: new Date(),
          roleId: adminRole.id,
        },
        {
          id: uuid(),
          firstName: "Employee",
          lastName: "User",
          email: "employeeg@test.com",
          password,
          createdAt: new Date(),
          updatedAt: new Date(),
          roleId: employeeRole.id,
        },
      ],
      {},
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
