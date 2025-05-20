// @ts-check
import {DatabaseError} from 'sequelize';
import {AlreadyExistException} from '../exceptions/alreadyExist.js';
import {NotFoundException} from '../exceptions/notFound.js';
import {ProductService} from '../services/product.service.js';
import {ProgramService} from '../services/program.service.js';

/**
 * @typedef {import("../types/index.js").TOrderItem} TOrderItem
 * @typedef {import("../types/index.js").QueryParams} QueryParams
 * @typedef
 */
/**
 *  Create Product
 * @param {import('express').Request<{},{},
 * {name:string, description:string, image:string,
 * type:'Upperwear'| 'Lowerwear'| 'Non-wearable', category:'Uniform'|'Proware'|'Stationery'|'Accessory', programId:string,
 * variants:string}>} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const addProduct = async (req, res) => {
  try {
    /**
     * @type {{ name:string,productAttributeId:string,size:string,price:number,stockQuantity:number}[]}
     */
    const variants = [];
    req.body.variants.split(')').map((variant) => {
      if (variant === '') return;

      variants.push(JSON.parse(variant.split('=')[1]));
    });

    const result = await ProductService.createProduct({
      ...req.body,
      variants
    });

    return res.status(200).json({message: 'success', result});
  } catch (error) {
    console.log('error', error);
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
 * Get All Products
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
    console.log(error, 'error');
    return res.status(404).json({message: 'error', error});
  }
};

/**
 *  Get Single Product
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
 * Archive / Delete Product
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
 *  Update / Edit product
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const updateProduct = async (req, res) => {
  const {id} = req.params;
  const newProduct = req.body;
  try {
    const result = await ProductService.updateProduct(id, newProduct);
    return res.status(200).json({message: 'product', result});
  } catch (error) {
    return res.status(404).json({message: 'error', error});
  }
};

/**
 *  Create Product Attribute
 * @param {import('express').Request<{},{},{name:string}>} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const createProductAttribute = async (req, res) => {
  try {
    const {name} = req.body;
    const productAttribute = await ProductService.createAttribute(name);
    return res.status(200).json({message: 'product', result: productAttribute});
  } catch (error) {
    if (error instanceof AlreadyExistException) return res.status(404).json({message: 'error', error: error.message});
    return res.status(404).json({message: 'error', error: error.message});
  }
};

/**
 *  Get Product Attribute and Programs for Product Creation
 * @param {import('express').Request<{},{},{name:string}>} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const getCreateProductData = async (req, res) => {
  try {
    const productAttribute = await ProductService.getAttributes();
    const programs = await ProgramService.getPrograms();

    return res.status(200).json({
      message: 'product',
      result: {
        productAttribute,
        programs
      }
    });
  } catch (error) {
    return res.status(404).json({message: 'error', error: error.message});
  }
};
