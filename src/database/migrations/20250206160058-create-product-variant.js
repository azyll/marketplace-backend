"use strict";
/** @type {import('sequelize-cli').Migration} */
import Sequelize, { DataTypes } from "sequelize";

export async function up(queryInterface) {
  await queryInterface.createTable("ProductVariants", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: { type: DataTypes.STRING },
    size: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.DOUBLE,
    },
    stockQuantity: {
      type: DataTypes.INTEGER,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
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
}
export async function down(queryInterface) {
  await queryInterface.dropTable("ProductVariants");
}
