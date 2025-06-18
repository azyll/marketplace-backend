// @ts-check
import {DB} from '../database/index.js';

export class ActivityLogService {
  /**
   * @typedef {import('../types/index.js').TLog} TLog
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
  static async getLogs() {
    const logs = await DB.ActivityLog.findAll({
      order: [['createdAt', 'DESC']]
    });
    return logs;
  }
}
