// @ts-check
import {DB} from '../database/index.js';

export class ActivityLogService {
  /**
   * @typedef {import('../types/index.js').TLog} TLog
   */

  /**
   *
   * @param {String} title
   * @param {String} message
   * @param {TLog} type
   * @returns
   */
  static async createLog(title, message, type) {
    const log = await DB.ActivityLog.create({
      title,
      message,
      type
    });
    return log;
  }
  static async getLogs() {
    const logs = await DB.ActivityLog.findAll();
    return logs;
  }
}
