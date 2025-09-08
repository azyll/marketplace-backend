// @ts-check

import {col, fn, literal, Op, or} from 'sequelize';
import {DB} from '../database/index.js';
import {NotFoundException} from '../exceptions/notFound.js';
import {ActivityLogService} from './activity-log.service.js';
import sequelize from '../database/config/sequelize.js';
import {calculateStockCondition} from '../utils/stock-helper.js';
import {SalesService} from './sales.service.js';
import {NotificationService} from './notification.service.js';
import {CartService} from './cart.service.js';

const {Order, Student, User, OrderItems, ProductVariant, Product, Program, ProductAttribute, OrderLimit} = DB;

/**
 * @typedef {import('../types/index.js').QueryParams} QueryParams
 * @typedef {import ("../types/index.js").PaginatedResponse<Order>} PaginatedOrders
 */

export class OrderService {
  /**
   * Create order for student
   * @param {string} studentId - Student ID
   * @param {{productVariantId:string, quantity:number} []} orderItems - Order items
   * @param {'cart'|'buy-now'} orderType
   * @returns {Promise<Order>} Order Data
   * @throws {NotFoundException}  Student or Product not found
   */
  static async createOrder(studentId, orderItems, orderType) {
    // const now = new Date();
    // const day = now.getDay();
    // const hours = now.getHours();

    // const isWeekendWindow = (day === 5 && hours >= 16) || day === 6 || (day === 0 && hours < 13);

    // if (isWeekendWindow) {
    //   throw new Error(
    //     'The Proware office is closed on weekends. Orders can only be processed from Sunday to Friday at 4 PM.'
    //   );
    // }

    const variantIds = orderItems.map((item) => item.productVariantId);

    const productVariants = await ProductVariant.findAll({
      include: [{model: Product, as: 'product'}],
      where: {
        id: {
          [Op.in]: variantIds
        },
        deletedAt: {
          [Op.is]: null
        }
      }
    });

    if (productVariants.length !== variantIds.length || !productVariants) {
      throw new NotFoundException('Invalid credential, The product not found', 404);
    }
    const orderLimit = await this.getOrderLimit();
    for (const orderItem of orderItems) {
      if (orderItem.quantity > orderLimit)
        throw new Error(
          `One or more order items have a quantity that exceeds the maximum allowed limit of ${orderLimit}.`
        );
    }

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const user = await User.findByPk(studentId, {
      include: [
        {
          model: Student,
          as: 'student',
          include: [
            {
              model: Order,
              as: 'order',
              // required:true,
              // where:{
              // status:'completed'
              // }
              include: [
                {
                  model: OrderItems,
                  as: 'orderItems',
                  required: true,
                  where: {
                    //Orders for the past 3 months
                    createdAt: {
                      [Op.gt]: threeMonthsAgo,
                      [Op.lt]: new Date()
                    },
                    productVariantId: {
                      [Op.in]: variantIds
                    }
                  },
                  include: [
                    {
                      model: ProductVariant,
                      as: 'productVariant',
                      required: true, // Ensure productVariant matches
                      include: [{model: Product, as: 'product'}],
                      where: {
                        stockAvailable: {
                          [Op.lt]: 20
                        }
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    if (!user) throw new NotFoundException('Student not found', 404);

    const status = 'ongoing';
    const genderAttribute = await ProductAttribute.findOne({
      where: {
        name: 'Gender'
      }
    });
    if (!genderAttribute) throw new Error('Attribute not found');
    for (const product of productVariants) {
      if (product.productAttributeId === genderAttribute.id && product.name.toLowerCase() !== user.student.sex) {
        throw new Error('You cannot order an item that is not for your sex');
      }
    }

    const plainProductVariants = productVariants.map((variant) => variant.get({plain: true}));

    const numberOfOrderForPastMonths = user.student.order.length;
    if (numberOfOrderForPastMonths >= orderLimit) {
      throw new Error(
        `One of the items you're trying to order is currently low in stock. You've already purchased this item ${numberOfOrderForPastMonths} ${numberOfOrderForPastMonths > 1 ? 'times' : 'time'} in the past three months, which exceeds the allowed limit of ${orderLimit}. You can't order it again right now, but you can add it to your cart to be notified when it's restocked.`
      );
    }

    //Used transaction so when have a over order product all the stock update will be roll back
    let totalOrder = await sequelize.transaction(async (transaction) => {
      //For total order
      let total = 0;

      for (const plainProductVariant of plainProductVariants) {
        const orderItem = orderItems.find((order) => order.productVariantId === plainProductVariant.id);
        if (!orderItem) {
          throw new NotFoundException('A product not found', 404);
        }
        const productVariant = await ProductVariant.findByPk(orderItem.productVariantId, {
          include: [
            {
              model: Product,
              as: 'product'
            }
          ],
          transaction
        });

        if (!productVariant) throw new NotFoundException('Invalid credential, The product not found', 404);

        let newStockAvailable = Number(productVariant?.stockAvailable) - Number(orderItem.quantity);
        if (newStockAvailable < 0) {
          throw new Error(
            `You over order the item ${productVariant.product.name} the available stock is ${productVariant?.stockAvailable} and the reserved stock is ${productVariant.stockReserved}`
          );
        }
        productVariant.stockAvailable = newStockAvailable;
        productVariant.stockReserved = productVariant.stockReserved + Number(orderItem.quantity);
        productVariant.stockCondition = calculateStockCondition(newStockAvailable);
        await productVariant?.save({
          transaction
        });

        total += Number(productVariant.price) * orderItem.quantity;
      }

      return total;
    });
    let orderTransaction = await sequelize.transaction(async (transaction) => {
      const order = await Order.create(
        {
          total: totalOrder || 0,
          status,
          studentId: user.student.id,
          orderItems
        },
        {
          transaction,
          include: [{model: OrderItems, as: 'orderItems'}]
        }
      );
      await ActivityLogService.createLog(
        'Order Created Successfully',
        `Order created with a total of ${totalOrder || 0}`,
        'order'
      );
      if (orderType == 'cart') {
        await CartService.archiveCart(user.id, variantIds);
      }

      await NotificationService.createNotification(
        'Order Created',
        `${user.student.id} pushed a new order`,
        'order',
        'employees',
        {
          userId: null,
          departmentId: null
        }
      );
      return order;
    });

    return orderTransaction;
  }

  /**
   * Get all Orders
   * @param {QueryParams & {from:string, to:string, status:'ongoing'|'completed'|'cancelled'}} query
   * @returns {Promise<PaginatedOrders>} All of the orders
   */
  static async getOrders(query) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const whereClause = {};

    if (query?.from && query?.to) {
      let filterFrom = new Date(query?.from);
      let filterTo = new Date(new Date(query?.to).setHours(23, 59, 59, 999));
      whereClause.createdAt = {[Op.between]: [filterFrom, filterTo]};
    }
    if (query?.status) {
      whereClause.status = query.status;
    }

    const {rows: orderData, count} = await Order.findAndCountAll({
      distinct: true,
      where: whereClause,
      ...(query.limit &&
        query.page && {
          offset: (page - 1) * limit,
          limit
        }),
      include: [
        {
          model: OrderItems,
          as: 'orderItems',
          include: [
            {
              model: ProductVariant,
              as: 'productVariant',
              include: [{model: Product, as: 'product'}]
            }
          ]
        },
        {
          model: Student,
          as: 'student',
          include: [
            {
              model: User,
              as: 'user'
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return {
      data: orderData,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: count
      }
    };
  }
  /**
   * Get All Orders of Student
   * @param {string} studentId
   * @param {QueryParams & {
   * status:"completed" | "ongoing" | "cancelled"
   * }} query
   * @returns {Promise<PaginatedOrders>} All of the student orders
   * @throws {NotFoundException} Student not found
   */
  static async getStudentOrders(studentId, query) {
    const student = await User.findByPk(studentId, {
      include: [
        {
          model: Student,
          as: 'student'
        }
      ]
    });
    if (!student) {
      throw new NotFoundException('Student not found', 404);
    }

    const where = {
      studentId: Number(student.student.id)
    };

    if (query?.status) {
      where.status = query.status.replace(/-/g, ' '); // case-insensitive partial match
    }

    const page = Number(query.page || 1);
    const limit = Number(query.limit || 10);

    const {rows: orderData, count} = await Order.findAndCountAll({
      distinct: true,
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']],
      where,
      include: [
        {
          model: OrderItems,
          as: 'orderItems',
          include: [
            {
              model: ProductVariant,
              as: 'productVariant',
              include: [{model: Product, as: 'product'}]
            }
          ]
        },
        {
          model: Student,
          as: 'student',
          include: [
            {
              model: User,
              as: 'user'
            }
          ]
        }
      ]
    });

    return {
      data: orderData,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: count
      }
    };
  }

  /**
   *
   * @param {string} orderId Order Id
   * @returns {Promise<Order>}
   * @throws {NotFoundException} Order not found
   */
  static async getOrder(orderId) {
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: OrderItems,
          as: 'orderItems',
          include: [
            {
              model: ProductVariant,
              as: 'productVariant',
              include: [
                {
                  model: Product,
                  as: 'product'
                }
              ]
            }
          ]
        },
        {
          model: Student,
          as: 'student',
          include: [
            {
              model: User,
              as: 'user'
            },
            {
              model: Program,
              as: 'program'
            }
          ]
        }
      ]
    });

    if (!order) {
      throw new NotFoundException('Order not found', 404);
    }

    // @ts-ignore
    return order;
  }

  /**
   * Update Order Status
   * @param {string} orderId - Order ID
   * @param {string} studentId - Student Id
   * @param {'completed'|'ongoing'|'cancelled'} newStatus - new Status
   * @param {string} oracleInvoice
   * @throws {NotFoundException} Student or Order not found
   */
  static async updateOrderStatus(studentId, orderId, newStatus, oracleInvoice) {
    const orderTransaction = sequelize.transaction(async (transaction) => {
      const order = await Order.findByPk(orderId, {
        include: [{model: OrderItems, as: 'orderItems'}],
        transaction
      });
      if (!order) throw new NotFoundException('Order not found', 404);

      const student = await Student.findByPk(studentId, {
        include: [
          {
            model: User,
            as: 'user'
          }
        ]
      });
      if (!student) throw new NotFoundException('Student not found', 404);

      if (newStatus === order.status) throw new Error('The order status and the new status is the same');

      if (newStatus === 'completed') {
        for (const orderItem of order.orderItems) {
          const variant = await ProductVariant.findByPk(orderItem.productVariantId, {transaction});
          if (!variant) throw new NotFoundException('Product not found', 404);

          variant.stockReserved = Number(variant.stockReserved) - Number(orderItem.quantity);
          const newStockAvailable = Number(variant.stockAvailable) + Number(variant.stockReserved);
          variant.stockCondition = calculateStockCondition(newStockAvailable);
          await variant.save();
        }

        await SalesService.createSales({
          orderId,
          total: order.total,
          oracleInvoice
        });
        await ActivityLogService.createLog(`New Sales Created`, 'A new complete transaction for sales', 'sales');

        await NotificationService.createNotification(
          'Order Successful',
          `Student :${student.id} marked order as ${newStatus}`,
          'order',
          'individual',
          {
            departmentId: null,
            userId: student.user.id
          }
        );
        await NotificationService.createNotification(
          'New Sales',
          `${student.id} created new Sales`,
          'sale',
          'employees',
          {
            departmentId: null,
            userId: null
          }
        );
      }
      if (newStatus === 'cancelled') {
        //TODO: Failed Revert stocks
        for (const orderItem of order.orderItems) {
          const variant = await ProductVariant.findByPk(orderItem.productVariantId, {transaction});
          if (!variant) throw new NotFoundException('Product not found', 404);

          const newStockAvailable = Number(variant.stockAvailable) + Number(orderItem.quantity);
          variant.stockAvailable = Number(newStockAvailable);
          variant.stockReserved = Number(variant.stockReserved) - Number(orderItem.quantity);
          variant.stockCondition = calculateStockCondition(newStockAvailable);
          await variant.save();
        }
      }
      await ActivityLogService.createLog(
        `The order ${order.id} marked as ${newStatus}`,
        `A order marked as ${newStatus}`,
        'order'
      );

      order.status = newStatus;
      await order.save();

      return order;
    });
    return orderTransaction;
  }
  /**
   *
   * @param {string} studentId
   * @param {string} orderId
   * @param {string} newOrder
   */
  static async updateStudentOrder(studentId, orderId, newOrder) {}

  /**
   * Delete Student Order
   * @param {string} studentId
   * @param {string} orderId
   * @throws {NotFoundException} Student and order not found
   */
  static async archiveStudentOrder(studentId, orderId) {}

  /**
   *
   * @param {Date} startDate
   * @param {Date} endDate
   */
  static async getOrdersFilterByDate(startDate, endDate) {
    const {count, rows: orderItems} = await Order.findAndCountAll({
      distinct: true,
      where: {
        createdAt: {[Op.between]: [startDate, endDate]}
      }
    });
    return {
      count,
      orderItems
    };
  }

  static async getOrdersPerMonth() {
    const year = new Date().getFullYear();

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Step 1: Get real data from DB
    const ordersPerMonth = await Order.findAll({
      attributes: [
        [fn('DATE_TRUNC', 'month', col('createdAt')), 'month'],
        [fn('COUNT', '*'), 'count']
      ],
      where: {
        createdAt: {
          [Op.gte]: new Date(`${year}-01-01`),
          [Op.lt]: new Date(`${year + 1}-01-01`)
        }
      },
      group: [fn('DATE_TRUNC', 'month', col('createdAt'))],
      order: [[fn('DATE_TRUNC', 'month', col('createdAt')), 'ASC']]
    });

    // Step 2: Map DB results into an object
    const countsMap = {};
    ordersPerMonth.forEach((row) => {
      const date = new Date(row.getDataValue('month'));
      const monthKey = monthNames[date.getMonth() + 1];
      countsMap[monthKey] = parseInt(row.getDataValue('count'));
    });

    // Step 3: Build full list of months
    const fullYearMonths = Array.from({length: 12}, (_, i) => {
      const monthKey = monthNames[i];
      return {
        month: monthKey,
        count: countsMap[monthKey] || 0
      };
    });

    return fullYearMonths;
  }

  static async markOnGoingOrdersAsCancelled() {
    const thresholdDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
    const transaction = sequelize.transaction(async (transaction) => {
      const order = await Order.findAll({
        include: [{model: OrderItems, as: 'orderItems'}],
        where: {
          status: 'ongoing',
          createdAt: {
            [Op.lt]: thresholdDate
          }
        },
        transaction
      });

      if (!order) return;

      // for (const orderItem of order.orderItems) {
      //   const variant = await ProductVariant.findByPk(orderItem.productVariantId, {transaction});
      //   if (!variant) throw new NotFoundException('Product not found', 404);

      //   const newStockAvailable = Number(variant.stockAvailable) + Number(orderItem.quantity);
      //   variant.stockAvailable = Number(newStockAvailable);
      //   variant.stockReserved = Number(variant.stockReserved) - Number(orderItem.quantity);
      //   variant.stockCondition = calculateStockCondition(newStockAvailable);
      //   await variant.save({
      //     transaction
      //   });
      // }
    });
    return transaction;
  }
  static async getOrderLimit() {
    const limit = await OrderLimit.findByPk(1);
    if (!limit) return 1;
    return Number(limit.limit);
  }
}
