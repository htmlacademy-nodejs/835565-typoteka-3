'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../const`);

const ErrorCategoryMessage = {
  CATEGORY_NAME_EMPTY: `Укажите название категории!`,
  CATEGORY_NAME_MIN: `Название категории слишком короткое. Минимум 5 символов.`,
  CATEGORY_NAME_MAX: `Название категории слишком длинное. Максимум 30 символов.`,
};

const schema = Joi.object({
  name: Joi.string()
    .trim()
    .min(5)
    .max(30)
    .required()
    .messages({'string.empty': ErrorCategoryMessage.CATEGORY_NAME_EMPTY})
    .messages({'string.min': ErrorCategoryMessage.CATEGORY_NAME_MIN})
    .messages({'string.max': ErrorCategoryMessage.CATEGORY_NAME_MAX})
});

module.exports = (req, res, next) => {
  const category = req.body;

  const {error} = schema.validate(category);

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
