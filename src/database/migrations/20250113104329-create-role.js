import Sequelize, { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface) {
    await queryInterface.createTable("Roles", {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      systemTag: {
        type: DataTypes.ENUM,
        values: ["student", "admin", "employee"],
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("Roles");
  },
};
