import { DB } from "../database";

export class ActivityLogService {
  static async createLog(data) {
    const result = DB.ActivityLog.create(data);
    return result;
  }
  static async getLogs() {
    const result = DB.ActivityLog.findAll();
    return result;
  }
}
