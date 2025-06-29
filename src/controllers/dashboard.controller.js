//@ts-check
import {NotFoundException} from '../exceptions/notFound.js';
import {NotificationService} from '../services/notification.service.js';
import {OrderService} from '../services/order.service.js';
import {ProductService} from '../services/product.service.js';
import {SalesService} from '../services/sales.service.js';
import {getStartAndEndOfMonth, getStartAndEndOfTheYear, parseDateAsUTC} from '../utils/date-helper.js';

/**
 * Update Student
 * @param {import('express').Request<{},{},{},{from:string,to:string}>} req
 * @param {import('express').Response} res
 * @returns
 */
export const getDashboard = async (req, res) => {
  try {
    const {from, to} = req.query;

    let filterFrom = new Date(from);
    let filterTo = new Date(to);
    if (!filterFrom || isNaN(filterFrom.getTime()) || !filterTo || isNaN(filterTo.getTime())) {
      const {endOfTheYear, startOfTheYear} = getStartAndEndOfTheYear();
      filterFrom = startOfTheYear;
      filterTo = endOfTheYear;
    } else {
      filterFrom = new Date(from);
      filterTo = new Date(new Date(to).setHours(23, 59, 59, 999));
    }
    console.log(filterFrom, filterTo);

    const totalSales = await SalesService.getSalesFilterByDate(filterFrom, filterTo);
    const {count: totalOrders} = await OrderService.getOrdersFilterByDate(filterFrom, filterTo);
    const riskProducts = await ProductService.getProductsByProductCondition();

    const returnJson = {
      message: 'dashboard',
      cardData: {
        totalOrders,
        totalSales: totalSales,
        riskProducts: riskProducts.length
      }
    };

    return res.status(200).json(returnJson);

    // const ordersForTheMonth = await OrderService.getOrdersFilterByDate(startOfToday, endOfToday);
    // return res.status(200).json({message: 'notifications', orders: ordersForTheMonth});
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode).json({message: error.message || 'Error', error});
  }
};
