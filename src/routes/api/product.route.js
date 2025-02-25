import { Router } from "express";

import {
  addProduct,
  getProduct,
  getProducts,
} from "../../controllers/product.controller.js";
import { validate } from "../../middleware/validation.js";
import { Joi } from "sequelize-joi";

const router = Router();

router.get("/", getProducts);
// Create Product
router.post(
  "/",
  validate({
    name: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    image: Joi.string().trim().required(),
    type: Joi.string().trim().required(),
    category: Joi.string().trim().required(),
    variants: Joi.array().required(),
    programId: Joi.string().required(),
  }),
  addProduct,
);
// Get Product
router.get("/:id", getProduct);

export default router;
