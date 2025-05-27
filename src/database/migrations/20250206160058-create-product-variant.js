"use strict";
/** @type {import('sequelize-cli').Migration} */
import Sequelize, { DataTypes } from "sequelize";

export async function up(queryInterface) {
  await queryInterface.createTable("ProductVariants", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
    },

    description: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.ENUM,
      values: ["top", "bottom", "accessory"],
    },
    category: {
      type: DataTypes.ENUM,
      values: ["uniform", "proware", "stationery accessory"],
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
}
export async function down(queryInterface) {
  await queryInterface.dropTable("ProductVariants");
}
