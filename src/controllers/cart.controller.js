// @ts-check
import {NotFoundException} from '../exceptions/notFound.js';
import {CartService} from '../services/cart.service.js';

/**
 * @typedef {import("../types/index.js").QueryParams} QueryParams
 */

/**
 *
 * @param {import('express').Request<{studentId:string},{},{products:string[]}>} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>} Response Object
 */
export const createStudentCart = async (req, res) => {
  const {studentId} = req.params;
  const {products} = req.body;

  try {
    const response = await CartService.addItemToCart(studentId, products);
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof NotFoundException) {
      return res.status(error.statusCode).json({message: error.message || 'Error', error});
    }
    return res.status(400).json({message: error?.message || 'error', error});
  }
};

/**
 *
 * @param {import('express').Request<{studentId:string},{},{products:string[]},QueryParams>} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>} Response Object
 */

export const getStudentCart = async (req, res) => {
  const {studentId} = req.params;

  const query = req.query;

  try {
    const response = await CartService.getCart(studentId, query);
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof NotFoundException) {
      return res.status(error.statusCode).json({message: error.message || 'Error', error});
    }
    return res.status(400).json({message: error?.message || 'error', error});
  }
};

// TODO: Need to confirm!
export const updateStudentCart = async (req, res) => {
  const {studentId} = req.params;
  const {cartId} = req.body;
  try {
    const result = await CartService.updateStudentCart({studentId, cartId});
    return res.status(200).json({message: 'success', result});
  } catch (error) {
    return res.status(error.statusCode || 400).json({message: 'error', error: error?.message || 'error'});
  }
};
export const deleteStudentCart = async (req, res) => {
  const {studentId} = req.params;
  const {cartId} = req.body;
  try {
    const result = await CartService.deleteStudentCart({studentId, cartId});
    return res.status(200).json({message: 'success', result});
  } catch (error) {
    return res.status(error.statusCode || 400).json({message: 'error', error: error?.message || 'error'});
  }
};
