// @ts-check
import {AlreadyExistException} from '../exceptions/alreadyExist.js';
import {NotFoundException} from '../exceptions/notFound.js';
import {UnauthorizedException} from '../exceptions/unauthorized.js';
import {CartService} from '../services/cart.service.js';
import {defaultErrorMessage} from '../utils/error-message.js';

/**
 * @typedef {import("../types/index.js").QueryParams} QueryParams
 */

/**
 *  Create student cart
 * @param {import('express').Request<{userId:string},{},{product:string}>} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>} Response object
 */
export const createStudentCart = async (req, res) => {
  const {userId} = req.params;

  const {product} = req.body;

  try {
    await CartService.addItemToCart(userId, product);
    return res.status(200).json({message: 'Cart adding successful'});
  } catch (error) {
    const message = 'Failed to add cart';
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
 *   Get Student Cart
 * @param {import('express').Request<{userId:string},{},{},QueryParams>} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>} Response object
 *
 */
export const getStudentCart = async (req, res) => {
  const {userId} = req.params;
  const query = req.query;

  try {
    const cart = await CartService.getCart(userId, query);

    return res.status(200).json({message: 'Your cart retrieve successfully', ...cart});
  } catch (error) {
    const message = 'Failed to get student cart';
    if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
      return res.status(error.statusCode).json({message, error: error.message});
    }
    return res.status(400).json({message, error: error.message || defaultErrorMessage});
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
  const {userId} = req.params;
  const {cartId} = req.body;
  try {
    await CartService.updateCartItems(userId, cartId);
    return res.status(200).json({message: 'Cart updating successful'});
  } catch (error) {
    const message = 'Failed to update student cart';
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
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns
 */
export const deleteStudentCart = async (req, res) => {
  const {userId} = req.params;
  const {productVariantIds} = req.body;
  try {
    await CartService.archiveCart(userId, productVariantIds);
    return res.status(200).json({message: 'Cart item deletion successful'});
  } catch (error) {
    const message = 'Failed to add cart';
    if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
      return res.status(error.statusCode).json({message, error: error.message});
    }
    return res.status(400).json({message, error: error.message || defaultErrorMessage});
  }
};
