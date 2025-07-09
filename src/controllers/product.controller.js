// @ts-check
import {DatabaseError} from 'sequelize';
import {AlreadyExistException} from '../exceptions/alreadyExist.js';
import {NotFoundException} from '../exceptions/notFound.js';
import {ProductService} from '../services/product.service.js';
import {DepartmentService} from '../services/department.service.js';
import {UnauthorizedException} from '../exceptions/unauthorized.js';
import {defaultErrorMessage} from '../utils/error-message.js';
import {convertFromSlug} from '../utils/slug-helper.js';

/**
 * @typedef {import("../types/index.js").TOrderItem} TOrderItem
 * @typedef {import("../types/index.js").QueryParams} QueryParams
 * @typedef
 */
/**
 *  Create Product
 * @param {import('express').Request<{},{},
 * {name:string, description:string, image:string,
 * type:'Upper Wear'| 'Lower Wear'| 'Non-wearable', category:'Uniform'|'Proware'|'Stationery'|'Accessory', departmentId:string,
 * variants:string}>} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const addProduct = async (req, res) => {
  try {
    /**
     * @type {{ name:string,productAttributeId:string,size:string,price:number,stockQuantity:number}[]}
     */
    const variants = JSON.parse(req.body.variants);
    await ProductService.createProduct({
      ...req.body,
      variants
    });

    return res.status(200).json({message: 'Product create successfully'});
  } catch (error) {
    const message = 'Failed to create product';
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
 * /**
 * @param {import('express').Request<
 *   {},
 *   {},
 *   {},
 *   QueryParams &{
 *     category: string,
 *     name: string,
 *     department: string,
 *     latest: boolean,
 *   }
 * >} req
 
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const getProducts = async (req, res) => {
  try {
    const data = await ProductService.getProducts(req.query);
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
 *  Get Single Product
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const getProduct = async (req, res) => {
  const {productSlug} = req.params;
  try {
    const data = await ProductService.getProduct(convertFromSlug(productSlug));
    return res.status(200).json({message: 'Product retrieve successfully', data});
  } catch (error) {
    const message = 'Failed to get product';
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
 *  Update Product Stock
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const updateProductStock = async (req, res) => {
  const {productId} = req.params;
  const {productVariantId, newStockQuantity} = req.body;
  try {
    await ProductService.updateProductStock(productId, productVariantId, newStockQuantity);
    return res.status(200).json({message: 'Product stock update successfully'});
  } catch (error) {
    const message = 'Failed to update product stock';
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
 *  Get Products of Department
 * @param {import('express').Request<{userId:string},{},{},QueryParams>} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const getProductsByStudentDepartment = async (req, res) => {
  const {userId} = req.params;

  try {
    const data = await ProductService.getProductsByStudentDepartment(userId);
    return res.status(200).json({message: 'Product retrieve successfully', data});
  } catch (error) {
    const message = 'Failed to get products by department';
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

// /**
//  *  Get Products of Department
//  * @param {import('express').Request<{id:string},{},{},QueryParams>} req
//  * @param {import('express').Response} res
//  * @returns {Promise<import('express').Response>}
//  */
// export const getProductsByStudentDepartment = async (req, res) => {
//   const {id} = req.params;
//   const query = req.query;
//   try {
//     const result = await ProductService.getProductsByStudentDepartment(id, query);
//     return res.status(200).json({message: 'product', result});
//   } catch (error) {
//     return res.status(404).json({message: 'error', error});
//   }
// };

/**
 * Archive / Delete Product
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const deleteProduct = async (req, res) => {
  const {id} = req.params;
  try {
    await ProductService.archiveProduct(id);
    return res.status(200).json({message: 'Product delete successfully'});
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
    await ProductService.updateProduct(id, newProduct);
    return res.status(200).json({message: 'Product update successfully'});
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
    await ProductService.createAttribute(name);
    return res.status(200).json({message: 'Product attribute create successfully'});
  } catch (error) {
    if (error instanceof AlreadyExistException) return res.status(404).json({message: 'error', error: error.message});
    console.log(error);
    return res.status(404).json({message: 'error', error: error.message});
  }
};

/**
 *  Get Product Attribute and Department for Product Creation
 * @param {import('express').Request<{},{},{name:string}>} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export const getCreateProductData = async (req, res) => {
  try {
    const productAttribute = await ProductService.getAttributes();
    const departments = await DepartmentService.getDepartments();

    return res.status(200).json({
      message: 'Product creation retrieve successfully',
      result: {
        productAttribute,
        departments
      }
    });
  } catch (error) {
    return res.status(404).json({message: 'error', error: error.message});
  }
};
