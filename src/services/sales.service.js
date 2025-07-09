// @ts-check
import {col, fn, Op} from 'sequelize';
import {getSales} from '../controllers/sales.controller.js';
import {DB} from '../database/index.js';
import {AlreadyExistException} from '../exceptions/alreadyExist.js';
import {NotFoundException} from '../exceptions/notFound.js';

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
    const order = await Order.findByPk(salesData.orderId);

    if (!order) throw new NotFoundException('Order not found', 404);

    const [sales, isNewSales] = await Sales.findOrCreate({
      where: {oracleInvoice: salesData.oracleInvoice},
      defaults: salesData
    });
    if (!isNewSales) throw new AlreadyExistException('The Oracle Invoice You Input is already existing', 409);

    return sales;
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

    return {
      data: salesData,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: count
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

    if (!sales) throw new NotFoundException('Sales not found', 404);
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
