/**
 * @typedef {import("../types/index.js").QueryParams} QueryParams
 */

import {ProductService} from '../services/product.service.js';

/**
 * Get Inventory data
 * @param {import('express').Request<{},{},{},QueryParams>} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const getInventory = async (req, res) => {
  const query = req.query;
  try {
    const products = await ProductService.getProducts(query, true);
    return res.status(200).json({
      message: 'inventory',
      response: {
        products
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({message: 'error', error});
  }
};
