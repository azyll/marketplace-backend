// @ts-check
import {AlreadyExistException} from '../exceptions/alreadyExist.js';
import {NotFoundException} from '../exceptions/notFound.js';
import {CartService} from '../services/cart.service.js';

/**
 * @typedef {import("../types/index.js").QueryParams} QueryParams
 */

/**
 *  Create student cart
 * @param {import('express').Request<{studentId:string},{},{product:string}>} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>} Response object
 */
export const createStudentCart = async (req, res) => {
  const {studentId} = req.params;

  const {product} = req.body;

  try {
    const newItemToCart = await CartService.addItemToCart(studentId, product);
    return res.status(200).json({message: 'Added to cart', product: newItemToCart});
  } catch (error) {
    if (error instanceof NotFoundException || error instanceof AlreadyExistException) {
      return res.status(error.statusCode).json({message: error.message || 'Error', error});
    }
    return res.status(400).json({message: 'Error', error});
  }
};

/**
 *   Get Student Cart
 * @param {import('express').Request<{studentId:string},{},{},QueryParams>} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>} Response object
 *
 */
export const getStudentCart = async (req, res) => {
  const {studentId} = req.params;
  const query = req.query;

  try {
    const cart = await CartService.getCart(studentId, query);

    return res.status(200).json({message: 'Your Cart', result: cart});
  } catch (error) {
    if (error instanceof NotFoundException) {
      return res.status(error.statusCode).json({message: error.message || 'Error', error});
    }

    return res.status(400).json({message: 'Error', error});
  }
};

// TODO: BELOW -> Need to confirm!
/**
 * Update Student
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns
 */
export const updateStudentCart = async (req, res) => {
  const {studentId} = req.params;
  const {cartId} = req.body;
  try {
    const result = await CartService.updateCartItems(studentId, cartId);
    return res.status(200).json({message: 'success', result});
  } catch (error) {
    return res.status(error.statusCode || 400).json({message: 'error', error: error?.message || 'error'});
  }
};

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns
 */
export const deleteStudentCart = async (req, res) => {
  const {studentId} = req.params;
  const {productVariantIds} = req.body;
  try {
    const result = await CartService.archiveCart(studentId, productVariantIds);

    return res.status(200).json({message: 'success', result});
  } catch (error) {
    if (error instanceof NotFoundException) {
      return res.status(error.statusCode).json({message: 'Failed to delete cart item', error: error.message});
    }

    return res.status(error.statusCode || 400).json({message: 'error', error: error?.message || 'error'});
  }
};
