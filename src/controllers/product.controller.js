// @ts-check
import {DatabaseError} from 'sequelize';
import {AlreadyExistException} from '../exceptions/alreadyExist.js';
import {NotFoundException} from '../exceptions/notFound.js';
import {ProductService} from '../services/product.service.js';

/**
 * @typedef {import("../types/index.js").TOrderItem} TOrderItem
 * @typedef {import("../types/index.js").QueryParams} QueryParams
 * @typedef
 */

/**
 * Post => Create Product
 * @param {import('express').Request<{},{},
 * {name:string, description:string, image:string,
 * type:"top"| "bottom"| "n/a",  category:"uniform"| "proware"| "stationery accessory", programId:string,
 * variants:{ name:string, size:string, price:number, stockQuantity:number}[]}>} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const addProduct = async (req, res) => {
  try {
    const result = await ProductService.createProduct(req.body);
    return res.status(200).json({message: 'success', result});
  } catch (error) {
    if (error instanceof NotFoundException) {
      return res.status(error.statusCode).json({message: error.message || 'Error', error});
    } else if (error instanceof AlreadyExistException) {
      return res.status(error.statusCode).json({message: error.message || 'Error', error});
    } else if (error instanceof DatabaseError) {
      return res.status(400).json({message: 'Invalid Credential', error});
    }
    return res.status(404).json({message: 'error', error});
  }
};

/**
 * Get => Get All Products
 * @param {import('express').Request<{},{},{},QueryParams>} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const getProducts = async (req, res) => {
  const query = req.query;
  try {
    const result = await ProductService.getProducts(query);
    return res.status(200).json({message: 'products', result});
  } catch (error) {
    return res.status(404).json({message: 'error', error});
  }
};

/**
 * Get => Get Single Product
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const getProduct = async (req, res) => {
  const {id} = req.params;
  try {
    const result = await ProductService.getProduct(id);
    return res.status(200).json({message: 'product', result});
  } catch (error) {
    return res.status(404).json({message: 'error', error});
  }
};

/**
 * Delete => Delete Product
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const deleteProduct = async (req, res) => {
  const {id} = req.params;
  try {
    const result = await ProductService.archiveProduct(id);
    return res.status(200).json({message: 'product', result});
  } catch (error) {
    return res.status(404).json({message: 'error', error});
  }
};

/**
 * Put => Edit Product
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const editProduct = async (req, res) => {
  const {id} = req.params;
  try {
    const result = await ProductService.editProduct(id);
    return res.status(200).json({message: 'product', result});
  } catch (error) {
    return res.status(404).json({message: 'error', error});
  }
};
