// @ts-check
import {DB} from '../database';

export class ActivityLogService {
  static async createLog(data) {
    const log = await DB.ActivityLog.create(data);
    return log;
  }
  static async getLogs() {
    const logs = await DB.ActivityLog.findAll();
    return logs;
  }
}
