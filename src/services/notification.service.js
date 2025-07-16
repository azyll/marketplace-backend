//@ts-check
import {Op, Transaction} from 'sequelize';
import sequelize from '../database/config/sequelize.js';
import {DB} from '../database/index.js';
import {NotFoundException} from '../exceptions/notFound.js';

/**
 * @typedef {import ('../types/index.js').QueryParams} QueryParams
 */
const {Notification, NotificationReceiver, User, Student, Role, Program, Department, Cart} = DB;
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
      const notification = await Notification.create({title, message, type}, {transaction});
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
                    as: 'program',
                    include: [
                      {
                        model: Department,
                        as: 'department',
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
   * @param {string} title
   * @param {string} message
   * @param {string} productVariantId
   */
  static async createNotificationForInventoryStockUpdate(title, message, productVariantId) {
    const notificationTransaction = sequelize.transaction(async (transaction) => {
      const notification = await Notification.create(
        {title, message, type: 'announcement', audience: 'students'},
        {transaction}
      );

      const studentsHaveProductVariantInCart = await Student.findAll({
        include: [
          {
            model: Cart,
            as: 'cart',
            where: {
              productVariantId
            }
          },
          {
            model: User,
            as: 'user'
          }
        ]
      });

      if (!studentsHaveProductVariantInCart) {
        return notification;
      }
      for (const student of studentsHaveProductVariantInCart) {
        await NotificationReceiver.create({notificationId: notification.id, userId: student.user.id}, {transaction});
      }
    });

    return notificationTransaction;
  }

  /**
   *
   * @param {string} userId
   * @param { QueryParams & {}} query
   * @throws {NotFoundException}  User not found
   * @returns
   */
  static async getNotifications(userId, query) {
    const user = await User.findByPk(userId);

    if (!user) throw new NotFoundException('User not found', 404);

    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;

    const {count, rows: notifications} = await Notification.findAndCountAll({
      include: [
        {
          model: NotificationReceiver,
          as: 'notificationReceiver',
          where: {
            [Op.or]: [{userId: null}, {userId}]
          },
          include: [{model: User, as: 'user'}]
        }
      ],
      order: [['createdAt', 'DESC']],
      distinct: true,

      limit,
      offset: (page - 1) * limit
    });

    const {count: unread} = await Notification.findAndCountAll({
      include: [
        {
          model: NotificationReceiver,
          as: 'notificationReceiver',
          where: {
            [Op.or]: [{userId: null}, {userId}],
            isRead: false
          }
        }
      ],

      distinct: true
    });
    return {
      data: notifications,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: count,
        unread: unread
      }
    };
  }

  /**
   *
   * @param {string} userId
   * @param {string| undefined} notificationId
   * @param {boolean} isAll
   */

  static async updateNotificationAsRead(userId, notificationId, isAll = false) {
    const user = await User.findByPk(userId);
    if (!user) throw new NotFoundException('User not found', 404);

    if (isAll) {
      return await NotificationReceiver.update(
        {
          isRead: true
        },
        {
          where: {userId}
        }
      );
    } else {
      return await NotificationReceiver.update(
        {
          isRead: true
        },
        {
          where: {userId, notificationId}
        }
      );
    }
  }
}
