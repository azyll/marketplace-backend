import { Router } from "express";

import {
  addProduct,
  getProducts,
} from "../../controllers/product.controller.js";
import { validate } from "../../middleware/validation.js";
import { Joi } from "sequelize-joi";

const router = Router();

router.get("/", getProducts);
// Post new Product
router.post(
  "/",
  validate({
    name: Joi.string().trim().required(),
    price: Joi.number().required(),
    typeId: Joi.string().trim().required(),
  }),
  addProduct,
);

export default router;
