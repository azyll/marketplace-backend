// @ts-check
import {col, fn, Op} from 'sequelize';
import {getSales} from '../controllers/sales.controller.js';
import {DB} from '../database/index.js';
import {AlreadyExistException} from '../exceptions/alreadyExist.js';
import {NotFoundException} from '../exceptions/notFound.js';
import {ActivityLogService} from './activity-log.service.js';
import sequelize from '../database/config/sequelize.js';

const {Sales, Order, OrderItems, Student, User, Program, Product, ProductVariant} = DB;

/**
 * @typedef {import ('../types/index.js').QueryParams} QueryParams
 * @typedef {import ('../types/index.js').PaginatedResponse<Sales>} SalesResponse
 */
export class SalesService {
  /**
   *
   * @param {{total:number,orderId:string,oracleInvoice:string}} salesData
   * @throws {NotFoundException} Order not found
   * @returns {Promise<Sales>}
   */
  static async createSales(salesData) {
    return await sequelize.transaction(async (transaction) => {
      const order = await Order.findByPk(salesData.orderId, {transaction});

      if (!order) throw new NotFoundException('Order not found', 404);

      const [sales, isNewSales] = await Sales.findOrCreate({
        where: {oracleInvoice: salesData.oracleInvoice},
        defaults: salesData,
        transaction
      });
      if (!isNewSales) throw new AlreadyExistException('The Oracle Invoice You Input is already existing', 409);
      await ActivityLogService.createLog(
        `New Sale recorded: Total ${sales.total}, Oracle Invoice #${sales.oracleInvoice}`,
        `For Order Number: ${order.id}\n` +
          `Total amount: ${sales.total}\n` +
          `Oracle Invoice Number: ${sales.oracleInvoice}`,
        'sales'
      );
      return sales;
    });
  }
  /**
   * Get All Sales
   * @param {QueryParams} query
   * @returns {Promise<SalesResponse>} Sales Pagination
   */
  static async getSales(query) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const {count, rows: salesData} = await Sales.findAndCountAll({
      distinct: true,
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit,
      include: [
        {
          model: Order,
          as: 'order',
          include: [
            {
              model: OrderItems,
              as: 'orderItems'
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
        }
      ]
    });
    const totalSales = salesData.reduce((prev, curr) => {
      return prev + Number(curr.total);
    }, 0);
    return {
      data: salesData,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: count,
        totalSales
      }
    };
  }
  /**
   *
   * @param {string} oracleInvoice
   * @throws {NotFoundException} Sales not found
   */
  static async getSale(oracleInvoice) {
    const sales = await Sales.findOne({
      where: {oracleInvoice},
      include: [
        {
          model: Order,
          as: 'order',
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
                },
                {
                  model: Program,
                  as: 'program'
                }
              ]
            }
          ]
        }
      ]
    });

    if (!sales) throw new NotFoundException('Sale not found', 404);
    return sales;
  }

  /**
   *
   * @param {Date} startDate
   * @param {Date} endDate
   */
  static async getSalesFilterByDate(startDate, endDate) {
    const filteredSales = await Sales.sum('total', {
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      }
    });
    return filteredSales || 0;
  }
  static async getSalesTrend() {
    const now = new Date();

    // Current month boundaries
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Previous month boundaries
    const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    // Total sales for current month
    const currentMonthResult = await Sales.findOne({
      attributes: [[fn('SUM', col('total')), 'total']],
      where: {
        createdAt: {
          [Op.between]: [startOfCurrentMonth, endOfCurrentMonth]
        }
      },
      raw: true
    });

    // Total sales for previous month
    const previousMonthResult = await Sales.findOne({
      attributes: [[fn('SUM', col('total')), 'total']],
      where: {
        createdAt: {
          [Op.between]: [startOfPreviousMonth, endOfPreviousMonth]
        }
      },
      raw: true
    });

    const currentSales = parseFloat(currentMonthResult.total) || 0;
    const previousSales = parseFloat(previousMonthResult.total) || 0;

    let percentageChange = '↔ 0%';

    if (previousSales === 0 && currentSales > 0) {
      percentageChange = '↑ 100%';
    } else if (previousSales > 0 && currentSales === 0) {
      percentageChange = '↓ 100%';
    } else if (previousSales > 0) {
      const change = ((currentSales - previousSales) / previousSales) * 100;
      const roundedChange = Math.abs(change).toFixed(1);

      if (change > 0) {
        percentageChange = `↑ ${roundedChange}%`;
      } else if (change < 0) {
        percentageChange = `↓ ${roundedChange}%`;
      }
    }

    return {
      previousMonth: {
        totalSales: previousSales
      },
      currentMonth: {
        totalSales: currentSales,
        increasePercentage: percentageChange
      }
    };
  }
  static async getSalesPerMonth() {
    const year = new Date().getFullYear();

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const salesPerMonth = await Sales.findAll({
      attributes: [
        [fn('DATE_TRUNC', 'month', col('createdAt')), 'month'],
        [fn('SUM', col('total')), 'sales']
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
    // Step 2: Map DB results into a sales map
    const salesMap = {};
    salesPerMonth.forEach((row) => {
      const date = new Date(row.getDataValue('month'));
      const monthKey = monthNames[date.getMonth() + 1];
      salesMap[monthKey] = parseFloat(row.getDataValue('sales') || 0);
    });

    // Step 3: Build full list of months with sales totals
    const fullYearSales = Array.from({length: 12}, (_, i) => {
      const monthKey = monthNames[i];
      return {
        month: monthNames[i],
        count: parseFloat(salesMap[monthKey] || 0).toFixed(2)
      };
    });

    return fullYearSales;
  }
}
