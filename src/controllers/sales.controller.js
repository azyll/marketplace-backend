//@ts-check
import {AlreadyExistException} from '../exceptions/alreadyExist.js';
import {NotFoundException} from '../exceptions/notFound.js';
import {UnauthorizedException} from '../exceptions/unauthorized.js';
import {SalesService} from '../services/sales.service.js';
import {defaultErrorMessage} from '../utils/error-message.js';

/**
 * @typedef {import ('../types/index.js').QueryParams} QueryParams
 * /
 * 
/**
 *
 * @param {import("express").Request<{},{},{},QueryParams>} req
 * @param {import("express").Response} res
 */
export const getSales = async (req, res) => {
  try {
    const sales = await SalesService.getSales(req.query);
    return res.status(200).json({message: 'Sales retrieve successfully', ...sales});
  } catch (error) {
    const message = 'Failed to get sales';
    if (
      error instanceof NotFoundException ||
      error instanceof AlreadyExistException ||
      error instanceof UnauthorizedException
    ) {
      return res.status(error.statusCode).json({message, error: error.message});
    }
    return res.status(400).json({message, error: error.message || defaultErrorMessage});
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
    return res.status(200).json({message: 'Sale retrieve successfully', data: sales});
  } catch (error) {
    const message = 'Failed to get sale';
    if (
      error instanceof NotFoundException ||
      error instanceof AlreadyExistException ||
      error instanceof UnauthorizedException
    ) {
      return res.status(error.statusCode).json({message, error: error.message});
    }
    return res.status(400).json({message, error: error.message || defaultErrorMessage});
  }
};

/**
 *  All orders per month
 * @param {import('express').Request<{studentId:string},{},{}>} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>} Response object
 */
export const getAnnualSales = async (req, res) => {
  try {
    const data = await SalesService.getSalesPerMonth();
    return res.status(200).json({message: 'Annual sales retrieve successfully', data});
  } catch (error) {
    const message = 'Failed to get annual sales';
    if (
      error instanceof NotFoundException ||
      error instanceof AlreadyExistException ||
      error instanceof UnauthorizedException
    ) {
      return res.status(error.statusCode).json({message, error: error.message});
    }
    return res.status(400).json({message, error: error.message || defaultErrorMessage});
  }
};

