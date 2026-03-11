const Joi = require("joi");

const createSchema = Joi.object({
  credits: Joi.number().integer().min(0).optional().messages({
    "number.base": "Credits must be a number",
    "number.integer": "Credits must be an integer",
    "number.min": "Credits cannot be negative",
  }),
});

module.exports = {
  createSchema,
};
