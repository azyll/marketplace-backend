import { Joi } from "sequelize-joi";

export const validate = (schema) => {
  return (req, res, next) => {
    const payload = req.body;

    const result = Joi.object(schema).validate(payload);

    if (result.error) {
      return res.status(400).json({
        error: result.error.details,
      });
    }

    if (!req.value) {
      req.value = {};
    }

    req.value["body"] = result.value;

    next();
  };
};
