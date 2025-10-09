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
   * type?: 'user'| 'system'| 'inventory'| 'sales'| 'order'
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
