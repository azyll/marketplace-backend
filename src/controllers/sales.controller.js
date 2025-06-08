//@ts-check
import {SalesService} from '../services/sales.service.js';

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getSales = async (req, res) => {
  try {
    const sales = await SalesService.getSales({limit: 10, page: 1});
    return res.status(200).json({message: 'Sales Fetching Successful', result: sales});
  } catch (error) {
    res.status(error.statusCode || 400).json({message: 'Sales fetching failed', error});
  }
};

