import {NotFoundException} from '../exceptions/notFound.js';
import {UnauthorizedException} from '../exceptions/unauthorized.js';
import {OrderService} from '../services/order.service.js';
import {ProductService} from '../services/product.service.js';
import {SalesService} from '../services/sales.service.js';
import {getStartAndEndOfTheYear} from '../utils/date-helper.js';
import {defaultErrorMessage} from '../utils/error-message.js';

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

    return res.status(200).json({
      message: 'Employee dashboard retrieve successfully',
      cardData: {
        totalOrders,
        totalSales: totalSales,
        riskProducts: riskProducts.length
      }
    });
  } catch (error) {
    const message = 'Failed to get dashboard';
    if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
      return res.status(error.statusCode).json({message, error: error.message});
    }
    return res.status(400).json({message, error: error.message || defaultErrorMessage});
  }
};
