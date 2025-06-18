//@ts-check
import {NotFoundException} from '../exceptions/notFound.js';
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

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getSale = async (req, res) => {
  const {oracleInvoice} = req.params;
  try {
    const sales = await SalesService.getSale(oracleInvoice);
    return res.status(200).json({message: 'Sales Fetching Successful', result: sales});
  } catch (error) {
    if (error instanceof NotFoundException) {
      res.status(error.statusCode).json({message: 'Sales fetching failed', error: error.message});
    }
    res.status(400).json({message: 'Sales fetching failed', error});
  }
};

