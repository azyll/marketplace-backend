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
import {StudentService} from './student.service.js';

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
    //For Proware Office Closed Hours
    // const now = new Date();
    // const day = now.getDay();
    // const hours = now.getHours();

    // const isWeekendWindow = (day === 5 && hours >= 16) || day === 6 || (day === 0 && hours < 13);

    // if (isWeekendWindow) {
    //   throw new Error(
    //     'The Proware office is closed on weekends. Orders can only be processed from Sunday 1 PM to Friday at 3 PM.'
    //   );
    // }

    //Get Only the ID
    const variantIds = orderItems.map((item) => item.productVariantId);

    //Check if the input variants are all valid
    const productVariants = await ProductVariant.findAll({
      include: [{model: Product, as: 'product'}],
      where: {
        id: {
          [Op.in]: variantIds
        }
      }
    });

    if (productVariants.length !== variantIds.length) {
      throw new NotFoundException('Invalid credential, The product not found', 404);
    }

    //Get Order Limit
    const orderLimit = await this.getOrderLimit();

    //Check if the orders are all valid
    for (const orderItem of orderItems) {
      //Check if the quantity is exceed to the allowed limit
      if (orderItem.quantity > orderLimit)
        throw new Error(
          `One or more order items have a quantity that exceeds the maximum allowed limit of ${orderLimit}.`
        );

      //Check if valid product variant
      const productVariant = productVariants.find((variant) => variant.id === orderItem.productVariantId);
      if (!productVariant) throw new NotFoundException('Product not found', 404);

      //Cannot process order for items that is out of stock
      if (productVariant.stockCondition === 'out-of-stock')
        throw new Error('You cannot order this item, due to its currently low in stock');
      if (productVariant.stockCondition === 'low-stock' && orderItem.quantity > 1) {
        throw new Error('Only 1 quantity per order for products that is currently low stock');
      }
    }

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    //Get Student Data
    const user = await User.findByPk(studentId, {
      include: [
        {
          model: Student,
          as: 'student'
        }
      ]
    });
    //If student not found
    if (!user) throw new NotFoundException('Student not found', 404);

    const genderAttribute = await ProductAttribute.findOne({
      where: {
        name: 'Gender'
      }
    });
    if (!genderAttribute) throw new Error('Attribute not found');
    for (const productVariant of productVariants) {
      if (
        productVariant.productAttributeId === genderAttribute.id &&
        productVariant.name.toLowerCase() !== user.student.sex
      ) {
        throw new Error('You cannot order an item that is not for your sex');
      }
    }
    const studentOrders = await Order.findAll({
      include: [
        {
          model: OrderItems,
          as: 'orderItems',
          required: true,
          where: {
            productVariantId: {
              [Op.in]: variantIds
            }
          },
          include: [
            {
              model: ProductVariant,
              as: 'productVariant',
              required: true,
              include: [{model: Product, as: 'product', required: true}]
            }
          ]
        }
      ],
      where: {
        studentId: user.student.id,
        status: {
          [Op.in]: ['completed', 'ongoing']
        },
        createdAt: {
          [Op.gt]: threeMonthsAgo,
          [Op.lt]: new Date()
        }
      }
    });
    const productCountMap = {};
    const productVariantDetails = {};

    // Step 1: Count orders and store variant details
    for (const order of studentOrders) {
      for (const item of order.orderItems) {
        const variantId = item.productVariantId;

        if (!productCountMap[variantId]) {
          productCountMap[variantId] = item.quantity;
          productVariantDetails[variantId] = item.productVariant;
        } else {
          const orderItemId = orderItems.find((item) => item.productVariantId === variantId);
          if (!orderItemId) throw new NotFoundException('Product not found');
          productCountMap[variantId] = productCountMap[variantId] + item.quantity;
        }
      }
    }

    // Step 2: Check which variants exceed limits
    const disallowedOrders = [];

    for (const [variantIdStr, count] of Object.entries(productCountMap)) {
      const variant = productVariantDetails[variantIdStr];
      const isLowStock = variant.stockCondition === 'low-stock'; // Or variant.isLowStock === true

      const allowedLimit = isLowStock ? 1 : orderLimit;

      if (count >= allowedLimit) {
        disallowedOrders.push({
          variantIdStr,
          count,
          allowedLimit,
          productName: variant.product?.name || 'Unknown Product'
        });
      }
    }
    if (disallowedOrders.length >= 1)
      throw new Error(
        `You are not allowed to order ${disallowedOrders.map((d) => d.productName).join(', ')}. Order item quantity Limit exceeded.`
      );

    const status = 'ongoing';

    const plainProductVariants = productVariants.map((variant) => variant.get({plain: true}));

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
          paranoid: false,
          include: [
            {
              model: ProductVariant,
              as: 'productVariant',
              paranoid: false,
              include: [{model: Product, as: 'product', paranoid: false}]
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
          paranoid: false,
          include: [
            {
              model: ProductVariant,
              as: 'productVariant',
              paranoid: false,
              include: [{model: Product, as: 'product', paranoid: false}]
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
              paranoid: false,
              include: [
                {
                  model: Product,
                  as: 'product',
                  paranoid: false
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
  
   * @param {string} orderId
   * @param {{productVariantId:string, quantity:number} []} newOrderItems - Order items
   */
  static async updateStudentOrder(orderId, newOrderItems) {
    const order = await Order.findOne({
      where: {id: orderId, status: 'ongoing'},
      include: [
        {
          model: OrderItems,
          as: 'orderItems',
          required: true,
          include: [
            {
              model: ProductVariant,
              as: 'productVariant',
              required: true,
              include: [{model: Product, as: 'product', required: true}]
            }
          ]
        },
        {
          model: DB.Student,
          as: 'student'
        }
      ]
    });

    if (!order) throw new NotFoundException('Order not found or is not eligible for update', 404);
    // Get the current product variants in the new order items to check stock
    const variantIds = newOrderItems.map((item) => item.productVariantId);
    const productVariants = await ProductVariant.findAll({
      include: [{model: Product, as: 'product'}],
      where: {
        id: {
          [Op.in]: variantIds
        }
      }
    });

    if (productVariants.length !== variantIds.length) {
      throw new NotFoundException('One or more products in the new order items are invalid', 404);
    }
    // Get the order limit and existing items to calculate any stock overages
    const orderLimit = await this.getOrderLimit();

    // Validate the new order items
    for (const orderItem of newOrderItems) {
      // Check if the quantity exceeds the allowed order limit
      if (orderItem.quantity > orderLimit) {
        throw new Error(
          `One or more order items have a quantity that exceeds the maximum allowed limit of ${orderLimit}.`
        );
      }

      // Check if valid product variant exists in the new order items
      const productVariant = productVariants.find((variant) => variant.id === orderItem.productVariantId);
      if (!productVariant) throw new NotFoundException('Product not found', 404);

      // Check if stock is available for the requested quantity
      if (productVariant.stockCondition === 'out-of-stock') {
        throw new Error('You cannot order this item as it is out of stock');
      }
      if (productVariant.stockCondition === 'low-stock' && orderItem.quantity > 1) {
        throw new Error('Only 1 quantity per order for products that are currently low stock');
      }
    }
    // Prepare to update order items
    let totalUpdatedOrder = 0;
    const updatedOrderItems = [];

    // Update the stock and order item details
    await sequelize.transaction(async (transaction) => {
      for (const oldOrderItem of order.orderItems) {
        const productVariant = await ProductVariant.findByPk(oldOrderItem.productVariantId, {transaction});
        if (!productVariant) throw new NotFoundException('Product not found', 404);

        // Add back the old reserved stock quantity
        productVariant.stockAvailable = Number(productVariant.stockAvailable) + Number(oldOrderItem.quantity);
        productVariant.stockReserved = Number(productVariant.stockReserved) - Number(oldOrderItem.quantity);

        // Update stock condition accordingly
        productVariant.stockCondition = calculateStockCondition(productVariant.stockAvailable);
        await productVariant.save({transaction});
      }

      // Loop through new order items and update stock and order items
      for (const newOrderItem of newOrderItems) {
        const productVariant = productVariants.find((variant) => variant.id === newOrderItem.productVariantId);

        if (!productVariant) throw new NotFoundException('Product not found', 404);

        let newStockAvailable = Number(productVariant?.stockAvailable) - Number(newOrderItem.quantity);
        if (newStockAvailable < 0) {
          throw new Error(
            `You are trying to order more than the available stock for ${productVariant.product.name}. ` +
              `Available stock: ${productVariant?.stockAvailable}, Reserved stock: ${productVariant.stockReserved}`
          );
        }

        // Update the stock information
        productVariant.stockAvailable = newStockAvailable;
        productVariant.stockReserved = productVariant.stockReserved + Number(newOrderItem.quantity);
        productVariant.stockCondition = calculateStockCondition(newStockAvailable);
        await productVariant.save({transaction});

        totalUpdatedOrder += Number(productVariant.price) * newOrderItem.quantity;

        // Save the updated order item
        updatedOrderItems.push({
          orderId: order.id,
          productVariantId: newOrderItem.productVariantId,
          quantity: newOrderItem.quantity,
          price: productVariant.price
        });
      }

      // Delete existing order items and add updated ones
      await OrderItems.destroy({
        where: {orderId: order.id},
        transaction
      });

      await OrderItems.bulkCreate(
        updatedOrderItems.map((item) => ({
          orderId: order.id,
          productVariantId: item.productVariantId,
          quantity: item.quantity,
          price: item.price
        })),
        {transaction}
      );

      // Update the order total
      order.total = totalUpdatedOrder;
      await order.save({transaction});

      // Log the activity
      await ActivityLogService.createLog(
        'Order Updated Successfully',
        `Order ${orderId} updated with new items totaling ${totalUpdatedOrder || 0}`,
        'order'
      );

      // Send notification
      await NotificationService.createNotification(
        'Order Updated',
        `${order.student.id} updated their order`,
        'order',
        'employees',
        {userId: null, departmentId: null}
      );
    });

    return order;
  }

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
    const transaction = await sequelize.transaction(async (transaction) => {
      const orders = await Order.findAll({
        include: [{model: OrderItems, as: 'orderItems'}],
        where: {
          status: 'ongoing',
          createdAt: {
            [Op.lt]: thresholdDate
          }
        },
        transaction
      });

      for (const order of orders) {
        for (const orderItem of order.orderItems) {
          const variant = await ProductVariant.findByPk(orderItem.productVariantId, {transaction});
          if (!variant) throw new NotFoundException('Product not found', 404);

          const newStockAvailable = Number(variant.stockAvailable) + Number(orderItem.quantity);
          variant.stockAvailable = newStockAvailable;
          variant.stockReserved = Number(variant.stockReserved) - Number(orderItem.quantity);
          variant.stockCondition = calculateStockCondition(newStockAvailable);

          await variant.save({transaction});
        }

        // Optionally update order status to cancelled
        order.status = 'cancelled';
        await order.save({transaction});
      }
    });
    return transaction;
  }
  static async getOrderLimit() {
    const limit = await OrderLimit.findByPk(1);
    if (!limit) return 1;
    return Number(limit.limit);
  }
}
