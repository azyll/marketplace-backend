import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface) {
    await queryInterface.createTable("Students", {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
      },
      level: {
        type: DataTypes.ENUM,
        values: ["shs", "tertiary"],
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("Students");
  },
};
