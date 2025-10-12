//@ts-check

import {cast, col, fn, Op, Transaction, where} from 'sequelize';
import {DB} from '../database/index.js';
import {NotFoundException} from '../exceptions/notFound.js';
import {AlreadyExistException} from '../exceptions/alreadyExist.js';
import {calculateStockCondition} from '../utils/stock-helper.js';
import {NotificationService} from './notification.service.js';
import {validate} from 'uuid';
import {convertFromSlug, hasInvalidSlugCharacters} from '../utils/slug-helper.js';
import sequelize from '../database/config/sequelize.js';
import {ActivityLogService} from './activity-log.service.js';
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
    if (variants.length <= 0) {
      throw new Error('Variant is required');
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
      const [newProduct, isJustCreated] = await Product.findOrCreate({
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
            as: 'productVariant'
          }
        ],
        transaction
      });

      if (!isJustCreated) {
        throw new AlreadyExistException('Product is already exists');
      }

      const product = await Product.findByPk(newProduct.id, {
        include: [
          {
            model: ProductVariant,
            as: 'productVariant',
            include: [{model: ProductAttribute, as: 'productAttribute'}]
          }
        ],
        transaction
      });

      await NotificationService.createNotification(
        `New Product Created: ${product.name}`,
        `A new product has been added to the ${department.name} department.\n\nVariants:\n${product.productVariant
          .map(
            (variant) =>
              ` • ${variant.productAttribute.name} ${variant.name} (${variant.size}) - Price: ${variant.price}, Stock: ${variant.stockAvailable}`
          )
          .join('\n')}`,
        'announcement',
        department.name === 'Proware' ? 'students' : 'department students',
        {
          departmentId: departmentId,
          userId: null
        }
      );

      await ActivityLogService.createLog(
        `New product created: ${product.name}`,
        `The product "${product.name}" was created and assigned to the ${department.name} department with the following variants:\n${product.productVariant
          .map(
            (variant) =>
              `•  ${variant.productAttribute.name} ${variant.name} (${variant.size}) - Price: ${variant.price}, Stock: ${variant.stockAvailable}`
          )
          .join('\n')}`,
        'system'
      );
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

      if (departments.length < 2) {
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

      if (departments.length < 2) {
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
      raw: false,
      nest: false,
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

    const {count, rows: inventoryData} = await Product.findAndCountAll({
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
      raw: false,
      nest: false,
      order: [
        query?.latest ? ['createdAt', 'DESC'] : ['name', 'ASC'],
        ['productVariant', 'name', 'ASC'],
        ['productVariant', 'size', 'ASC']
      ],
      offset: (page - 1) * limit,
      limit
    });
    const formatCurrency = (value) => `₱${value.toLocaleString(undefined, {minimumFractionDigits: 2})}`;

    const result = [];

    for (const product of inventoryData) {
      const sizeMap = {};
      let productTotal = 0;

      for (const variant of product.productVariant) {
        const {size, price, stockQuantity} = variant;
        const total = price * stockQuantity;

        if (!sizeMap[size]) {
          sizeMap[size] = {
            price,
            quantity: 0,
            totalValue: 0
          };
        }

        sizeMap[size].quantity += stockQuantity;
        sizeMap[size].totalValue += total;

        productTotal += total;
      }

      const productOutput = {
        productName: product.name,
        variants: [],
        totalValue: productTotal
      };

      for (const [size, data] of Object.entries(sizeMap)) {
        productOutput.variants.push({
          size,
          price: formatCurrency(data.price),
          quantity: data.quantity,
          total: formatCurrency(data.totalValue)
        });
      }

      result.push(productOutput);
    }
    return {
      data: inventoryData,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: count,
        inventoryValue: result
      }
    };
  }

  static async getInventoryValue() {
    const {rows: inventoryData} = await Product.findAndCountAll({
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
      ]
    });
    const formatCurrency = (value) => `₱${value.toLocaleString(undefined, {minimumFractionDigits: 2})}`;

    const result = [];

    for (const product of inventoryData) {
      const sizeMap = {};
      let productTotal = 0;

      for (const variant of product.productVariant) {
        const {size, price, stockQuantity} = variant;
        const total = price * stockQuantity;

        if (!sizeMap[size]) {
          sizeMap[size] = {
            price,
            quantity: 0,
            totalValue: 0
          };
        }

        sizeMap[size].quantity += stockQuantity;
        sizeMap[size].totalValue += total;

        productTotal += total;
      }

      const productOutput = {
        productName: product.name,
        variants: [],
        totalValue: productTotal
      };

      for (const [size, data] of Object.entries(sizeMap)) {
        productOutput.variants.push({
          size,
          price: formatCurrency(data.price),
          quantity: data.quantity,
          total: formatCurrency(data.totalValue)
        });
      }

      result.push(productOutput);
    }
    return {
      data: result
    };
  }
  static async getInventoryAlerts() {
    const {count: noStockCount} = await ProductVariant.findAndCountAll({
      where: {
        stockCondition: 'out-of-stock'
      }
    });
    const {count: lowStockCount} = await ProductVariant.findAndCountAll({
      where: {
        stockCondition: 'low-stock'
      }
    });
    const {count: inStockCount} = await ProductVariant.findAndCountAll({
      where: {
        stockCondition: 'in-stock'
      }
    });
    return [
      {value: noStockCount, label: 'No Stock'},
      {value: lowStockCount, label: 'Low Stock'},
      {value: inStockCount, label: 'In Stock'}
    ];
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
    return await sequelize.transaction(async (transaction) => {
      const product = await Product.findByPk(productId, {
        paranoid: false,
        include: [
          {
            model: DB.ProductVariant,
            as: 'productVariant'
          },
          {
            model: DB.Department,
            as: 'department'
          }
        ],
        transaction
      });

      if (!product) throw new NotFoundException('Product not found');

      if (product.deletedAt !== null) throw new NotFoundException('Product is already archived');

      // Archive the product
      await product.destroy({transaction});

      // Send notification about the archive
      await NotificationService.createNotification(
        `Product Archived: ${product.name}`,
        `The product "${product.name}" from the ${product.department.name} department has been archived.\n\nVariants:\n${product.productVariant
          .map(
            (variant) =>
              `• ${variant.name} (${variant.size}) - Price: ${variant.price}, Stock: ${variant.stockAvailable}`
          )
          .join('\n')}`,
        'announcement',
        product.department.name === 'Proware' ? 'students' : 'department students',
        {
          departmentId: product.departmentId,
          userId: null
        }
      );

      // Log the archive activity
      await ActivityLogService.createLog(
        `Product archived: ${product.name}`,
        `The product "${product.name}" from the ${product.department.name} department was archived.\n\nArchived Variants:\n${product.productVariant
          .map(
            (variant) =>
              `• ${variant.name} (${variant.size}) - Price: ${variant.price}, Stock: ${variant.stockAvailable}`
          )
          .join('\n')}`,
        'system'
      );

      return product;
    });
  }

  /**
   * Restore Product
   * @param {string} productId
   */
  static async restoreProduct(productId) {
    return await sequelize.transaction(async (transaction) => {
      const product = await Product.findByPk(productId, {
        paranoid: false,
        include: [
          {
            model: DB.ProductVariant,
            as: 'productVariant'
          },
          {
            model: DB.Department,
            as: 'department'
          }
        ],
        transaction
      });

      if (!product) throw new NotFoundException('Product not found');

      if (product.deletedAt === null) throw new NotFoundException('Product is not archived');

      // Restore the product
      await product.restore({transaction});

      // Send notification to relevant users
      await NotificationService.createNotification(
        `Product Restored: ${product.name}`,
        `The product "${product.name}" has been restored to the ${product.department.name} department.\n\nVariants:\n${product.productVariant
          .map(
            (variant) =>
              `• ${variant.name} (${variant.size}) - Price: ${variant.price}, Stock: ${variant.stockAvailable}`
          )
          .join('\n')}`,
        'announcement',
        product.department.name === 'Proware' ? 'students' : 'department students',
        {
          departmentId: product.departmentId,
          userId: null
        }
      );

      // Log the restore action
      await ActivityLogService.createLog(
        `Product restored: ${product.name}`,
        `The product "${product.name}" has been restored to the ${product.department.name} department with the following variants:\n${product.productVariant
          .map(
            (variant) =>
              `• ${variant.name} (${variant.size}) - Price: ${variant.price}, Stock: ${variant.stockAvailable}`
          )
          .join('\n')}`,
        'system'
      );

      return product;
    });
  }

  /**
   *
   * @param {string} productId
   * @param {{name:string, description:string, image:string,
   *  type:'Upper Wear'| 'Lower Wear'| 'Non-wearable', level?:string, category:'Uniform'|'Proware'|'Stationery'|'Accessory', departmentId:string, variants:{
   *  id:string,
   *  name:string,
   *  productAttributeId:string,
   *  size:string,
   *  price:number,
   *  stockQuantity:number
   * }[]}} newProduct - New Product
   * @returns {Promise<Transaction>}
   * @throws {NotFoundException}
   * @throws {AlreadyExistException} For Duplication of product
   */
  static async updateProduct(productId, newProduct) {
    const {category, description, image, name, departmentId, type, level, variants} = newProduct;

    if (hasInvalidSlugCharacters(name)) {
      throw new Error('Name contains invalid characters. Please use only letters, numbers, and spaces.');
    }
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
    if (variants.length <= 0) {
      throw new Error('Variant is required');
    }

    /**
     * @type {string[]}
     */
    const newVariantIds = [];
    const productVariantWithStockCondition = variants.map((variant) => {
      if (!variant.name) {
        throw new Error(`Variant  is missing 'name'`);
      }
      if (variant.price == null || isNaN(variant.price)) {
        throw new Error(`Variant  has an invalid or missing 'price'`);
      }
      if (!variant.productAttributeId) {
        throw new Error(`Variant is missing 'productAttributeId'`);
      }
      if (!variant.size) {
        throw new Error(`Variant is missing 'size'`);
      }
      if (variant.stockQuantity == null || isNaN(variant.stockQuantity)) {
        throw new Error(`Variant has an invalid or missing 'stockQuantity'`);
      }
      if (!level) {
        throw new Error(`Product is missing required 'level'`);
      }
      if (isNaN(variant.id)) {
        newVariantIds.push(variant.id);
      }
      // !TODO: Fix variant calculate stock condition, it should be stockAvailable not quantity
      return {
        ...variant,
        stockCondition: calculateStockCondition(variant.stockQuantity)
      };
    });
    return await sequelize.transaction(async (transaction) => {
      // Update product fields

      await product.update(
        {
          name,
          description,
          image,
          type,
          category,
          departmentId,
          level: level ?? department.level
        },
        {transaction}
      );

      for (const variant of productVariantWithStockCondition) {
        const productVariant = await DB.ProductVariant.findOne({
          transaction,
          where: {
            id: variant.id,
            productId
          }
        });
        if (productVariant) {
          await productVariant.update(
            {variant, stockCondition: calculateStockCondition(variant.stockQuantity - productVariant.stockReserved)},
            {transaction}
          );
        } else {
          await DB.ProductVariant.create(
            {
              productId,
              stockCondition: variant.stockCondition,
              name: variant.name,
              productAttributeId: variant.productAttributeId,
              size: variant.size,
              price: Number(variant.price),
              stockQuantity: variant.stockQuantity
            },
            {
              transaction
            }
          );
        }
      }

      await DB.ProductVariant.destroy({
        where: {
          productId,
          id: {
            [Op.notIn]: newVariantIds
          }
        },
        transaction
      });
      // Reload updated product with relations
      await product.reload({
        include: [
          {
            model: ProductVariant,
            as: 'productVariant',
            include: [{model: ProductAttribute, as: 'productAttribute'}]
          },
          {
            model: DB.Department,
            as: 'department'
          }
        ],
        transaction
      });
      const variantDetails =
        product.productVariant ?
          product.productVariant
            .map(
              (variant) =>
                `• ${variant.productAttribute.name} ${variant.name} (${variant.size}) - Price: ${variant.price}, Stock: ${variant.stockAvailable}`
            )
            .join('\n')
        : null;

      const variantText = variantDetails ? `\n\nUpdated Variants:\n${variantDetails}` : '';

      await NotificationService.createNotification(
        `Product Updated: ${product.name}`,
        `The product "${product.name}" has been updated in the ${department.name} department. ${variantText}`,
        'announcement',
        department.name === 'Proware' ? 'students' : 'department students',
        {
          departmentId,
          userId: null
        }
      );

      await ActivityLogService.createLog(
        `Product updated: ${product.name}`,
        `The product "${product.name}" in the ${department.name} department was updated. ${variantText}`,
        'system'
      );

      return product;
    });
  }

  /**
   *
   * @param {string} productVariantId
   * @param {number} newStock
   * @param {'add'|'minus'} action
   * @returns {Promise<Product>}
   * @throws {NotFoundException} Product not found
   */
  static async updateProductStock(productVariantId, newStock, action) {
    if (!validate(productVariantId)) {
      throw new NotFoundException('Product not found', 404);
    }

    const variant = await ProductVariant.findByPk(productVariantId, {
      include: [
        {
          model: Product,
          as: 'product',
          required: true,
          include: [
            {
              model: Department,
              as: 'department'
            }
          ]
        },
        {
          model: ProductAttribute,
          as: 'productAttribute'
        }
      ]
    });

    if (!variant) throw new NotFoundException('Product not found', 404);

    await sequelize.transaction(async (transaction) => {
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
      await ActivityLogService.createLog(
        `Stock updated: ${variant.product.name} - ${variant.name} (${variant.size})`,
        `Stock quantity for "${variant.product.name}" (${variant.name}, ${variant.size}) was updated from ${variant.stockQuantity} to ${stockQuantity}.`,
        'inventory'
      );
      variant.stockQuantity = stockQuantity;
      const newStockCondition = stockQuantity - variant.stockReserved;
      variant.stockCondition = calculateStockCondition(newStockCondition);

      await variant.save({transaction});

      let notificationTitle = '';
      let notificationMessage = '';

      switch (variant.stockCondition) {
        case 'out-of-stock':
          notificationTitle = 'Product Out of Stock';
          notificationMessage = `Unfortunately, "${variant.product.name}" (${variant.name}, ${variant.size}) is now out of stock. Stay tuned for restocks!`;
          break;

        case 'low-stock':
          notificationTitle = 'Low Stock Alert';
          notificationMessage = `Hurry! "${variant.product.name}" (${variant.name}, ${variant.size}) is running low. Only ${stockQuantity} left! Grab it before it’s gone.`;
          break;

        case 'in-stock':
          notificationTitle = 'Product Restocked';
          notificationMessage = `Good news! "${variant.product.name}" (${variant.name}, ${variant.size}) is back in stock. Available quantity: ${stockQuantity}.`;
          break;

        default:
          notificationTitle = 'Product Stock Update';
          notificationMessage = `"${variant.product.name}" (${variant.name}, ${variant.size}) stock has been updated. Current stock: ${stockQuantity}.`;
          break;
      }

      await NotificationService.createNotificationForInventoryStockUpdate(
        notificationTitle,
        notificationMessage,
        variant.id
      );
    });

    return variant;
  }

  /**
   * Create Product attribute
   * @param {string} name
   * @throws {AlreadyExistException} if attribute already exists
   */
  static async createAttribute(name) {
    return await sequelize.transaction(async (transaction) => {
      const [productAttribute, isJustCreated] = await ProductAttribute.findOrCreate({
        where: {
          name: name
        },
        defaults: {
          name: name
        },
        transaction
      });

      if (!isJustCreated) {
        throw new AlreadyExistException('Attribute already exists');
      }
      await ActivityLogService.createLog(
        `Attribute created: ${name}`,
        `A new product attribute "${name}" has been created.`,
        'system'
      );
      return productAttribute;
    });
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
