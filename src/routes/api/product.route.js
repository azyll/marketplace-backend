import {Router} from 'express';

import {
  addProduct,
  createProductAttribute,
  getCreateProductData,
  getDepartmentProducts,
  getProduct,
  getProducts
} from '../../controllers/product.controller.js';
import {validate} from '../../middleware/validation.js';
import {Joi} from 'sequelize-joi';
import formidable from 'formidable';
import {SupabaseService} from '../../services/supabase.service.js';
import {uploadFormData} from '../../middleware/upload-formdata.js';

const router = Router();

// Create Product Attribute
router.post('/attribute', createProductAttribute);

// Create Product
router.get('/create', getCreateProductData);

//Get All Products
router.get('/', getProducts);

//Get Department Products
router.get('/department/:id', getDepartmentProducts);

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

// Get Product
router.get('/:id', getProduct);

export default router;
