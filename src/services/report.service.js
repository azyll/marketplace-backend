import {cast, col, Op, where} from 'sequelize';
import {DB} from '../database/index.js';

const {
  Sales,
  Order,
  Product,
  ActivityLog,
  Student,
  ProductAttribute,
  User,
  OrderItems,
  Program,
  Department,
  ProductVariant
} = DB;
export class ReportService {
  /**
   * Get All Sales
   * @param {{search:string}} query
   * @returns {Promise<SalesResponse>} Sales Pagination
   */
  static async getSales(query) {
    const {from, to} = query;
    const where = {};

    if (from && to) {
      // Date range
      where.createdAt = {
        [Op.gte]: new Date(from),
        [Op.lt]: new Date(new Date(to).setDate(new Date(to).getDate() + 1)) // add 1 day to make end inclusive
      };
    } else if (from) {
      // Single date
      const day = new Date(from);
      const nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);

      where.createdAt = {
        [Op.gte]: day,
        [Op.lt]: nextDay
      };
    }
    if (query.search) {
      const search = query.search.trim();
      where[Op.or] = [
        // Match student's first or last name (through associated User)
        {orderId: {[Op.iLike]: `%${search}%`}},
        {oracleInvoice: {[Op.iLike]: `%${search}%`}},
        {'$order.student.user.firstName$': {[Op.iLike]: `%${search}%`}},
        {'$order.student.user.lastName$': {[Op.iLike]: `%${search}%`}},
        {'$order.student.user.username$': {[Op.iLike]: `%${search}%`}},

        // Match program name or acronym
        {'$order.student.program.name$': {[Op.iLike]: `%${search}%`}},
        {'$order.student.program.acronym$': {[Op.iLike]: `%${search}%`}}
      ];
    }
    const {count, rows: salesData} = await Sales.findAndCountAll({
      distinct: true,
      where,
      order: [['createdAt', 'DESC']],

      subQuery: false, // <-- this is critical for alias search to work!
      include: [
        {
          model: Order,
          as: 'order',
          include: [
            {
              model: OrderItems,
              as: 'orderItems',
              include: [
                {
                  model: DB.ProductVariant,
                  as: 'productVariant',
                  include: [
                    {
                      model: Product,
                      as: 'product'
                    }
                  ]
                }
              ]
            },

            {
              model: Student,
              as: 'student',
              include: [
                {
                  model: User,
                  as: 'user'
                },
                {
                  model: Program,
                  as: 'program'
                }
              ]
            }
          ]
        }
      ]
    });
    const salesRecords = await Sales.findAll({
      distinct: true,
      where,
      order: [['createdAt', 'DESC']],
      subQuery: false, // <-- this is critical for alias search to work!
      include: [
        {
          model: Order,
          as: 'order',
          include: [
            {
              model: OrderItems,
              as: 'orderItems'
            },
            {
              model: Student,
              as: 'student',
              include: [
                {
                  model: User,
                  as: 'user'
                },
                {
                  model: Program,
                  as: 'program'
                }
              ]
            }
          ]
        }
      ]
    });
    const totalSales = salesRecords.reduce((sum, sale) => sum + Number(sale.total || 0), 0);
    return {
      data: salesData,
      meta: {
        totalItems: count,
        totalSales
      }
    };
  }
  /**
   * Get all Orders
   * @param {{from:string, to:string, status:'ongoing'|'completed'|'cancelled'|'confirmed',search:string}} query
   * @returns {Promise<PaginatedOrders>} All of the orders
   */
  static async getOrders(query) {
    const whereClause = {};

    if (query?.from && query?.to) {
      let filterFrom = new Date(query?.from);
      let filterTo = new Date(new Date(query?.to).setHours(23, 59, 59, 999));
      whereClause.createdAt = {[Op.between]: [filterFrom, filterTo]};
    }
    if (query?.status) {
      whereClause.status = query.status;
    }
    if (query.search) {
      const search = query.search.trim();
      whereClause[Op.or] = [
        {id: {[Op.iLike]: `%${search}%`}},
        // Match student's first or last name (through associated User)
        {'$student.user.firstName$': {[Op.iLike]: `%${search}%`}},
        {'$student.user.lastName$': {[Op.iLike]: `%${search}%`}},
        {'$student.user.username$': {[Op.iLike]: `%${search}%`}},

        // Match program name or acronym
        {'$student.program.name$': {[Op.iLike]: `%${search}%`}},
        {'$student.program.acronym$': {[Op.iLike]: `%${search}%`}}
      ];
    }

    const {rows: orderData, count} = await Order.findAndCountAll({
      distinct: true,
      subQuery: false,
      where: whereClause,
      include: [
        {
          model: OrderItems,
          as: 'orderItems',
          paranoid: false,
          include: [
            {
              model: DB.ProductVariant,
              as: 'productVariant',
              paranoid: false,
              include: [{model: Product, as: 'product', paranoid: false}]
            }
          ]
        },
        {
          model: Student,
          as: 'student',
          attributes: {
            include: ['id', 'level', 'sex']
          },
          include: [
            {
              model: User,
              as: 'user',
              attributes: {include: ['firstName', 'lastName', 'username']}
            },
            {
              model: Program,
              as: 'program',
              attributes: {include: ['name', 'acronym']}
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return {
      data: orderData,
      meta: {
        totalItems: count
      }
    };
  }

  /**
   * Get All Products
   * @param { {
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
      ]
    });

    return {
      data: productData,
      meta: {
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
   *      paranoid:boolean,
   *      stock_condition:'out-of-stock'|'low-stock'|'in-stock',
   * sort:'DESC'|'ASC'
   *   }} query Query
   *
   *
   * @returns {Promise<ProductResponse>} All products
   */
  static async getInventory(query) {
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
            totalItems: 0
          }
        };
      }

      const departments = await DB.Department.findByPk(program.departmentId);

      if (!departments) {
        return {
          data: [],
          meta: {
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
            totalItems: 0
          }
        };
      }
      whereClause.departmentId = departments.id;
      whereClause.level = departments.level;
    }
    if (
      query.stock_condition &&
      query.stock_condition !== 'in-stock' &&
      query.stock_condition !== 'low-stock' &&
      query.stock_condition !== 'out-of-stock'
    ) {
      return {
        data: [],
        meta: {
          totalItems: 0
        }
      };
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
            query.stock_condition ?
              {
                stockCondition: query.stock_condition
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
      ]
    });
    return {
      data: inventoryData,
      meta: {
        totalItems: count
      }
    };
  }
}

