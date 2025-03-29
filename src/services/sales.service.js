// @ts-check
import {DB} from '../database';

const {Sales, Order, OrderItems, Student, User} = DB;

/**
 * @typedef {import ('../types/index.js').QueryParams} QueryParams
 * @typedef {import ('../types/index.js').PaginatedResponse<Sales>} SalesResponse
 */
export class SalesService {
  static async createSales(salesData) {
    const sales = await Sales.create(salesData);
    return sales;
  }
  /**
   *
   * @param {QueryParams} query
   * @returns {Promise<SalesResponse>} Sales Pagination
   */
  static async getSales(query) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const {count, rows: salesData} = await Sales.findAndCountAll({
      distinct: true,
      include: [{model: Order, include: [OrderItems]}]
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
