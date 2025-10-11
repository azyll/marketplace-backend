import {Router} from 'express';

import {
  addProduct,
  createProductAttribute,
  getCreateProductData,
  getProductsByStudentDepartment,
  getProduct,
  getProducts,
  updateProductStock,
  getProductsFilteredByStudentDepartment,
  restoreProduct,
  deleteProduct,
  updateProduct,
  getInventory,
  getInventoryAlerts,
  getInventoryValue
} from '../../controllers/product.controller.js';
import {validate} from '../../middleware/validation.js';
import {Joi} from 'sequelize-joi';
import formidable from 'formidable';
import {uploadFormData} from '../../middleware/upload-image-formdata.js';
import {auth} from '../../middleware/auth.js';

const router = Router();

//Archive Product
router.put('/:productId/restore', auth(['admin', 'employee']), restoreProduct);
// Create Product Attribute
router.post(
  '/attribute',
  auth(['admin', 'employee']),
  validate({
    name: Joi.string().trim().required()
  }),
  createProductAttribute
);

// Update Product Stock
router.put(
  '/stock',
  auth(['admin', 'employee']),
  validate({
    productVariantId: Joi.string().uuid().trim().required(),
    newStockQuantity: Joi.number().integer().min(0)
  }),
  updateProductStock
);

router.get('/inventory/alerts', auth(['admin', 'employee']), getInventoryAlerts);
router.get('/inventory/value', auth(['admin', 'employee']), getInventoryValue);
router.get('/inventory', auth(['admin', 'employee']), getInventory);

// Get Create Product
router.get('/create', getCreateProductData);

router.get(
  '/user/:userId/all',
  auth(['student'], {
    selfOnly: {
      param: 'userId',
      roles: ['student']
    }
  }),
  getProductsFilteredByStudentDepartment
);

// GET products by student department
router.get(
  '/user/:userId',
  auth(['student'], {
    selfOnly: {
      param: 'userId',
      roles: ['student']
    }
  }),
  getProductsByStudentDepartment
);

//Get All Products
router.get('/', getProducts);

//Get Department Products

// Create Product
router.post(
  '/',
  auth(['admin', 'employee']),
  uploadFormData('products'),
  validate({
    name: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    image: Joi.string().trim().optional(),
    type: Joi.string().trim().required(),
    category: Joi.string().trim().required(),
    variants: Joi.string().required(),
    departmentId: Joi.string().required(),
    level: Joi.string().valid('shs', 'tertiary', 'all').optional()
  }),
  addProduct
);

// Update Product
router.put(
  '/:productId',
  auth(['admin', 'employee']),
  uploadFormData('products', {upsert: true}),
  validate({
    name: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    image: Joi.string().trim().optional(),
    type: Joi.string().trim().required(),
    category: Joi.string().trim().required(),
    variants: Joi.string().required(),
    departmentId: Joi.string().required(),
    level: Joi.string().valid('shs', 'tertiary', 'all').optional()
  }),
  updateProduct
);

//Archive Product
router.delete('/:productId', auth(['admin', 'employee']), deleteProduct);

// Get Product
router.get('/:productSlug', getProduct);

export default router;
