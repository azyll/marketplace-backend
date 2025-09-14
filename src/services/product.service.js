//@ts-check

import {cast, col, fn, Op, where} from 'sequelize';
import {DB} from '../database/index.js';
import {NotFoundException} from '../exceptions/notFound.js';
import {AlreadyExistException} from '../exceptions/alreadyExist.js';
import {calculateStockCondition} from '../utils/stock-helper.js';
import fs from 'node:fs/promises';
import {SupabaseService} from './supabase.service.js';
import {NotificationService} from './notification.service.js';
import {validate} from 'uuid';
import {convertFromSlug} from '../utils/slug-helper.js';
import sequelize from '../database/config/sequelize.js';
const {Product, Department, ProductVariant, ProductAttribute, User, Student, Program} = DB;

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
   *  stockAvailable:number
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
      if (!variant.name || !variant.price || !variant.productAttributeId || !variant.size || !variant.stockAvailable) {
        throw new Error('Invalid credential');
      }
      return {
        ...variant,
        stockCondition: calculateStockCondition(variant.stockAvailable)
      };
    });
    const createdProduct = await sequelize.transaction(async (transaction) => {
      const [product, isJustCreated] = await Product.findOrCreate({
        where: {name},
        defaults: {
          name,
          description,
          image,
          type,
          category,
          departmentId,
          productVariant: productVariantWithStockCondition
        },
        include: [
          {
            model: ProductVariant,
            as: 'productVariant',
            include: [{model: ProductAttribute, as: 'productAttribute'}]
          }
        ],
        transaction
      });

      if (!isJustCreated) {
        throw new AlreadyExistException('Product is already exists');
      }
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
    });
    return createdProduct;
  }

  /**
   * Get All Products
   * @param { QueryParams&{
   *     category?: string,
   *     name?: string,
   *     search?: string,  // Add this new parameter
   *     department?: string,
   *     latest?: boolean,
   *     program?:string
   *      raw?: boolean
   *   }} query Query
   *
   *
   * raw - if true product variants have own columns
   * @returns {Promise<ProductResponse>} All products
   */
  static async getProducts(query) {
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;
    const whereClause = {};

    if (query?.category) {
      whereClause.category = where(cast(col('category'), 'TEXT'), {
        [Op.iLike]: `%${query.category}%`
      });
    }

    // Update this section to handle both 'name' and 'search' parameters
    if (query?.name) {
      whereClause.name = {[Op.iLike]: `%${convertFromSlug(query.name)}%`};
    }

    // Add search functionality that searches across name and description
    if (query?.search && query.search.trim()) {
      const searchTerm = convertFromSlug(query.search.trim());
      whereClause[Op.or] = [
        {
          name: {[Op.iLike]: `%${searchTerm}%`}
        },
        {
          description: {[Op.iLike]: `%${searchTerm}%`}
        }
      ];
    }

    // Rest of your existing code remains the same...
    if (query.program) {
      // ... existing program logic
    }

    if (query.department) {
      // ... existing department logic
    }

    let raw = query.raw ? true : false;

    const {count, rows: productData} = await Product.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: ProductVariant,
          include: [{model: ProductAttribute, as: 'productAttribute'}],
          as: 'productVariant',
          where:
            query.sex ?
              {
                name: {
                  [Op.notILike]: `${query.sex === 'female' ? 'Male' : 'Female'}`
                }
              }
            : {}
        },
        {
          model: Department,
          as: 'department'
        }
      ],
      distinct: true,
      raw,
      nest: raw,
      order: [
        query?.latest ? ['createdAt', 'DESC'] : ['name', 'ASC'],
        ['productVariant', 'name', 'ASC'],
        ['productVariant', 'size', 'ASC']
      ],
      ...(!raw && {
        offset: (page - 1) * limit,
        limit
      })
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
   * @param {string} userId
 
   * @throws {NotFoundException}  Department not found
   * @returns {Promise<{data:Product[]}>} All products filtered by department
   */
  static async getProductsByStudentDepartment(userId) {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Student,
          as: 'student',
          include: [
            {
              model: Program,
              as: 'program',
              include: [
                {
                  model: Department,
                  as: 'department'
                }
              ]
            }
          ]
        }
      ]
    });

    if (!user) throw new NotFoundException('Student not found', 404);

    const departmentId = user?.student?.program?.department?.id;
    if (!departmentId) throw new NotFoundException('Department not found', 404);

    const products = await Product.findAll({
      where: {
        departmentId: departmentId
      },
      include: [
        {
          model: ProductVariant,
          as: 'productVariant',
          include: [
            {
              model: ProductAttribute,
              as: 'productAttribute'
            }
          ]
        },
        {
          model: Department,
          as: 'department'
        }
      ]
    });

    return products;
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
          include: [{model: ProductAttribute, as: 'productAttribute'}],
          as: 'productVariant'
        },
        {
          model: Department,
          as: 'department'
        }
      ],
      where: {
        name: {
          [Op.iLike]: `%${slug}%`
        }
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
   *
   * @param {string} productId
   * @param {string} productVariantId
   * @param {number} newStock
   * @returns {Promise<Product>}
   * @throws {NotFoundException} Product not found
   */
  static async updateProductStock(productId, productVariantId, newStock) {
    if (!validate(productId) || !validate(productVariantId)) {
      throw new NotFoundException('Product not found', 404);
    }

    const product = await Product.findByPk(productId, {
      include: [
        {
          model: ProductVariant,
          as: 'productVariant',
          include: [
            {
              model: ProductAttribute,
              as: 'productAttribute'
            }
          ],
          where: {
            id: productVariantId
          }
        },
        {
          model: Department,
          as: 'department'
        }
      ]
    });

    if (!product) throw new NotFoundException('Product not found', 404);

    // Adjusted to match alias if needed (see note below)
    const variant = product.productVariant?.[0];
    if (!variant) throw new NotFoundException('Product Variant not found', 404);

    if (newStock === variant.stockAvailable) {
      return product;
    }

    variant.stockAvailable = newStock;
    variant.stockCondition = calculateStockCondition(newStock);

    await variant.save();
    await NotificationService.createNotificationForInventoryStockUpdate(
      'Product Stock Update',
      `New Product Stock for ${product.name} new stock is ${newStock}, buy it now before it ran out-of-stock`,
      variant.id
    );

    return product;
  }

  /**
   * Create Product attribute
   * @param {string} name
   * @throws {AlreadyExistException} if attribute already exists
   */
  static async createAttribute(name) {
    const [productAttribute, isJustCreated] = await ProductAttribute.findOrCreate({
      where: {
        name: name
      },
      defaults: {
        name: name
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

  static async getProductsByProductCondition() {
    const products = await Product.findAll({
      include: [
        {
          model: ProductVariant,
          as: 'productVariant',
          where: {
            stockCondition: {
              [Op.between]: ['out-of-stock', 'low-stock']
            }
          }
        }
      ]
    });

    return products;
  }
}
