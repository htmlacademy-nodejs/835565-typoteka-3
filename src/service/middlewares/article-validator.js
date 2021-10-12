'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../const`);

const ErrorArticleMessage = {
  CATEGORIES_EMPTY: `Не выбрана ни одна категория.`,

  TITLE_MIN: `Заголовок слишком короткий. Минимум 30 символов.`,
  TITLE_MAX: `Заголовок слишком длинный. Не более 250 символов.`,

  ANNOUNCE_MIN: `Анонс слишком короткий. Минимум 30 символов.`,
  ANNOUNCE_MAX: `Анонс слишком длинный. Не более 250 символов.`,

  FULLTEXT_MAX: `Текст не может содержать более 1000 символов.`,

  PICTURE_FORMAT: `Формат изображения не поддерживается (только jpg или png).`,

  DATE_EMPTY: `Не указана дата публикации.`,
};

const schema = Joi.object({
  categories: Joi.array().items(
      Joi.number()
        .integer()
        .positive()
        .messages({'number.base': ErrorArticleMessage.CATEGORIES_EMPTY})
  )
    .min(1)
    .required(),

  title: Joi.string()
    .min(30)
    .max(250)
    .required()
    .messages({
      'string.min': ErrorArticleMessage.TITLE_MIN,
      'string.max': ErrorArticleMessage.TITLE_MAX
    }),

  announce: Joi.string()
    .min(30)
    .max(250)
    .required()
    .messages({
      'string.min': ErrorArticleMessage.ANNOUNCE_MIN,
      'string.max': ErrorArticleMessage.ANNOUNCE_MAX
    }),

  fullText: Joi.string()
    .empty(``)
    .max(1000)
    .messages({'string.max': ErrorArticleMessage.FULLTEXT_MAX}),

  picture: Joi.string()
    .empty(``)
    .pattern(/.*\.jpg|\.jpeg|\.png$/i)
    .messages({'string.pattern.base': ErrorArticleMessage.PICTURE_FORMAT}),

  createdAt: Joi.string()
    .isoDate()
    .required()
    .messages({'string.empty': ErrorArticleMessage.DATE_EMPTY})
});

module.exports = (req, res, next) => {
  const newArticle = req.body;

  const {error} = schema.validate(newArticle, {abortEarly: false});

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
