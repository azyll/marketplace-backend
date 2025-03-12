import { DB } from "../database";

export class SalesService {
  static async createSales(sales) {
    const sales = await DB.Sales.create(sales);
    return sales;
  }
  static async getSales() {
    const sales = await DB.Sales.findAll({
      include: DB.Order,
    });
    return sales;
  }
}
