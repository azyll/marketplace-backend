import {AlreadyExistException} from '../exceptions/alreadyExist.js';
import {NotFoundException} from '../exceptions/notFound.js';
import {UnauthorizedException} from '../exceptions/unauthorized.js';
import {ReportService} from '../services/report.service.js';

export const getOrders = async (req, res) => {
  const query = req.query;

  try {
    const data = await ReportService.getOrders(query);
    return res.status(200).json({message: 'Orders retrieve successfully', ...data});
  } catch (error) {
    const message = 'Failed to get orders';
    if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
      return res.status(error.statusCode).json({message, error: error.message});
    }
    return res.status(400).json({message, error: error.message || defaultErrorMessage});
  }
};

/**
 *
 * @param {import("express").Request<{},{},{},QueryParams>} req
 * @param {import("express").Response} res
 */
export const getSales = async (req, res) => {
  try {
    const sales = await ReportService.getSales(req.query);
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
 * Get Inventory Products
 * @param {import('express').Request<
 *   {},
 *   {},
 *   {},
 *  QueryParams&{
 *     category?: string,
 *     name?: string,
 *     search?: string,  // Add this new parameter
 *     department?: string,
 *     latest?: boolean,
 *     program?:string,
 *      paranoid:boolean
 *   }
 * >} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const getInventory = async (req, res) => {
  try {
    const data = await ReportService.getInventory(req.query);
    return res.status(200).json({message: 'Products retrieve successfully', ...data});
  } catch (error) {
    const message = 'Failed to get products';
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
 * Get All Products
 * @param {import('express').Request<
 *   {},
 *   {},
 *   {},
 *  QueryParams&{
 *     category?: string,
 *     name?: string,
 *     search?: string,  // Add this new parameter
 *     department?: string,
 *     latest?: boolean,
 *     program?:string,
 *      paranoid:boolean
 *   }
 * >} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const getProducts = async (req, res) => {
  try {
    const data = await ReportService.getProducts(req.query);
    return res.status(200).json({message: 'Products retrieve successfully', ...data});
  } catch (error) {
    const message = 'Failed to get products';
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

