'use strict';

const Joi = require(`joi`);

const {HttpCode} = require(`../../const`);

const ErrorCategoryMessage = {
  CATEGORY_NAME_EMPTY: `Укажите название категории!`,
  CATEGORY_NAME_MIN: `Название категории слишком короткое. Минимум 5 символов.`,
  CATEGORY_NAME_MAX: `Название категории слишком длинное. Максимум 30 символов.`,
  CATEGORY_HAS_ARTICLE: `Нельзя удалить категорию, связанную с одной или несколькими публикациями`,
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

const categoryExists = (service) => async (req, res, next) => {
  const {categoryId} = req.params;

  const category = await service.findOne({id: categoryId});

  if (!category) {
    return res.status(HttpCode.NOT_FOUND)
      .send(`Unable to delete unexisting category!`);
  }

  return next();
};

const categoryValidator = (req, res, next) => {
  const category = req.body;

  const {error} = schema.validate(category);

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};

const categoryHasArticle = (service) => async (req, res, next) => {
  const {categoryId} = req.params;

  const category = await service.findOne({id: categoryId, needCount: true});

  if (category.count > 0) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(ErrorCategoryMessage.CATEGORY_HAS_ARTICLE);
  }

  return next();
};

module.exports = {
  categoryExists,
  categoryValidator,
  categoryHasArticle
};
