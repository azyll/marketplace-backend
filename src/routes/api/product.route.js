import {Router} from 'express';

import {addProduct, getProduct, getProducts} from '../../controllers/product.controller.js';
import {validate} from '../../middleware/validation.js';
import {Joi} from 'sequelize-joi';
import formidable from 'formidable';
import {SupabaseService} from '../../services/supabase.service.js';

const router = Router();

router.get('/', getProducts);
// Create Product

router.post(
  '/',
  async (req, res, next) => {
    const form = formidable({
      keepExtensions: true,
      uploadDir: './uploads/images/products',
      maxFiles: 1,
      maxFieldsSize: 5 * 1024 * 1024,
      filter: function ({name, originalFilename, mimetype}) {
        // Accept only images
        return mimetype && mimetype.includes('image');
      },
      filename: function (name, ext, part, form) {
        return `${Date.now()}-${form.fields.name[0]}.${part.originalFilename.split('.')[1]}`;
      }
    });

    await form.parse(req, async (err, fields, files) => {
      if (err) {
        next(err);
      }
      const transformedFields = Object.keys(fields).reduce((acc, key) => {
        acc[key] = fields[key][0]; // Take the first value from the array
        return acc;
      }, {});

      /**
       * TODO: Convert the variants string into object array
       */
      if (files.image && files.image[0]) {
        transformedFields.image = files.image[0].newFilename;
      }

      req.body = transformedFields;
      next();
    });
  },
  validate({
    name: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    image: Joi.string().trim().required(),
    type: Joi.string().trim().required(),
    category: Joi.string().trim().required(),
    variants: Joi.string().required(),
    programId: Joi.string().required()
  }),
  addProduct
);
// Get Product
router.get('/:id', getProduct);

export default router;
