"use strict";
/** @type {import('sequelize-cli').Migration} */
import Sequelize, { DataTypes } from "sequelize";

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("ActivityLogs", {
    title: {
      type: DataTypes.STRING,
    },
    content: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.ENUM,
      values: ["SALES", "Admin", "asd"],
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      schema: Joi.date().allow(null),
    },
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("ActivityLogs");
}
