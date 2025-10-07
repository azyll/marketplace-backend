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
  getInventory
} from '../../controllers/product.controller.js';
import {validate} from '../../middleware/validation.js';
import {Joi} from 'sequelize-joi';
import formidable from 'formidable';
import {uploadFormData} from '../../middleware/upload-image-formdata.js';

const router = Router();

//Archive Product
router.put('/:productId/restore', restoreProduct);
// Create Product Attribute
router.post('/attribute', createProductAttribute);

// Update Product Stock
router.put('/stock/:productId', updateProductStock);

// Get Create Product
router.get('/inventory', getInventory);
router.get('/create', getCreateProductData);

router.get('/user/:userId/all', getProductsFilteredByStudentDepartment);

// GET products by student department
router.get('/user/:userId', getProductsByStudentDepartment);

//Get All Products
router.get('/', getProducts);

//Get Department Products

// Create Product
router.post(
  '/',
  uploadFormData('products'),
  validate({
    name: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    image: Joi.string().trim().optional(),
    type: Joi.string().trim().required(),
    category: Joi.string().trim().required(),
    variants: Joi.string().required(),
    departmentId: Joi.string().required()
  }),
  addProduct
);

// Update Product
router.put('/:productId', uploadFormData('products', {upsert: true}), updateProduct);

//Archive Product
router.delete('/:productId', deleteProduct);

// Get Product
router.get('/:productSlug', getProduct);

export default router;
