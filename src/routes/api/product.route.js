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

// Create Product Attribute
router.put('/stock/:id', updateProductStock);

// Create Product
router.get('/create', getCreateProductData);

router.get('/user/:id', getProductsByStudentDepartment);

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
router.get('/:slug', getProduct);

export default router;
