import {DB} from '../database/index.js';
import sequelize from '../database/config/sequelize.js';
import {NotFoundException} from '../exceptions/notFound.js';
import {ActivityLogService} from './activity-log.service.js';
import {calculateStockCondition} from '../utils/stock-helper.js';
import {ProductService} from './product.service.js';
import {NotificationService} from './notification.service.js';
import {cast, col, Op, Sequelize} from 'sequelize';

export class ReturnedItemService {
  static async createReturnedItem({productVariant: productVariantId, reason, quantity = 1}) {
    return await sequelize.transaction(async (transaction) => {
      const findReturnItem = await DB.ReturnedItems.findOne({
        transaction,
        where: {
          productVariantId,
          reason
        },
        include: [
          {
            model: DB.ProductVariant,
            as: 'productVariant',
            include: [
              {
                model: DB.Product,
                as: 'product'
              }
            ]
          }
        ]
      });
      if (findReturnItem) {
        throw new Error(
          'You have a return item with the item and same reason, Just update the quantity of the return item'
        );
      }
      const productVariant = await DB.ProductVariant.findByPk(productVariantId, {
        transaction,
        include: [
          {
            model: DB.Product,
            as: 'product',
            include: [
              {
                model: DB.Department,
                as: 'department'
              }
            ]
          }
        ]
      });

      if (!productVariant) throw new NotFoundException('Product not found');
      const returnedItem = await DB.ReturnedItems.create(
        {
          reason,
          quantity,
          productVariantId
        },
        {transaction}
      );
      const newStockAvailable = productVariant.stockAvailable - quantity;

      if (newStockAvailable < 0) {
        throw new Error(
          `We only have ${productVariant.stockAvailable} stock available left, ${productVariant.stockReserved} stocks are reserved.`
        );
      }

      productVariant.stockQuantity = newStockAvailable + Number(productVariant.stockReserved);
      productVariant.stockCondition = calculateStockCondition(newStockAvailable);
      await productVariant.save({transaction});

      await ActivityLogService.createLog(
        `Product Returned: ${productVariant.product.name} (Quantity: ${quantity})`,
        `Reason: ${reason}. Available stock was reduced by ${quantity} for the following variant: ${productVariant.product.name} - ${productVariant.name} (${productVariant.size}).`,
        'inventory'
      );

      let notificationTitle = '';
      let notificationMessage = '';

      switch (productVariant.stockCondition) {
        case 'out-of-stock':
          notificationTitle = 'Product Out of Stock';
          notificationMessage = `Unfortunately, "${productVariant.product.name}" (${productVariant.name}, ${productVariant.size}) is now out of stock. Stay tuned for restocks!`;
          break;

        case 'low-stock':
          notificationTitle = 'Low Stock Alert';
          notificationMessage = `Hurry! "${productVariant.product.name}" (${productVariant.name}, ${productVariant.size}) is running low. Only ${newStockAvailable} left! Grab it before it’s gone.`;
          break;

        case 'in-stock':
          notificationTitle = 'Product Restocked';
          notificationMessage = `Good news! "${productVariant.product.name}" (${productVariant.name}, ${productVariant.size}) is back in stock. Available quantity: ${newStockAvailable}.`;
          break;

        default:
          notificationTitle = 'Product Stock Update';
          notificationMessage = `"${productVariant.product.name}" (${productVariant.name}, ${productVariant.size}) stock has been updated. Current stock: ${newStockAvailable}.`;
          break;
      }

      await NotificationService.createNotificationForInventoryStockUpdate(
        notificationTitle,
        notificationMessage,
        productVariant.id
      );
      await NotificationService.createNotification(
        notificationTitle,
        notificationMessage,
        'announcement',
        productVariant.product.department.name === 'Proware' ? 'students' : 'department students',
        {
          departmentId,
          userId: null
        }
      );
    });
  }
  static async archiveReturnItem(returnedItemId) {
    return await sequelize.transaction(async (transaction) => {
      const returnedItem = await DB.ReturnedItems.findByPk(returnedItemId, {
        transaction,
        include: [
          {
            model: DB.ProductVariant,
            as: 'productVariant',
            include: [
              {
                model: DB.Product,
                as: 'product'
              }
            ]
          }
        ]
      });
      if (!returnedItem) throw new NotFoundException('Returned Item not found');
      return await returnedItem.destroy({transaction});
    });
  }
  static async updateReturnedItemQuantity(returnedItemId, quantity) {
    return await sequelize.transaction(async (transaction) => {
      const returnedItem = await DB.ReturnedItems.findByPk(returnedItemId, {
        transaction,
        include: [
          {
            model: DB.ProductVariant,
            as: 'productVariant',
            include: [
              {
                model: DB.Product,
                as: 'product'
              }
            ]
          }
        ]
      });

      if (!returnedItem) throw new NotFoundException('Returned Item not found');
      const productVariant = await DB.ProductVariant.findByPk(returnedItem.productVariantId, {
        transaction,
        include: [
          {
            model: DB.Product,
            as: 'product',
            required: true,
            paranoid: false,
            include: [
              {
                model: DB.Department,
                as: 'department'
              }
            ]
          }
        ]
      });
      if (!productVariant) throw new NotFoundException('Product not found');

      // So if we have 3 returnItemQuantity, then we have 10 new quantity,
      // we add 3 to the stockAvailable, then we subtract the sum of quantity and stockAvailable to the new quantity.
      const newStockAvailable = returnedItem.quantity + productVariant.stockAvailable - quantity;
      if (newStockAvailable < 0) throw new Error(`We only have ${productVariant.stockAvailable} stock available left`);

      productVariant.stockQuantity = newStockAvailable + productVariant.stockReserved;
      productVariant.stockCondition = calculateStockCondition(newStockAvailable);
      await productVariant.save({transaction});

      returnedItem.quantity = quantity;
      await returnedItem.save({transaction});

      await ActivityLogService.createLog(
        `Returned Item Quantity Updated: ${productVariant.product.name}`,
        `The return quantity for variant ${productVariant.product.name} - ${productVariant.name} (${productVariant.size}) was updated to ${quantity}. Reason: ${returnedItem.reason}.`,
        'inventory'
      );

      let notificationTitle = '';
      let notificationMessage = '';

      switch (productVariant.stockCondition) {
        case 'out-of-stock':
          notificationTitle = 'Product Out of Stock';
          notificationMessage = `Unfortunately, "${productVariant.product.name}" (${productVariant.name}, ${productVariant.size}) is now out of stock. Stay tuned for restocks!`;
          break;

        case 'low-stock':
          notificationTitle = 'Low Stock Alert';
          notificationMessage = `Hurry! "${productVariant.product.name}" (${productVariant.name}, ${productVariant.size}) is running low. Only ${newStockAvailable} left! Grab it before it’s gone.`;
          break;

        case 'in-stock':
          notificationTitle = 'Product Restocked';
          notificationMessage = `Good news! "${productVariant.product.name}" (${productVariant.name}, ${productVariant.size}) is back in stock. Available quantity: ${newStockAvailable}.`;
          break;

        default:
          notificationTitle = 'Product Stock Update';
          notificationMessage = `"${productVariant.product.name}" (${productVariant.name}, ${productVariant.size}) stock has been updated. Current stock: ${newStockAvailable}.`;
          break;
      }

      await NotificationService.createNotificationForInventoryStockUpdate(
        notificationTitle,
        notificationMessage,
        productVariant.id
      );
      await NotificationService.createNotification(
        notificationTitle,
        notificationMessage,
        'announcement',
        productVariant.product.department.name === 'Proware' ? 'students' : 'department students',
        {
          departmentId,
          userId: null
        }
      );
    });
  }

  static async restoreReturnedItem(returnedItemId) {
    return await DB.sequelize.transaction(async (transaction) => {
      const returnedItem = await DB.ReturnedItems.findByPk(returnedItemId, {
        transaction,
        include: [
          {
            model: DB.ProductVariant,
            as: 'productVariant',
            paranoid: false,
            include: [
              {
                model: DB.Product,
                as: 'product'
              }
            ]
          }
        ]
      });
      if (!returnedItem) throw new NotFoundException('Returned Item not found');
      const productVariant = await DB.ProductVariant.findByPk(returnedItem.productVariantId, {
        transaction,
        include: [
          {
            model: DB.Product,
            as: 'product',
            include: [
              {
                model: DB.Department,
                as: 'department'
              }
            ]
          }
        ]
      });
      if (!productVariant) throw new NotFoundException('Product not found');
      const prevStockQuantity = productVariant.stockQuantity;
      const newStockAvailable = productVariant.stockAvailable + returnedItem.quantity;
      productVariant.stockQuantity = newStockAvailable + productVariant.stockReserved;
      const stockQuantity = productVariant.stockQuantity;
      productVariant.stockCondition = calculateStockCondition(newStockAvailable);

      if (productVariant.stockQuantity < 0) {
        throw new Error('Insufficient stock: the resulting quantity cannot be negative. Please enter a valid value.');
      }
      const resetStockValue = 50;
      if (newStock >= resetStockValue) {
        await DB.StudentProductCount.update(
          {
            count: 0
          },
          {
            where: {
              productVariantId: productVariant.id
            },
            transaction
          }
        );
      }
      switch (productVariant.stockCondition) {
        case 'out-of-stock':
          notificationTitle = 'Product Out of Stock';
          notificationMessage = `Unfortunately, "${productVariant.product.name}" (${productVariant.name}, ${productVariant.size}) is now out of stock. Stay tuned for restocks!`;
          break;

        case 'low-stock':
          notificationTitle = 'Low Stock Alert';
          notificationMessage = `Hurry! "${productVariant.product.name}" (${productVariant.name}, ${productVariant.size}) is running low. Only ${stockQuantity} left! Grab it before it’s gone.`;
          break;

        case 'in-stock':
          notificationTitle = 'Product Restocked';
          notificationMessage = `Good news! "${productVariant.product.name}" (${productVariant.name}, ${productVariant.size}) is back in stock. Available quantity: ${stockQuantity}.`;
          break;

        default:
          notificationTitle = 'Product Stock Update';
          notificationMessage = `"${productVariant.product.name}" (${productVariant.name}, ${productVariant.size}) stock has been updated. Current stock: ${stockQuantity}.`;
          break;
      }

      await NotificationService.createNotificationForInventoryStockUpdate(
        notificationTitle,
        notificationMessage,
        productVariant.id
      );
      await NotificationService.createNotification(
        notificationTitle,
        notificationMessage,
        'announcement',
        productVariant.product.department.name === 'Proware' ? 'students' : 'department students',
        {
          departmentId,
          userId: null
        }
      );
      await ActivityLogService.createLog(
        `Stock updated: ${productVariant.product.name} - ${productVariant.name} (${productVariant.size})`,
        `Stock quantity for "${productVariant.product.name}" (${productVariant.name}, ${productVariant.size}) was updated from ${productVariant.stockQuantity} to ${prevStockQuantity}.`,
        'inventory'
      );
      await productVariant.save({transaction});

      await ActivityLogService.createLog(
        `Returned Item: ${productVariant.product.name}`,
        `The return record for variant ${productVariant.product.name} - ${productVariant.name} (${productVariant.size}) was deleted. Quantity returned was ${returnedItem.quantity}. Reason for original return: ${returnedItem.reason}.`,
        'inventory'
      );
      //Here --

      // -end
      await returnedItem.destroy({transaction});
      return productVariant;
    });
  }
  static async getReturnedItems(query) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    let where = {};
    if (query.search) {
      const search = query.search.trim();
      where[Op.or] = [
        // Match student's first or last name (through associated User)
        {reason: {[Op.iLike]: `%${search}%`}},
        {'$productVariant.product.name$': {[Op.iLike]: `%${search}%`}},
        {'$productVariant.name$': {[Op.iLike]: `%${search}%`}}
      ];
    }
    if (query?.category) {
      where[Op.and] = [
        ...(where[Op.and] || []),
        Sequelize.where(Sequelize.cast(Sequelize.col('productVariant.product.category'), 'TEXT'), {
          [Op.iLike]: `%${query.category}%`
        })
      ];
    }
    if (query?.program) {
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
      where[Op.and] = [
        ...(where[Op.and] || []),
        Sequelize.where(Sequelize.col('productVariant.product.departmentId'), departments.id),
        Sequelize.where(Sequelize.col('productVariant.product.level'), departments.level)
      ];
    }
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
      where[Op.and] = [
        ...(where[Op.and] || []),
        Sequelize.where(Sequelize.col('productVariant.product.departmentId'), departments.id),
        Sequelize.where(Sequelize.col('productVariant.product.level'), departments.level)
      ];
    }

    if (query.status === 'archived') {
      where.deletedAt = {
        [Op.not]: null
      };
    } else if (query.status === 'active') {
      where.deletedAt = {
        [Op.is]: null
      };
    }
    const {count, rows} = await DB.ReturnedItems.findAndCountAll({
      where,
      paranoid: false,
      include: [
        {
          model: DB.ProductVariant,
          as: 'productVariant',
          paranoid: false,
          include: [
            {
              model: DB.Product,
              as: 'product',
              paranoid: false,
              include: [
                {
                  model: DB.Department,
                  as: 'department',
                  paranoid: false
                }
              ]
            },
            {
              model: DB.ProductAttribute,
              as: 'productAttribute',
              paranoid: false
            }
          ]
        }
      ],
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']]
    });
    return {
      data: rows,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: count
      }
    };
  }
}

