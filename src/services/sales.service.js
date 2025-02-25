import { DB } from "../database";

export class SalesService {
  static async createSales(sales) {
    const result = await DB.Sales.create(sales);
    return result;
  }
  static async getSales() {}
  static async getSale() {}
  static async updateSales(sales) {}
}
