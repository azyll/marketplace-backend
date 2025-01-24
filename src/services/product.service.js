import { DB } from "../database/index.js";

export class ProductService {
  static async createProduct(product) {
    const result = DB.Product.create(product);
    return result;
  }
  static async getProducts() {
    const result = DB.Product.findAll();
    return result;
  }
}
