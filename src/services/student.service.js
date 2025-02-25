import { UserService } from "./user.service.js";
import { NotFoundException } from "../exceptions/notFound.js";
import { DB } from "../database/index.js";
import { Op } from "sequelize";

export class StudentService {
  /**
   * @typedef CreateStudentInput
   * @property {string} program
   * @property {string} level
   */

  /**
   * Create Student by UserId
   * @param userId
   * @param {CreateStudentInput} data
   */
  static async createStudent(userId, data) {
    const user = await UserService.getUser(userId);

    if (!user)
      throw new NotFoundException(`Can't get user with id of '${userId}'`, 404);

    const hasStudent = await this.getStudentByUserId(userId);

    if (hasStudent) throw new Error("Student already exists");

    return DB.Student.create({
      userId,
      ...data,
    });
  }

  static async getStudentByUserId(userId) {
    return await DB.Student.findOne({
      where: { userId, deletedAt: { [Op.is]: null } },
      include: [
        {
          model: DB.User,
          as: "user",
        },
      ],
    });
  }
}
