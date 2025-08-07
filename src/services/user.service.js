// @ts-check
import {DB} from '../database/index.js';
import {Op} from 'sequelize';
import {NotFoundException} from '../exceptions/notFound.js';

const {User, Role} = DB;

/**
 * @typedef {import ('../types/index.js').QueryParams} QueryParams
 * @typedef {import ('../types/index.js').PaginatedResponse<User>} UserResponse
 * @typedef {import ('../types/index.js').IUser} IUser
 */

const DEFAULT_FIELDS = ['id', 'firstName', 'lastName', 'email', 'createdAt', 'updatedAt', 'deletedAt'];
const role = {
  model: DB.Role,
  attributes: ['name', 'systemTag'],
  as: 'role'
};
export class UserService {
  /**
   * Get User
   * @param {string} userId
   * @returns {Promise<IUser | null>}
   */

  static async getUser(userId) {
    const user = await User.findOne({
      include: [
        {
          as: 'role',
          model: DB.Role
        },
        {
          as: 'student',
          model: DB.Student
        }
      ],
      where: {id: userId, deletedAt: {[Op.is]: null}}
    });

    if (!user) throw new NotFoundException('User not found', 404);

    return user;
  }

  //  @returns {Promise<{data: User[], meta: {totalItems: (count), itemsPerPage: (*|number), currentPage: (string|number)}}>}

  /**
   * Get All Users Details
   * @param {QueryParams} query
   * @returns {Promise<UserResponse>}
   */
  static async getUsers(query) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    // Offset  = skip read
    // page * limit
    // 1 *10, skip first 10
    // (page -1) we need first 10 in first page
    const {count, rows: usersData} = await User.findAndCountAll({
      distinct: true,
      include: role,
      where: {deletedAt: {[Op.is]: null}},
      limit,
      offset: limit * (page - 1)
    });

    return {
      data: usersData,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: count
      }
    };
  }

  /**
   * Add User
   * @param {any} data
   * @returns {Promise<Omit<any, "password">>}
   */
  static async addUser(data) {
    const {password, ...user} = (
      await User.create(data, {
        include: role
      })
    ).toJSON();

    return user;
  }

  /**
   * @typedef IUpdateUserInput
   * @property {string} firstName
   * @property {string} lastName
   * @property {string} email
   * @property {string} password
   * @property {string} roleId
   */

  /**
   * Update User Details
   * @param {string} userId
   * @param {IUpdateUserInput} data
   * @returns {Promise<IUser>}
   */
  static async updateUser(userId, data) {
    const {password, ...rest} = data;

    const result = await User.update(rest, {
      where: {
        id: userId
      },
      returning: DEFAULT_FIELDS
    });

    const count = result[0];
    const user = result[1][0];

    if (count <= 0) throw new NotFoundException('User not found', 404);

    return user;
  }

  /**
   * Archive User
   * @param {string} userId
   * @returns {Promise<IUser>}
   */
  static async archiveUser(userId) {
    const result = await User.update(
      {deletedAt: new Date()},
      {
        where: {
          id: userId,
          deletedAt: {
            [Op.is]: null
          }
        },
        returning: DEFAULT_FIELDS
      }
    );
    const count = result[0];
    const user = result[1][0];

    if (count <= 0) throw new NotFoundException('User not found', 404);

    return user;
  }

  /**
   * Restore Archived User
   * @param {string} userId
   * @returns {Promise<IUser>}
   */
  static async restoreUser(userId) {
    const result = await User.update(
      {deletedAt: null},
      {
        where: {
          id: userId,
          deletedAt: {[Op.ne]: null}
        },
        returning: DEFAULT_FIELDS
      }
    );
    const count = result[0];
    const user = result[1][0];

    if (count <= 0) throw new NotFoundException('User not found', 404);

    return user;
  }

  /**
   * Update User Password
   * @param {string} userId
   * @param {{oldPassword:string,newPassword:string}} data
   * @returns {Promise<IUser>}
   */
  static async updatePassword(userId, data) {
    const {oldPassword, newPassword} = data;

    const user = await User.scope('withPassword').findOne({
      where: {deletedAt: null, id: userId}
    });

    if (!user) throw new NotFoundException('User not found', 404);

    const isValid = user.authenticate(oldPassword);

    if (!isValid) throw new Error('Invalid Old Password');

    const result = await User.update(
      {password: newPassword},
      {
        where: {
          id: userId,
          deletedAt: {[Op.is]: null}
        },
        returning: DEFAULT_FIELDS,
        individualHooks: true
      }
    );

    const count = result[0];
    const updatedUser = result[1][0];

    if (count <= 0) throw new NotFoundException('User not found', 404);

    return updatedUser;
  }
}
