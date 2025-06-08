//@ts-check

import {col, fn, Op, where} from 'sequelize';
import {DB} from '../database/index.js';
import {NotFoundException} from '../exceptions/notFound.js';
import {AlreadyExistException} from '../exceptions/alreadyExist.js';
import {calculateStockCondition} from '../utils/stock-helper.js';
import fs from 'node:fs/promises';
import {SupabaseService} from './supabase.service.js';
import {NotificationService} from './notification.service.js';
const {Product, Department, ProductVariant, ProductAttribute} = DB;

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
   *  type:'Upper Wear'| 'Lower Wear'| 'Non-wearable', category:'Uniform'|'Proware'|'Stationery'|'Accessory', departmentId:string, variants:{
   *  name:string,
   *  productAttributeId:string,
   *  size:string,
   *  price:number,
   *  stockQuantity:number
   * }[]}} newProduct - New Product
   * @returns {Promise<Product>} Product data from the database
   * @throws {NotFoundException} If Department does not exists
   * @throws {AlreadyExistException} if Product is already existing
   */
  static async createProduct(newProduct) {
    const {category, description, image, name, departmentId, type, variants} = newProduct;

    const department = await Department.findByPk(departmentId);
    if (!department) {
      throw new NotFoundException('Department not found', 404);
    }

    const productVariantWithStockCondition = variants.map((variant) => {
      if (!variant.name || !variant.price || !variant.productAttributeId || !variant.size || !variant.stockQuantity) {
        throw new Error('Invalid credential');
      }
      return {
        ...variant,
        stockCondition: calculateStockCondition(variant.stockQuantity)
      };
    });

    const [product, isJustCreated] = await Product.findOrCreate({
      where: {name},
      defaults: {
        name,
        description,
        image,
        type,
        category,
        departmentId,
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

    await NotificationService.createNotification(
      'New Product Added',
      `New Product added for ${department.name}`,
      'announcement',
      department.name === 'Proware' ? 'students' : 'department students',
      {
        departmentId: departmentId,
        userId: null
      }
    );

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
   * Get All Products by Department
   * @param {string} departmentId
   * @param {QueryParams} query
   * @throws {NotFoundException}  Department not found
   * @returns {Promise<ProductResponse>} All products filtered by department
   */
  static async getProductsByDepartment(departmentId, query) {
    const department = await Department.findByPk(departmentId);
    if (!department) throw new NotFoundException('Department not found', 404);

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const {count, rows: productData} = await Product.findAndCountAll({
      where: {
        departmentId
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
   * @param {string} slug - Product slug
   * @returns {Promise<Product>} get a product and its variants
   * @throws {NotFoundException} Product not found
   */
  static async getProduct(slug) {
    const product = await Product.findOne({
      include: [
        {
          model: ProductVariant,
          include: [ProductAttribute]
        }
      ],
      where: where(fn('LOWER', col('name')), slug.replace(/-/g, ' '))
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
