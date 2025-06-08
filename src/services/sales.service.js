// @ts-check
import {DB} from '../database/index.js';
import {NotFoundException} from '../exceptions/notFound.js';

const {Sales, Order, OrderItems, Student, User, Program} = DB;

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

    const sales = await Sales.create(salesData);
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
      include: [
        {
          model: Order,
          include: [
            {
              model: OrderItems
            },
            {
              model: Student,
              include: [
                {
                  model: User,
                  as: 'user'
                },
                {
                  model: Program
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
}
