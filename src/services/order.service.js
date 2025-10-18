// @ts-check

import {cast, col, fn, literal, Op, or, Transaction, where} from 'sequelize';
import {DB} from '../database/index.js';
import {NotFoundException} from '../exceptions/notFound.js';
import {ActivityLogService} from './activity-log.service.js';
import sequelize from '../database/config/sequelize.js';
import {calculateStockCondition} from '../utils/stock-helper.js';
import {SalesService} from './sales.service.js';
import {NotificationService} from './notification.service.js';
import {CartService} from './cart.service.js';
import {StudentService} from './student.service.js';
import {UserService} from './user.service.js';
import {RoleService} from './role.service.js';

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

    const status = 'ongoing';
    const orderItemsWithPrice = [];
    //Used transaction so when have a over order product all the stock update will be roll back
    let totalOrder = await sequelize.transaction(async (transaction) => {
      //For total order
      let total = 0;
      const nowAllowedProductNames = [];
      for (const plainProductVariant of productVariants) {
        const orderItem = orderItems.find((order) => order.productVariantId === plainProductVariant.id);
        if (!orderItem) {
          throw new NotFoundException('A product not found', 404);
        }
        /**
         * @type {{id:string,size:string,name:string,price:number,stockAvailable:string,stockReserved:number,stockCondition:string,product:{name:string},save:({transaction:Transaction}=>Promise<void>)}|null}
         */
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
        productVariant.stockReserved = productVariant.stockReserved + Number(orderItem.quantity);
        productVariant.stockCondition = calculateStockCondition(newStockAvailable);

        const [studentProductCount, isJustCreated] = await DB.StudentProductCount.findOrCreate({
          where: {
            studentId: user.student.id,
            productVariantId: productVariant.id
          },
          defaults: {
            studentId: user.student.id,
            productVariantId: productVariant.id,
            count: orderItem.quantity
          },
          transaction
        });

        const productOrderCount =
          isJustCreated ? studentProductCount.count : studentProductCount.count + orderItem.quantity;
        studentProductCount.count = productOrderCount;
        if (productOrderCount > orderLimit) {
          nowAllowedProductNames.push(
            `${productVariant.product.name}${productVariant.name === 'N/A' ? ' ' : `-${productVariant.name}-`}${productVariant.size === 'N/A' ? '' : `${productVariant.size}`}`
          );
        }
        await productVariant?.save({
          transaction
        });
        await studentProductCount?.save({
          transaction
        });
        const price = Number(productVariant.price);
        orderItemsWithPrice.push({...orderItem, price});
        total += price * orderItem.quantity;
      }
      if (nowAllowedProductNames.length > 0) {
        throw new Error(
          `The ${nowAllowedProductNames.join(' & ')} exceed to the required order limit of ${orderLimit}, wait the Proware to restock this item to process another order.`
        );
      }

      return total;
    });
    let orderTransaction = await sequelize.transaction(async (transaction) => {
      const order = await Order.create(
        {
          total: totalOrder || 0,
          status,
          studentId: user.student.id,
          orderItems: orderItemsWithPrice
        },
        {
          transaction,
          include: [{model: OrderItems, as: 'orderItems'}]
        }
      );
      await ActivityLogService.createLog(
        'Order Created Successfully',
        `A new order (ID: ${order.id}) was created with a total amount of ₱${totalOrder?.toFixed(2) || '0.00'}.`,
        'order'
      );

      await NotificationService.createNotification(
        'New Order Created',
        `Student ID ${user.student.id} has placed a new order (Order ID: ${order.id}).`,
        'order',
        'employees',
        {
          userId: null,
          departmentId: null
        }
      );

      if (orderType == 'cart') {
        await CartService.archiveCart(user.id, variantIds);
      }
      return order;
    });

    return orderTransaction;
  }

  /**
   * Create order for student
   * @param {{firstName:string|undefined,lastName:string|undefined,program:string,studentNumber:string,sex:'male'|'female'|undefined}} studentRecord - Student ID
   * @param {{productVariantId:string, quantity:number} []} orderItems - Order items
   * @returns {Promise<Order>} Order Data
   * @throws {NotFoundException}  Student or Product not found
   */
  static async createOrderForStudent(studentRecord, orderItems) {
    let student = await DB.Student.findByPk(Number(studentRecord.studentNumber), {
      include: [
        {
          model: DB.User,
          as: 'user'
        }
      ]
    });

    if (!student) {
      if (!studentRecord.firstName) throw new Error('first name is required for new student');
      if (!studentRecord.lastName) throw new Error('last name is required for new student');
      if (!studentRecord.program) throw new Error(' program is required for new student');
      if (!studentRecord.sex) throw new Error('sex is required for new student');
      if (!studentRecord.studentNumber) throw new Error('student number is required for new student');

      const program = await DB.Program.findByPk(studentRecord.program);

      if (!program) throw new NotFoundException('Program not found');

      const studentRole = await RoleService.getRole('student');
      if (!studentRole) throw new NotFoundException('Student role not found');
      const username = (studentRecord.lastName + '.' + String(studentRecord.studentNumber).slice(5)).toLowerCase();
      const user = await UserService.addUser({
        firstName: studentRecord.firstName,
        lastName: studentRecord.lastName,
        username,
        password: username,
        roleId: studentRole.id
      });
      student = await StudentService.createStudent(user.id, {
        programId: program.id,
        level: program.level,
        id: Number(studentRecord.studentNumber),
        sex: studentRecord.sex
      });
    }

    // For Proware Office Closed Hours
    // const now = new Date();
    // const day = now.getDay();
    // const hours = now.getHours();

    // const isWeekendWindow = (day === 5 && hours >= 16) || day === 6 || (day === 0 && hours < 13);

    // if (isWeekendWindow) {
    //   throw new Error(
    //     'The Proware office is closed on weekends. Orders can only be processed from Sunday 1 PM to Friday at 3 PM.'
    //   );
    // }
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      throw new Error('Order items are required');
    }

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

    const status = 'ongoing';
    const orderItemsWithPrice = [];
    //Used transaction so when have a over order product all the stock update will be roll back
    let totalOrder = await sequelize.transaction(async (transaction) => {
      //For total order
      let total = 0;
      const nowAllowedProductNames = [];
      for (const plainProductVariant of productVariants) {
        const orderItem = orderItems.find((order) => order.productVariantId === plainProductVariant.id);
        if (!orderItem) {
          throw new NotFoundException('A product not found', 404);
        }
        /**
         * @type {{id:string,size:string,name:string,price:number,stockAvailable:string,stockReserved:number,stockCondition:string,product:{name:string},save:({transaction:Transaction}=>Promise<void>)}|null}
         */
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
        productVariant.stockReserved = productVariant.stockReserved + Number(orderItem.quantity);
        productVariant.stockCondition = calculateStockCondition(newStockAvailable);

        const [studentProductCount, isJustCreated] = await DB.StudentProductCount.findOrCreate({
          where: {
            studentId: student.id,
            productVariantId: productVariant.id
          },
          defaults: {
            studentId: student.id,
            productVariantId: productVariant.id,
            count: orderItem.quantity
          },
          transaction
        });

        const productOrderCount =
          isJustCreated ? studentProductCount.count : studentProductCount.count + orderItem.quantity;
        studentProductCount.count = productOrderCount;
        if (productOrderCount > orderLimit) {
          nowAllowedProductNames.push(
            `${productVariant.product.name}${productVariant.name === 'N/A' ? ' ' : `-${productVariant.name}-`}${productVariant.size === 'N/A' ? '' : `${productVariant.size}`}`
          );
        }
        await productVariant?.save({
          transaction
        });
        await studentProductCount?.save({
          transaction
        });
        const price = Number(productVariant.price);
        orderItemsWithPrice.push({...orderItem, price});
        total += price * orderItem.quantity;
      }
      if (nowAllowedProductNames.length > 0) {
        throw new Error(
          `The ${nowAllowedProductNames.join(' & ')} exceed to the required order limit of ${orderLimit}, wait the Proware to restock this item to process another order.`
        );
      }

      return total;
    });
    let orderTransaction = await sequelize.transaction(async (transaction) => {
      const order = await Order.create(
        {
          total: totalOrder || 0,
          status,
          studentId: student.id,
          orderItems: orderItemsWithPrice
        },
        {
          transaction,
          include: [{model: OrderItems, as: 'orderItems'}]
        }
      );
      await ActivityLogService.createLog(
        'Order Created Successfully',
        `A new order (ID: ${order.id}) was created with a total amount of ₱${totalOrder?.toFixed(2) || '0.00'}.`,
        'order'
      );

      await NotificationService.createNotification(
        'New Order Created',
        `Student ID ${student.id} has placed a new order (Order ID: ${order.id}).`,
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
   * @param {QueryParams & {from:string, to:string, status:'ongoing'|'completed'|'cancelled'|'confirmed',search:string}} query
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
    if (query.search) {
      const search = query.search.trim();
      whereClause[Op.or] = [
        {id: {[Op.iLike]: `%${search}%`}},
        // Match student's first or last name (through associated User)
        {'$student.user.firstName$': {[Op.iLike]: `%${search}%`}},
        {'$student.user.lastName$': {[Op.iLike]: `%${search}%`}},
        {'$student.user.username$': {[Op.iLike]: `%${search}%`}},

        // Match program name or acronym
        {'$student.program.name$': {[Op.iLike]: `%${search}%`}},
        {'$student.program.acronym$': {[Op.iLike]: `%${search}%`}}
      ];
    }

    const {rows: orderData, count} = await Order.findAndCountAll({
      distinct: true,
      subQuery: false,
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
          attributes: {
            include: ['id', 'level', 'sex']
          },
          include: [
            {
              model: User,
              as: 'user',
              attributes: {include: ['firstName', 'lastName', 'username']}
            },
            {
              model: Program,
              as: 'program',
              attributes: {include: ['name', 'acronym']}
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
   * status:"completed" | "ongoing" | "cancelled"|"confirmed"
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
          model: DB.Sales,
          as: 'sales'
        },
        {
          model: OrderItems,
          as: 'orderItems',
          paranoid: false,
          include: [
            {
              model: ProductVariant,
              as: 'productVariant',
              attributes: {
                exclude: ['createdAt', 'updatedAt', 'deletedAt']
              },
              paranoid: false,
              include: [
                {
                  model: Product,
                  as: 'product',
                  paranoid: false,
                  attributes: {
                    exclude: ['createdAt', 'updatedAt', 'deletedAt']
                  }
                },
                {
                  model: OrderItems,
                  as: 'productVariantItem',
                  paranoid: false,
                  attributes: {
                    exclude: ['createdAt', 'updatedAt', 'deletedAt']
                  }
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
   * @param {'completed'|'ongoing'|'cancelled'|'confirmed'} newStatus - new Status
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
          variant.stockQuantity = Number(variant.stockQuantity) - Number(orderItem.quantity);
          await variant.save({transaction});
        }

        await SalesService.createSales({
          orderId,
          total: order.total,
          oracleInvoice
        });

        await NotificationService.createNotification(
          'Order Status Updated',
          `Student ID ${student.id} marked order #${order.id} (Total: ₱${order.total.toFixed(2)}) as "${newStatus}".`,
          'order',
          'individual',
          {
            departmentId: null,
            userId: student.user.id
          }
        );

        await NotificationService.createNotification(
          'New Sale Recorded',
          `Student ID ${student.id} has created a new sale.`,
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
          variant.stockReserved = Number(variant.stockReserved) - Number(orderItem.quantity);
          variant.stockCondition = calculateStockCondition(newStockAvailable);
          await variant.save({transaction});

          const studentProductCount = await DB.StudentProductCount.findOne({
            where: {
              studentId: student.id,
              productVariantId: variant.id
            }
          });

          const newCount = studentProductCount.count - orderItem.quantity;
          studentProductCount.count = newCount < 0 ? 0 : newCount;
          await studentProductCount?.save({transaction});
        }
      }
      await ActivityLogService.createLog(
        `Order #${order.id} status updated to "${newStatus}"`,
        `Order #${order.id} status was changed to "${newStatus}".`,
        'order'
      );

      order.status = newStatus;
      await order.save({transaction});

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
        const newStockCondition = Number(productVariant.stockAvailable) + Number(oldOrderItem.quantity);
        productVariant.stockReserved = Number(productVariant.stockReserved) - Number(oldOrderItem.quantity);

        // Update stock condition accordingly
        productVariant.stockCondition = calculateStockCondition(newStockCondition);
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
        `Order #${orderId} was updated with new items. Total amount is now ₱${totalUpdatedOrder?.toFixed(2) || '0.00'}.`,
        'order'
      );

      // Send notification to student
      await NotificationService.createNotification(
        `Your order #${order.id} has been updated`,
        `The new order items are:\n${order.orderItems
          .map(
            (orderItem) =>
              `• ${orderItem.productVariant.product.name} ${orderItem.productVariant.name} (${orderItem.productVariant.size}) — Quantity: ${orderItem.quantity} x ₱${orderItem.price.toFixed(2)}`
          )
          .join('\n')}`,
        'order',
        'individual',
        {
          departmentId: null,
          userId: order.student.userId
        }
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
        include: [
          {
            model: OrderItems,
            as: 'orderItems',
            include: [
              {
                model: DB.ProductVariant,
                as: 'productVariant',
                include: [
                  {
                    model: Product,
                    as: 'product',
                    required: true
                  }
                ]
              }
            ]
          },
          {
            model: Student,
            as: 'student',
            paranoid: false,
            include: [
              {
                model: User,
                as: 'user',
                paranoid: false
              }
            ]
          }
        ],
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

          const newStockAVailable = Number(variant.stockAvailable) + Number(orderItem.quantity);

          variant.stockReserved = Number(variant.stockReserved) - Number(orderItem.quantity);
          variant.stockCondition = calculateStockCondition(newStockAVailable);

          await variant.save({transaction});
          const studentProductCount = await DB.StudentProductCount.findOne({
            where: {
              studentId: order.studentId,
              productVariantId: variant.id
            }
          });

          const newCount = studentProductCount.count - orderItem.quantity;
          studentProductCount.count = newCount < 0 ? 0 : newCount;
          await studentProductCount?.save({transaction});
        }

        // Optionally update order status to cancelled
        order.status = 'cancelled';

        await order.save({transaction});

        await NotificationService.createNotification(
          `Order #${order.id} automatically cancelled after 24 hours`,
          `Your order exceeded the 24-hour window and has been marked as cancelled.\n\nOrder items:\n${order.orderItems
            .map(
              (orderItem) =>
                `• ${orderItem.productVariant.product.name} ${orderItem.productVariant.name} (${orderItem.productVariant.size}) — Quantity: ${orderItem.quantity} x ₱${orderItem.price.toFixed(2)}`
            )
            .join('\n')}`,
          'order',
          'individual',
          {
            departmentId: null,
            userId: order.student.user.id
          }
        );
      }
      if (orders.length > 0) {
        await ActivityLogService.createLog(
          `${orders.length} orders marked as cancelled after exceeding the 24-hour limit.`,
          'Bulk order status updated to "cancelled".',
          'order'
        );
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
