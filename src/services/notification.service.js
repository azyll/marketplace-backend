//@ts-check
import {Op, Transaction} from 'sequelize';
import sequelize from '../database/config/sequelize.js';
import {DB} from '../database/index.js';
import {NotFoundException} from '../exceptions/notFound.js';

const {Notification, NotificationReceiver, User, Student, Role, Program, Department} = DB;
export class NotificationService {
  /**
   *
   * @param {string} title
   * @param {string} message
   * @param {'order'|'sale'|'announcement'|'n/a'} type
   * @param {'all'|'employees'|'students'|'department students'|'individual'} audience
   * @param {{departmentId:string|null,userId:string|null}} receiver
   * @throws {NotFoundException} Department pass is not found
   */
  static async createNotification(title, message, type, audience, receiver) {
    const notificationTransaction = sequelize.transaction(async (transaction) => {
      const notification = await Notification.create({title, message, type, audience}, {transaction});
      switch (audience) {
        case 'employees':
          const employees = await User.findAll({
            include: [
              {
                model: Role,
                where: {
                  systemTag: 'employee'
                },
                as: 'role',
                required: true
              }
            ],
            transaction
          });

          for (const employee of employees) {
            await NotificationReceiver.create({notificationId: notification.id, userId: employee.id}, {transaction});
          }
          break;
        case 'students':
          const students = await User.findAll({
            include: [
              {
                model: Role,
                where: {
                  systemTag: 'student'
                },
                as: 'role',
                required: true
              }
            ],
            transaction
          });

          for (const student of students) {
            await NotificationReceiver.create({notificationId: notification.id, userId: student.id}, {transaction});
          }

          break;
        case 'department students':
          const department = await Department.findByPk(receiver.departmentId || '');
          if (!department) throw new NotFoundException('Department not found', 404);
          const studentsWithDepartment = await User.findAll({
            include: [
              {
                model: Role,
                where: {
                  systemTag: 'student'
                },
                as: 'role',
                required: true
              },
              {
                model: Student,
                include: [
                  {
                    model: Program,
                    include: [
                      {
                        model: Department,
                        where: {
                          id: receiver.departmentId
                        },
                        required: true
                      }
                    ],
                    required: true
                  }
                ],
                required: true,
                as: 'student'
              }
            ],
            transaction
          });
          for (const student of studentsWithDepartment) {
            await NotificationReceiver.create({notificationId: notification.id, userId: student.id}, {transaction});
          }
          break;
        case 'individual':
          await NotificationReceiver.create({notificationId: notification.id, userId: receiver.userId}, {transaction});
          break;
        case 'all':
          await NotificationReceiver.create({notificationId: notification.id, userId: null}, {transaction});
          break;
      }
      return notification;
    });
    return notificationTransaction;
  }

  /**
   *
   * @param {string} notificationId
   * @param {Transaction} transaction
   */
  static async createNotificationStudents(notificationId, transaction) {}
  /**
   *
   * @param {string} notificationId
   * @param {Transaction} transaction
   * @param {string} departmentId
   */
  static async createNotificationDepartment(notificationId, transaction, departmentId) {
    const department = await Department.findByPk(departmentId);
    if (!department) throw new NotFoundException('Department not found', 404);
    const studentsWithDepartment = await User.findAll({
      include: [
        {
          model: Role,
          where: {
            systemTag: 'student'
          },
          as: 'role',
          required: true
        },
        {
          model: Student,
          include: [
            {
              model: Program,
              include: [
                {
                  model: Department,
                  where: {
                    id: departmentId
                  },
                  required: true
                }
              ],
              required: true
            }
          ],
          required: true,
          as: 'student'
        }
      ],
      transaction
    });
    for (const student of studentsWithDepartment) {
      await NotificationReceiver.create({notificationId, userId: student.id}, {transaction});
    }
  }
  /**
   * @param {string} notificationId
   * @param {Transaction} transaction
   */
  static async createNotificationEmployees(notificationId, transaction) {
    const employees = await User.findAll({
      include: [
        {
          model: Role,
          where: {
            systemTag: 'employee'
          },
          as: 'role',
          required: true
        }
      ],
      transaction
    });

    for (const employee of employees) {
      await NotificationReceiver.create({notificationId, userId: employee.id}, {transaction});
    }
  }

  /**
   *
   * @param {string} userId
   * @throws {NotFoundException}  User not found
   * @returns
   */
  static async getNotifications(userId) {
    const user = await User.findByPk(userId);

    if (!user) throw new NotFoundException('User not found', 404);

    const notifications = await Notification.findAll({
      include: [
        {
          model: NotificationReceiver,
          where: {
            [Op.or]: [{userId: null}, {userId}]
          },
          include: [User]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    return notifications;
  }
}
