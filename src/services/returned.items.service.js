import {DB} from '../database/index.js';
import sequelize from '../database/config/sequelize.js';
import {NotFoundException} from '../exceptions/notFound.js';
import {ActivityLogService} from './activity-log.service.js';
import {calculateStockCondition} from '../utils/stock-helper.js';
import {ProductService} from './product.service.js';
import {NotificationService} from './notification.service.js';

export class ReturnedItemService {
  static async createReturnedItem({productVariant: productVariantId, reason, quantity = 1}) {
    return await sequelize.transaction(async (transaction) => {
      const productVariant = await DB.ProductVariant.findByPk(productVariantId, {
        transaction,
        include: [
          {
            model: DB.Product,
            as: 'product'
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
      if (newStockAvailable <= 0) throw new Error(`We only have ${productVariant.stockAvailable} stock available left`);

      productVariant.stockQuantity = newStockAvailable + Number(productVariant.stockReserved);
      productVariant.stockCondition = calculateStockCondition(newStockAvailable);
      await productVariant.save({transaction});

      await ActivityLogService.createLog(
        `Product Returned: ${productVariant.product.name} (Quantity: ${quantity})`,
        `Reason: ${reason}. Available stock was reduced by ${quantity} for the following variant: ${productVariant.product.name} - ${productVariant.name} (${productVariant.size}).`,
        'inventory'
      );
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
            as: 'product'
          }
        ]
      });
      if (!productVariant) throw new NotFoundException('Product not found');

      const newStockAvailable = returnedItem.quantity + productVariant.stockAvailable - quantity;
      if (newStockAvailable <= 0) throw new Error(`We only have ${productVariant.stockAvailable} stock available left`);

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
            as: 'product'
          }
        ]
      });
      if (!productVariant) throw new NotFoundException('Product not found');
      const newStockAvailable = productVariant.stockAvailable + returnedItem.quantity;
      productVariant.stockQuantity = newStockAvailable + productVariant.stockReserved;
      productVariant.stockCondition = calculateStockCondition(newStockAvailable);
      await productVariant.save({transaction});

      await ActivityLogService.createLog(
        `Returned Item: ${productVariant.product.name}`,
        `The return record for variant ${productVariant.product.name} - ${productVariant.name} (${productVariant.size}) was deleted. Quantity returned was ${returnedItem.quantity}. Reason for original return: ${returnedItem.reason}.`,
        'inventory'
      );
      //Here --

      let stockQuantity = productVariant.stockQuantity;
      const newStock = returnedItem.quantity;
      stockQuantity += newStock;

      if (stockQuantity < 0) {
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
              productVariantId: variant.id
            },
            transaction
          }
        );
      }
      await ActivityLogService.createLog(
        `Stock updated: ${productVariant.product.name} - ${productVariant.name} (${productVariant.size})`,
        `Stock quantity for "${productVariant.product.name}" (${productVariant.name}, ${productVariant.size}) was updated from ${productVariant.stockQuantity} to ${stockQuantity}.`,
        'inventory'
      );
      productVariant.stockQuantity = stockQuantity;
      const newStockCondition = stockQuantity - productVariant.stockReserved;
      productVariant.stockCondition = calculateStockCondition(newStockCondition);

      await productVariant.save({transaction});

      let notificationTitle = '';
      let notificationMessage = '';

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

      // -end
      await returnedItem.destroy({transaction});
      return productVariant;
    });
  }
  static async getReturnedItems(query) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const {count, rows} = await DB.ReturnedItems.findAndCountAll({
      include: [
        {
          model: DB.ProductVariant,
          as: 'productVariant',
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
            },
            {
              model: DB.ProductAttribute,
              as: 'productAttribute'
            }
          ]
        }
      ],
      limit,
      offset: (page - 1) * limit,
      order: [
        ['productVariant', 'product', 'name', 'ASC'],
        ['productVariant', 'name', 'ASC'],
        ['productVariant', 'size', 'ASC']
      ]
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

