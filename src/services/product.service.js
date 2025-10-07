//@ts-check

import {cast, col, fn, Op, where} from 'sequelize';
import {DB} from '../database/index.js';
import {NotFoundException} from '../exceptions/notFound.js';
import {AlreadyExistException} from '../exceptions/alreadyExist.js';
import {calculateStockCondition} from '../utils/stock-helper.js';
import {NotificationService} from './notification.service.js';
import {validate} from 'uuid';
import {convertFromSlug, hasInvalidSlugCharacters} from '../utils/slug-helper.js';
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
   *  type:'Upper Wear'| 'Lower Wear'| 'Non-wearable', level?:string, category:'Uniform'|'Proware'|'Stationery'|'Accessory', departmentId:string, variants:{
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
    const {category, description, image, name, departmentId, type, variants, level} = newProduct;

    if (hasInvalidSlugCharacters(name)) {
      throw new Error('Name contains invalid characters. Please use only letters, numbers, and spaces.');
    }
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
          level: level ? level : department.level,
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
   *     program?:string,
   *      paranoid:boolean
   *   }} query Query
   *
   *
   * @returns {Promise<ProductResponse>} All products
   */
  static async getProducts(query) {
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;
    const whereClause = {};

    // Category filter
    if (query?.category) {
      whereClause.category = where(cast(col('category'), 'TEXT'), {
        [Op.iLike]: `%${query.category}%`
      });
    }

    // Search filter (searches name and description)
    if (query?.search?.trim()) {
      const searchTerm = convertFromSlug(query.search.trim());

      whereClause[Op.or] = [{name: {[Op.iLike]: `%${searchTerm}%`}}, {description: {[Op.iLike]: `%${searchTerm}%`}}];
    } else if (query?.name) {
      whereClause.name = {[Op.iLike]: `%${convertFromSlug(query.name)}%`};
    }

    // Program-based department filter
    if (query.program) {
      const program = await DB.Program.findOne({
        where: {
          [Op.or]: [{acronym: {[Op.iLike]: `%${query.program}%`}}, {name: {[Op.iLike]: `%${query.program}%`}}]
        },
        include: [{model: DB.Department, as: 'department'}]
      });

      if (!program) {
        return {
          data: [],
          meta: {
            currentPage: page,
            itemsPerPage: limit,
            totalItems: 0
          }
        };
      }

      const departments = await DB.Department.findAll({
        where: {
          [Op.or]: [{name: 'Proware'}, {id: program.departmentId}]
        }
      });

      if (departments.length === 0) {
        return {
          data: [],
          meta: {
            currentPage: page,
            itemsPerPage: limit,
            totalItems: 0
          }
        };
      }

      const departmentMap = {};
      departments.forEach((dep) => {
        departmentMap[dep.name] = {id: dep.id, level: dep.level};
      });

      const isProware = query.department === 'Proware';
      if (isProware) {
        whereClause.departmentId = {[Op.eq]: departmentMap['Proware'].id};
      } else {
        const requestedId = departmentMap[program.department.name].id;
        const prowareId = departmentMap['Proware'].id;

        whereClause.departmentId = {[Op.or]: [requestedId, prowareId]};
        whereClause.level = {[Op.or]: [departmentMap[program.department.name].level, 'all']};
      }
    }

    // Direct department filter
    if (query.department) {
      const departments = await DB.Department.findAll({
        where: {
          [Op.or]: [
            {name: {[Op.eq]: query.department}},
            {acronym: {[Op.eq]: query.department}},
            {name: {[Op.eq]: 'Proware'}},
            {acronym: {[Op.eq]: 'Proware'}}
          ]
        }
      });

      if (departments.length === 0) {
        return {
          data: [],
          meta: {
            currentPage: page,
            itemsPerPage: limit,
            totalItems: 0
          }
        };
      }
      const departmentMap = {};
      departments.forEach((dep) => {
        const key = query.department?.length > 8 ? dep.name : dep.acronym;
        departmentMap[key] = {id: dep.id, level: dep.level, acronym: dep.acronym};
      });

      const isProware = query.department === 'Proware';
      const prowareId = departmentMap['Proware']?.id || departmentMap['proware']?.id;

      if (isProware) {
        whereClause.departmentId = {[Op.eq]: prowareId};
      } else {
        const requestedId = departmentMap[query.department].id;

        if (!requestedId) throw new Error(`Department '${query.department}' not found`);

        whereClause.departmentId = {[Op.or]: [requestedId, prowareId]};
        whereClause.level = {[Op.or]: [departmentMap[query.department].level, 'all']};
      }
    }

    const {count, rows: productData} = await Product.findAndCountAll({
      where: whereClause,
      paranoid: (query.paranoid || 'true') == 'true' ? true : false,
      include: [
        {
          model: ProductVariant,
          include: [{model: ProductAttribute, as: 'productAttribute'}],
          as: 'productVariant',
          where:
            query.sex ?
              {
                name: {[Op.notILike]: `${query.sex === 'female' ? 'Male' : 'Female'}`}
              }
            : {}
        },
        {
          model: Department,
          as: 'department'
        }
      ],
      distinct: true,

      order: [
        query?.latest ? ['createdAt', 'DESC'] : ['name', 'ASC'],
        ['productVariant', 'name', 'ASC'],
        ['productVariant', 'size', 'ASC']
      ],

      offset: (page - 1) * limit,
      limit
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
   * Get All Products
   * @param { QueryParams&{
   *     category?: string,
   *     name?: string,
   *     search?: string,  // Add this new parameter
   *     department?: string,
   *     latest?: boolean,
   *     program?:string,
   *      paranoid:boolean
   *   }} query Query
   *
   *
   * @returns {Promise<ProductResponse>} All products
   */
  static async getInventory(query) {
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;
    const whereClause = {};

    // Category filter
    if (query?.category) {
      whereClause.category = where(cast(col('category'), 'TEXT'), {
        [Op.iLike]: `%${query.category}%`
      });
    }

    // Search filter (searches name and description)
    if (query?.search?.trim()) {
      const searchTerm = convertFromSlug(query.search.trim());

      whereClause[Op.or] = [{name: {[Op.iLike]: `%${searchTerm}%`}}, {description: {[Op.iLike]: `%${searchTerm}%`}}];
    } else if (query?.name) {
      whereClause.name = {[Op.iLike]: `%${convertFromSlug(query.name)}%`};
    }

    // Program-based department filter
    if (query.program) {
      const program = await DB.Program.findOne({
        where: {
          [Op.or]: [{acronym: {[Op.iLike]: `%${query.program}%`}}, {name: {[Op.iLike]: `%${query.program}%`}}]
        },
        include: [{model: DB.Department, as: 'department'}]
      });

      if (!program) {
        return {
          data: [],
          meta: {
            currentPage: page,
            itemsPerPage: limit,
            totalItems: 0
          }
        };
      }

      const departments = await DB.Department.findByPk(program.departmentId);

      if (!departments) {
        return {
          data: [],
          meta: {
            currentPage: page,
            itemsPerPage: limit,
            totalItems: 0
          }
        };
      }
      whereClause.departmentId = program.departmentId;
      whereClause.level = departments.level;
    }

    // Direct department filter
    if (query.department) {
      const departments = await DB.Department.findOne({
        where: {
          [Op.or]: [{name: {[Op.eq]: query.department}}, {acronym: {[Op.eq]: query.department}}]
        }
      });

      if (!departments) {
        return {
          data: [],
          meta: {
            currentPage: page,
            itemsPerPage: limit,
            totalItems: 0
          }
        };
      }
      whereClause.departmentId = departments.id;
      whereClause.level = departments.level;
    }

    const {count, rows: inventoryData} = await ProductVariant.findAndCountAll({
      where:
        query.sex ?
          {
            name: {[Op.notILike]: `${query.sex === 'female' ? 'Male' : 'Female'}`}
          }
        : {},

      order: [
        query?.latest ? ['product', 'createdAt', 'DESC'] : ['name', 'ASC'],
        ['product', 'name', 'ASC'],
        ['name', 'ASC'],
        ['size', 'ASC']
      ],

      offset: (page - 1) * limit,
      limit,
      include: [
        {model: ProductAttribute, as: 'productAttribute'},
        {
          model: Product,
          as: 'product',
          where: whereClause,
          include: [
            {
              model: Department,
              as: 'department'
            }
          ]
        }
      ]
    });

    return {
      data: inventoryData,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: count
      }
    };
  }
  static async getProductsInInventory() {}

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
      ],
      order: [
        ['name', 'ASC'],
        ['productVariant', 'name', 'ASC'],
        ['productVariant', 'size', 'ASC']
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
  static async archiveProduct(productId) {
    const product = await Product.findByPk(productId, {
      paranoid: false
    });
    if (!product) throw new NotFoundException('Product not found');

    if (product.deletedAt !== null) throw new NotFoundException('Product is already archived');
    return await product.destroy();
  }
  /**
   * Restore Product
   * @param {string} productId
   */
  static async restoreProduct(productId) {
    const product = await Product.findByPk(productId, {
      paranoid: false
    });
    if (!product) throw new NotFoundException('Product not found');

    if (product.deletedAt === null) throw new NotFoundException('Product is not archived');
    return await product.restore();
  }
  /**
   *
   * @param {string} productId
   * @param {object} newProduct
   * @returns {Promise<Product>}
   * @throws {NotFoundException}
   * @throws {AlreadyExistException} For Duplication of product
   */
  static async updateProduct(productId, newProduct) {
    const {category, description, image, name, departmentId, type, variants} = newProduct;

    const product = await Product.findByPk(productId, {
      include: [
        {
          model: ProductVariant,
          as: 'productVariant'
        }
      ]
    });

    if (!product) throw new NotFoundException('Product not found');

    const department = await Department.findByPk(departmentId);
    if (!department) {
      throw new NotFoundException('Department not found');
    }
    // Check for duplicate name (excluding current product)
    const existingProduct = await Product.findOne({
      where: {
        name,
        id: {
          [Op.ne]: productId
        }
      }
    });

    if (existingProduct) {
      throw new AlreadyExistException('Product with this name already exists');
    }
    const productVariantWithStockCondition = variants.map((variant) => {
      if (!variant.name || !variant.price || !variant.productAttributeId || !variant.size || !variant.stockQuantity) {
        throw new Error('Invalid variant credentials');
      }
      return {
        ...variant,
        stockCondition: calculateStockCondition(variant.stockQuantity)
      };
    });
    const updatedProduct = await sequelize.transaction(async (transaction) => {
      // Update product fields
      await product.update(
        {
          name,
          description,
          image,
          type,
          category,
          departmentId
        },
        {transaction}
      );

      // Optionally delete old variants and recreate them (if your logic requires replacement)
      await ProductVariant.destroy({
        where: {productId},
        transaction
      });

      const newVariants = await Promise.all(
        productVariantWithStockCondition.map((variant) =>
          ProductVariant.create(
            {
              ...variant,
              productId
            },
            {transaction}
          )
        )
      );

      // Optionally send a notification
      await NotificationService.createNotification(
        'Product Updated',
        `Product "${product.name}" was updated in ${department.name}`,
        'announcement',
        department.name === 'Proware' ? 'students' : 'department students',
        {
          departmentId,
          userId: null
        }
      );

      // Reload updated product with relations
      await product.reload({
        include: [
          {
            model: ProductVariant,
            as: 'productVariant',
            include: [{model: ProductAttribute, as: 'productAttribute'}]
          }
        ],
        transaction
      });

      return product;
    });

    return updatedProduct;
  }

  /**
   *
   * @param {string} productId
   * @param {string} productVariantId
   * @param {number} newStock
   * @param {'add'|'minus'} action
   * @returns {Promise<Product>}
   * @throws {NotFoundException} Product not found
   */
  static async updateProductStock(productId, productVariantId, newStock, action) {
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

    await sequelize.transaction(async (transaction) => {
      const variant = product.productVariant?.[0];
      if (!variant) throw new NotFoundException('Product Variant not found', 404);

      let stockQuantity = variant.stockQuantity;

      if (action == 'minus') {
        stockQuantity -= newStock;
      } else {
        stockQuantity += newStock;
      }
      if (stockQuantity < 0) {
        throw new Error('Insufficient stock: the resulting quantity cannot be negative. Please enter a valid value.');
      }
      const resetStockValue = 50;
      if (action == 'add' && newStock >= resetStockValue) {
        await DB.StudentProductCount.update(
          {
            count: 0
          },
          {
            where: {
              productVariantId: variant.id
            },
            transaction
          }
        );
      }
      variant.stockQuantity = stockQuantity;
      const newStockCondition = variant.stockAvailable + stockQuantity;
      variant.stockCondition = calculateStockCondition(newStockCondition);

      await variant.save({transaction});

      await NotificationService.createNotificationForInventoryStockUpdate(
        'Product Stock Update',
        `New Product Stock for ${product.name} new stock is ${newStock}, buy it now before it ran out-of-stock`,
        variant.id
      );
    });

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
