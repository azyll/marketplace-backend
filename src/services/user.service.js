import { DB } from "../database/index.js";
import { Op } from "sequelize";
import { NotFoundException } from "../exceptions/notFound.js";

const { User } = DB;

export class UserService {
  static async getUser(userId) {
    const user = await User.findOne({
      where: { id: userId, deletedAt: { [Op.is]: null } },
    });

    if (!user) throw new NotFoundException("User not found", 404);

    return user;
  }

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
    return User.create(data);
  }

  static async updateUser(userId, data) {
    const result = await User.update(data, {
      where: {
        id: userId,
      },
      returning: true,
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
        returning: true,
      },
    );
    const count = result[0];
    const user = result[1][0];

    if (count <= 0) throw new NotFoundException("User not found", 404);

    return user;
  }

  static async restoreUser(userId, data) {
    const result = await User.update(
      { deletedAt: null },
      {
        where: {
          id: userId,
          deletedAt: { [Op.ne]: null },
        },
        returning: true,
      },
    );
    const count = result[0];
    const user = result[1][0];

    if (count <= 0) throw new NotFoundException("User not found", 404);

    return user;
  }
}
