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
   * @param {TLog} type
   * @returns
   */
  static async createLog(title, content, type) {
    const log = await DB.ActivityLog.create({
      title,
      content,
      type
    });
    return log;
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
    const {from, to} = query;
    if (from && to) {
      // Date range
      where.createdAt = {
        [Op.gte]: new Date(from),
        [Op.lt]: new Date(new Date(to).setDate(new Date(to).getDate() + 1)) // add 1 day to make end inclusive
      };
    } else if (from) {
      // Single date
      const day = new Date(from);
      const nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);

      where.createdAt = {
        [Op.gte]: day,
        [Op.lt]: nextDay
      };
    }
    const {count, rows} = await DB.ActivityLog.findAndCountAll({
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      where,
      limit
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
