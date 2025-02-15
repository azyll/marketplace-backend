"use strict";
/** @type {import('sequelize-cli').Migration} */
import Sequelize, { DataTypes } from "sequelize";

export async function up(queryInterface) {
  await queryInterface.createTable("Programs", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    },
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("Programs");
}
