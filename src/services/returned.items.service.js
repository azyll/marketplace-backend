import {DB} from '../database/index.js';
import sequelize from '../database/config/sequelize.js';
import {NotFoundException} from '../exceptions/notFound.js';
import {ActivityLogService} from './activity-log.service.js';
import {calculateStockCondition} from '../utils/stock-helper.js';
import {ProductService} from './product.service.js';

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
      const newStockAvailable = productVariant.newStockAvailable - quantity;
      if (newStockAvailable <= 0)
        throw new Error(`We only have ${productVariant.newStockAvailable} stock available left`);

      productVariant.stockQuantity = newStockAvailable + productVariant.stockReserved;
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

      const newStockAvailable = productVariant.newStockAvailable - quantity;
      if (newStockAvailable <= 0)
        throw new Error(`We only have ${productVariant.newStockAvailable} stock available left`);

      productVariant.stockQuantity = newStockAvailable + productVariant.stockReserved;
      productVariant.stockCondition = calculateStockCondition(newStockAvailable);
      await productVariant.save({transaction});

      returnedItem.quantity = quantity;
      await returnedItem.save({transaction});

      await ActivityLogService.createLog(
        `Returned Item Quantity Updated: ${productVariant.product.name}`,
        `The return quantity for variant ${productVariant.product.name} - ${productVariant.name} (${productVariant.size}) was updated to ${quantity}. Reason: ${reason}.`,
        'inventory'
      );
    });
  }
  static async restoreReturnedItem(returnedItemId) {
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

      const newStockAvailable = productVariant.newStockAvailable + returnedItem.quantity;

      productVariant.stockQuantity = newStockAvailable + productVariant.stockReserved;
      productVariant.stockCondition = calculateStockCondition(newStockAvailable);
      await productVariant.save({transaction});

      await returnedItem.destroy({transaction});

      await ActivityLogService.createLog(
        `Returned Item: ${productVariant.product.name}`,
        `The return record for variant ${productVariant.product.name} - ${productVariant.name} (${productVariant.size}) was deleted. Quantity returned was ${quantity}. Reason for original return: ${reason}.`,
        'inventory'
      );
      await ProductService.updateProductStock(productVariant.id, returnedItem.quantity, 'add');
    });
  }
  static async getReturnedItems(query) {
    const page = Number(query.page) ?? 1;
    const limit = Number(query.limit) ?? 10;
    const {count, rows} = await DB.ReturnedItems.findAndCountAll(returnedItemId, {
      transaction,
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

