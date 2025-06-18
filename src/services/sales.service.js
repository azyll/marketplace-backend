// @ts-check
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
          include: [
            {
              model: OrderItems,
              include: [
                {
                  model: ProductVariant,
                  include: [Product]
                }
              ]
            },
            {
              model: Student,
              include: [
                Program,
                {
                  model: User,
                  as: 'user'
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
}
