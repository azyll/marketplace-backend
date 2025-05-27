/** @type {import('sequelize-cli').Migration} */
import Sequelize, { DataTypes } from "sequelize";

export async function up(queryInterface) {
  await queryInterface.createTable("Sales", {
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
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM,
      values: ["top", "bottom", "accessory", "miscellaneous"],
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
  await queryInterface.dropTable("Sales");
}
