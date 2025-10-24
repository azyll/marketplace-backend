'use strict';
import {v4 as uuid} from 'uuid';
import {DB} from '../index.js';
import {Op} from 'sequelize';
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert(
    'Roles',
    [
      {
        id: uuid(),
        name: 'Student',
        systemTag: 'student',
        createdAt: new Date(2025, 5, 5),
        updatedAt: new Date()
      },
      {
        id: uuid(),
        name: 'Admin',
        systemTag: 'admin',
        createdAt: new Date(2025, 5, 5),
        updatedAt: new Date()
      },
      {
        id: uuid(),
        name: 'Proware Assistant',
        systemTag: 'employee',
        createdAt: new Date(2025, 5, 5),
        updatedAt: new Date()
      }
    ],
    {}
  );

  const prowareRoleId = await DB.Role.findOne({
    where: {systemTag: {[Op.eq]: 'employee'}}
  });

  await queryInterface.bulkInsert(
    'ModulePermissions',
    [
      {
        id: uuid(),
        module: 'users',
        permission: 'edit',
        roleId: prowareRoleId.id, // Admin role assigned to 'sales' edit permission
        createdAt: new Date(2025, 5, 5),
        updatedAt: new Date()
      },
      {
        id: uuid(),
        module: 'products',
        permission: 'edit',
        roleId: prowareRoleId.id, // Admin role assigned to 'sales' edit permission
        createdAt: new Date(2025, 5, 5),
        updatedAt: new Date()
      },
      {
        id: uuid(),
        module: 'sales',
        permission: 'edit',
        roleId: prowareRoleId.id, // Admin role assigned to 'sales' edit permission
        createdAt: new Date(2025, 5, 5),
        updatedAt: new Date()
      },
      {
        id: uuid(),
        module: 'orders',
        permission: 'edit',
        roleId: prowareRoleId.id, // Student role assigned to 'orders' edit permission
        createdAt: new Date(2025, 5, 5),
        updatedAt: new Date()
      },
      {
        id: uuid(),
        module: 'inventory',
        permission: 'edit',
        roleId: prowareRoleId.id, // Proware role assigned to 'inventory' edit permission
        createdAt: new Date(2025, 5, 5),
        updatedAt: new Date()
      },
      {
        id: uuid(),
        module: 'return-items',
        permission: 'edit',
        roleId: prowareRoleId.id, // Admin role assigned to 'return-items' edit permission
        createdAt: new Date(2025, 5, 5),
        updatedAt: new Date()
      }
    ],
    {}
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
  //     createdAt: new Date(2025,5,5),
  //     updatedAt: new Date(),
  //   },
  // ]);
}
export async function down(queryInterface, Sequelize) {
  /**
   * Add commands to revert seed here.
   *
   * Example:
   * await queryInterface.bulkDelete('People', null, {});
   */
  await queryInterface.bulkDelete('ModulePermissions', null, {});
  await queryInterface.bulkDelete('Roles', null, {});
}

