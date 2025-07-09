import {Router} from 'express';

import {
  addProduct,
  createProductAttribute,
  getCreateProductData,
  getProductsByStudentDepartment,
  getProduct,
  getProducts,
  updateProductStock
} from '../../controllers/product.controller.js';
import {validate} from '../../middleware/validation.js';
import {Joi} from 'sequelize-joi';
import formidable from 'formidable';
import {SupabaseService} from '../../services/supabase.service.js';
import {uploadFormData} from '../../middleware/upload-formdata.js';

const router = Router();

// Create Product Attribute
router.post('/attribute', createProductAttribute);

// Update Product Stock
router.put('/stock/:productId', updateProductStock);

// Get Create Product
router.get('/create', getCreateProductData);

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
    image: Joi.string().trim().required(),
    type: Joi.string().trim().required(),
    category: Joi.string().trim().required(),
    variants: Joi.string().required(),
    departmentId: Joi.string().required()
  }),
  addProduct
);

// Update Product
router.put('/');

//Archive Product
router.delete('/');

// Get Product
router.get('/:productSlug', getProduct);

export default router;
