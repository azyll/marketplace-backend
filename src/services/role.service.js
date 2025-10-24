//@ts-check
import {Op} from 'sequelize';
import {DB} from '../database/index.js';
import {AlreadyExistException} from '../exceptions/alreadyExist.js';
import {NotFoundException} from '../exceptions/notFound.js';
const {Role} = DB;
export class RoleService {
  /**
   * Create a new role with module permissions
   * @param {{name:string, systemTag: "student" | "admin" | "employee", modulePermission: {module: string, permission: "view" | "edit"}[]}} roleData
   * @returns {Promise<Role>}
   */
  static async createRole(roleData) {
    const {name, systemTag, modulePermission} = roleData;

    const findRole = await DB.Role.findOne({
      where: {systemTag}
    });
    if (findRole && systemTag !== 'employee') {
      throw new AlreadyExistException('A role has already been assigned to this tag. Please use the existing role.');
    }

    // First, check if the role already exists
    const [role, isNewItem] = await DB.Role.findOrCreate({
      where: {name, systemTag},
      defaults: {name, systemTag}
    });

    if (!isNewItem) {
      throw new AlreadyExistException('Role with the same name and systemTag already exists', 409);
    }

    // After creating the role, create associated module permissions
    if (modulePermission && modulePermission.length > 0) {
      // Prepare the permissions to be inserted in the ModulePermission table

      const permissionsToCreate = modulePermission.map((perm) => ({
        roleId: role.id,
        module: perm.module,
        permission: perm.permission
      }));

      // Insert the permissions into the ModulePermission table
      await DB.ModulePermission.bulkCreate([
        ...permissionsToCreate,
        {
          roleId: role.id,
          module: 'users',
          permission: 'edit'
        }
      ]);
    }

    return role;
  }

  /**
   * Delete program
   * @throws {NotFoundException}
   * @param {string} roleId
   */
  static async archiveRole(roleId) {
    const role = await DB.Role.findByPk(roleId);

    if (!role) throw new NotFoundException('Role not found');

    const user = await DB.User.findOne({
      where: {
        roleId,
        deletedAt: {
          [Op.eq]: null
        }
      }
    });

    if (user) throw new Error('You cannot archive program due to it have a active under under it');
    return await role.destroy();
  }

  /**
   * Delete program
   * @throws {NotFoundException}
   * @param {string} roleId
   */
  static async restoreRole(roleId) {
    const role = await DB.Role.findByPk(roleId, {
      paranoid: false
    });

    if (!role) throw new NotFoundException('Role not found');
    console.log(role);
    return await role.restore();
  }

  /**
   * Get all program
   */
  static async getRoles(query) {
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;
    const whereClause = {};
    if (query.search) {
      const searchTerm = query.search.trim();

      whereClause[Op.or] = [{name: {[Op.iLike]: `%${searchTerm}%`}}];
    }

    let isAll = true;

    if (query.all === 'true') {
      isAll = true;
    } else if (query.all === 'false') {
      isAll = false;
    }
    if (query.status === 'archived') {
      whereClause.deletedAt = {
        [Op.not]: null
      };
    } else if (query.status === 'active') {
      whereClause.deletedAt = {
        [Op.is]: null
      };
    }
    const roles = await Role.findAndCountAll({
      where: whereClause,
      paranoid: !isAll,
      offset: (page - 1) * limit,
      include: [
        {
          model: DB.ModulePermission,
          as: 'modulePermission'
        }
      ],
      distinct: true,
      limit,

      order: [['name', 'ASC']]
    });
    return {
      data: roles.rows,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: roles.count
      }
    };
  }

  /**
   * Get role
   * @param {'employee'|'admin'|'student'} systemTag
   */
  static async getRole(systemTag) {
    const role = await Role.findOne({
      where: {
        systemTag
      }
    });
    return role;
  }

  /**
   * Get role
   * @param {string} id
   */
  static async getRoleById(id) {
    const role = await Role.findByPk(id, {
      include: [
        {
          model: DB.ModulePermission,
          as: 'modulePermission'
        }
      ]
    });
    if (!role) throw new Error('Role not found');
    return role;
  }
  /**
   * Update program
   * @param {string} roleId
   * @param {object} newRole
   * @throws {NotFoundException}
   * @throws {AlreadyExistException}
   */
  static async updateRole(roleId, newRole) {
    // Fetch the role along with its current module permissions
    const role = await DB.Role.findByPk(roleId, {
      include: [
        {
          model: DB.ModulePermission,
          as: 'modulePermission'
        }
      ]
    });

    if (!role) throw new NotFoundException('Role not found');

    // Update role details like name and systemTag
    role.name = newRole.name ?? role.name;
    role.systemTag = newRole.systemTag ?? role.systemTag;

    // Retrieve current modules assigned to this role
    const currentPermissions = role.modulePermission.map((perm) => perm.module);

    // Get the new set of modules and permissions from newRole
    const newPermissions = newRole.modulePermission ?? [];

    // First, remove any modules that are no longer included in the updated role
    const modulesToRemove = currentPermissions.filter(
      (module) => !newPermissions.some((newPerm) => newPerm.module === module)
    );

    if (modulesToRemove.length > 0) {
      await DB.ModulePermission.destroy({
        where: {
          roleId: roleId,
          module: [...modulesToRemove, 'users']
        }
      });
    }

    // Now, add or update the permissions for the new modules
    const newModulePermissions = newPermissions.map((perm) => ({
      roleId: roleId,
      module: perm.module,
      permission: perm.permission
    }));

    // For each permission in newPermissions, check if it already exists
    for (const newPerm of newModulePermissions) {
      const existingPermission = await DB.ModulePermission.findOne({
        where: {
          roleId: roleId,
          module: newPerm.module
        }
      });

      if (existingPermission) {
        // If the permission exists, update it
        if (existingPermission.permission !== newPerm.permission) {
          await existingPermission.update({permission: newPerm.permission});
        }
      } else {
        // If the permission doesn't exist, create it
        await DB.ModulePermission.create(newPerm);
      }
    }

    // Finally, update the role details in the database (name and systemTag)
    return await role.update({
      name: role.name,
      systemTag: role.systemTag
    });
  }
}

