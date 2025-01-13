import { DB } from "../database/index.js";
import { Op } from "sequelize";
import { NotFoundException } from "../exceptions/notFound.js";

const { User } = DB;

const DEFAULT_FIELDS = [
  "id",
  "firstName",
  "lastName",
  "email",
  "createdAt",
  "updatedAt",
  "deletedAt",
];

export class UserService {
  static async getUser(userId) {
    const user = await User.findOne({
      where: { id: userId, deletedAt: { [Op.is]: null } },
    });

    if (!user) throw new NotFoundException("User not found", 404);

    return user;
  }

  /**
   * Get All Users Details
   * @param query
   * @returns {Promise<{data: User[], meta: {totalItems: (count), itemsPerPage: (*|number), currentPage: (string|number)}}>}
   */
  static async getUsers(query) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const users = User.findAndCountAll({
      where: { deletedAt: { [Op.is]: null } },
      limit,
      offset: limit * (page - 1),
    });

    return {
      data: (await users).rows,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: (await users).count,
      },
    };
  }

  static async addUser(data) {
    const { password, ...user } = (await User.create(data)).toJSON();

    return user;
  }

  /**
   * Update User Details
   * @param {string} userId
   * @param {object} data
   * @returns {Promise<User>}
   */
  static async updateUser(userId, data) {
    const { password, ...rest } = data;

    const result = await User.scope("withoutPassword").update(rest, {
      where: {
        id: userId,
      },
      returning: DEFAULT_FIELDS,
    });

    const count = result[0];
    const user = result[1][0];

    if (count <= 0) throw new NotFoundException("User not found", 404);

    return user;
  }

  static async archiveUser(userId) {
    const result = await User.update(
      { deletedAt: new Date() },
      {
        where: {
          id: userId,
        },
        returning: DEFAULT_FIELDS,
      },
    );
    const count = result[0];
    const user = result[1][0];

    if (count <= 0) throw new NotFoundException("User not found", 404);

    return user;
  }

  static async restoreUser(userId) {
    const result = await User.update(
      { deletedAt: null },
      {
        where: {
          id: userId,
          deletedAt: { [Op.ne]: null },
        },
        returning: DEFAULT_FIELDS,
      },
    );
    const count = result[0];
    const user = result[1][0];

    if (count <= 0) throw new NotFoundException("User not found", 404);

    return user;
  }

  /**
   * Update User Password
   * @param {string} userId
   * @param {object} data
   * @returns {Promise<User>}
   */
  static async updatePassword(userId, data) {
    const { oldPassword, newPassword } = data;

    const user = await User.scope("withPassword").findOne({
      where: { deletedAt: null, id: userId },
    });

    if (!user) throw new NotFoundException("User not found", 404);

    const isValid = user.authenticate(oldPassword);

    if (!isValid) throw new Error("Invalid Old Password");

    const result = await User.update(
      { password: newPassword },
      {
        where: {
          id: userId,
          deletedAt: { [Op.is]: null },
        },
        returning: DEFAULT_FIELDS,
        individualHooks: true,
      },
    );

    const count = result[0];
    const updatedUser = result[1][0];

    if (count <= 0) throw new NotFoundException("User not found", 404);

    return updatedUser;
  }
}
