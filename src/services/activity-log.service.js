// @ts-check
import {Op} from 'sequelize';
import {DB} from '../database/index.js';

export class ActivityLogService {
  /**
   * @typedef {import('../types/index.js').TLog} TLog
   */
  /**
   * @typedef {import ('../types/index.js').QueryParams} QueryParams
   */
  /**
   *
   * @param {String} title
   * @param {String} content
   * @param {TLog | 'product'} type
   * @returns
   */
  static async createLog(title, content, type, id, options = {}) {
    try {
      let fields = {
        title,
        content,
        type
      };
      if (type === 'inventory') {
        fields.productId = id;
      }
      if (type === 'order') {
        fields.orderId = id;
      }
      if (type === 'sales') {
        fields.salesId = id;
      }
      if (type === 'product') {
        fields.type = 'system';
        fields.productId = id;
      }

      const log = await DB.ActivityLog.create(fields, {transaction: options.transaction});
      return log;
    } catch (error) {
      console.log(error, 'error');
    }
  }
  /**
   *
   * @param { QueryParams&{
   * type?: 'user'| 'system'| 'inventory'| 'sales'| 'order',search:string
   *   }} query Query
   *
   * @returns
   */
  static async getLogs(query) {
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;
    // ✅ Define allowed enum values
    const where = {};
    const validTypes = ['user', 'system', 'inventory', 'sales', 'order'];
    if (query.search) {
      const searchTerm = query.search.trim();

      where[Op.or] = [{title: {[Op.iLike]: `%${searchTerm}%`}}, {content: {[Op.iLike]: `%${searchTerm}%`}}];
    }
    if (query.type) {
      if (validTypes.includes(query.type)) {
        where.type = query.type;
      } else {
        return {
          data: [],
          meta: {
            currentPage: page,
            itemsPerPage: limit,
            totalItems: 0
          }
        };
      }
    }

    const {count, rows} = await DB.ActivityLog.findAndCountAll({
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      where,
      limit,
      include: [
        {
          model: DB.Product,
          as: 'product'
        },
        {
          model: DB.Order,
          as: 'order'
        },
        {
          model: DB.Sales,
          as: 'sales'
        },
        {
          model: DB.User,
          as: 'user'
        }
      ]
    });
    return {
      data: rows,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: count
      }
    };
  }
}
