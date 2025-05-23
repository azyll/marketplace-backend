//@ts-check

import {Op} from 'sequelize';
import {DB} from '../database/index.js';
import {NotFoundException} from '../exceptions/notFound.js';
import {AlreadyExistException} from '../exceptions/alreadyExist.js';
import {calculateStockCondition} from '../utils/stock-helper.js';
import fs from 'node:fs/promises';
import {SupabaseService} from './supabase.service.js';
const {Product, Program, ProductVariant, ProductAttribute} = DB;

/**
 * @typedef {import ('../types/index.js').PaginatedResponse<Product>} ProductResponse
 * @typedef {import ('../types/index.js').QueryParams} QueryParams
 */

export class ProductService {
  /**
   * TODO: Add create notification and  log
   */

  /**
   * @param {{name:string, description:string, image:string,
   *  type:'Upper Wear'| 'Lower Wear'| 'Non-wearable', category:'Uniform'|'Proware'|'Stationery'|'Accessory', programId:string, variants:{
   *  name:string,
   *  productAttributeId:string,
   *  size:string,
   *  price:number,
   *  stockQuantity:number
   * }[]}} newProduct - New Product
   * @returns {Promise<Product>} Product data from the database
   * @throws {NotFoundException} If Program does not exists
   * @throws {AlreadyExistException} if Product is already existing
   */
  static async createProduct(newProduct) {
    const {category, description, image, name, programId, type, variants} = newProduct;

    const program = await Program.findByPk(programId);
    if (!program) {
      throw new NotFoundException('Program not found', 404);
    }

    const productVariantWithStockCondition = variants.map((variant) => ({
      ...variant,
      stockCondition: calculateStockCondition(variant.stockQuantity)
    }));

    const [product, isJustCreated] = await Product.findOrCreate({
      where: {name},
      defaults: {
        name,
        description,
        image,
        type,
        category,
        programId,
        ProductVariants: productVariantWithStockCondition
      },
      include: [
        {
          model: ProductVariant,
          include: [ProductAttribute]
        }
      ]
    });

    if (!isJustCreated) {
      throw new AlreadyExistException('Product is already exists');
    }
    const fileBuffer = await fs.readFile(`./uploads/images/products/${image}`);
    await SupabaseService.uploadFile(fileBuffer, image);

    // @ts-ignore

    return product;
  }

  /**
   * Get All Products
   * @param {QueryParams} query Query
   * @param {boolean} raw  - raw  (if true, product variants have own column)
   * @returns {Promise<ProductResponse>} All products
   */
  static async getProducts(query, raw = false) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const {count, rows: productData} = await Product.findAndCountAll({
      include: [
        {
          model: ProductVariant,
          include: [ProductAttribute]
        }
      ],
      distinct: true,
      raw,
      nest: raw
    });

    return {
      data: productData,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: count
      }
    };
  }
  /**
   * Get All Products by Program
   * @param {string} programId
   * @param {QueryParams} query
   * @throws {NotFoundException}  Program not found
   * @returns {Promise<ProductResponse>} All products filtered by program
   */
  static async getProductsByProgram(programId, query) {
    const program = await Program.findByPk(programId);
    if (!program) throw new NotFoundException('Program not found', 404);

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const {count, rows: productData} = await Product.findAndCountAll({
      where: {
        programId
      },
      include: [
        {
          model: ProductVariant,
          include: [ProductAttribute]
        }
      ]
    });
    return {
      data: productData,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: count
      }
    };
  }

  /**
   * Get a single Product
   * @param {string} id - Product Id
   * @returns {Promise<Product>} get a product and its variants
   * @throws {NotFoundException} Product not found
   */
  static async getProduct(id) {
    const product = await Product.findOne({
      include: [
        {
          model: ProductVariant,
          include: [ProductAttribute]
        }
      ],
      where: {
        id,
        deletedAt: {[Op.is]: null}
      }
    });
    if (!product) throw new NotFoundException('Product not found', 404);
    return product;
  }
  /**
   * Archive Product
   * @param {string} productId
   */
  static async archiveProduct(productId) {}

  /**
   *
   * @param {string} productId
   * @param {object} newProduct
   * @returns {Promise<Product>}
   * @throws {NotFoundException}
   * @throws {AlreadyExistException} For Duplication of product
   */
  static async updateProduct(productId, newProduct) {
    return;
  }

  /**
   * Create Product attribute
   * @param {string} name
   * @throws {AlreadyExistException} if attribute already exists
   */
  static async createAttribute(name) {
    const [productAttribute, isJustCreated] = await ProductAttribute.findOrCreate({
      where: {
        name: name.toLowerCase()
      },
      defaults: {
        name: name.toLowerCase()
      }
    });

    if (!isJustCreated) {
      throw new AlreadyExistException('Attribute already exists');
    }
    return productAttribute;
  }
  /**
   * Get all Product Attributes
   * @returns {Promise<ProductAttribute[]>}
   */
  static async getAttributes() {
    const productAttributes = await ProductAttribute.findAll();
    return productAttributes;
  }
}
