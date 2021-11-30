'use strict';

const Joi = require(`joi`);

const {HttpCode} = require(`../../const`);

const ErrorArticleMessage = {
  CATEGORIES_EMPTY: `Не выбрана ни одна категория`,
  TITLE_EMPTY: `Укажите заголовок публикации`,
  TITLE_MIN: `Заголовок слишком короткий. Минимум 30 символов`,
  TITLE_MAX: `Заголовок слишком длинный. Не более 250 символов`,
  ANNOUNCE_EMPTY: `Укажите анонс публикации`,
  ANNOUNCE_MIN: `Анонс слишком короткий. Минимум 30 символов`,
  ANNOUNCE_MAX: `Анонс слишком длинный. Не более 250 символов`,
  FULLTEXT_MAX: `Текст не может содержать более 1000 символов`,
  PICTURE_FORMAT: `Формат изображения не поддерживается (только jpg или png)`,
  DATE_EMPTY: `Не указана дата публикации`,
  USER_ID: `Некорректный идентификатор пользователя`,
  NOT_FOUND: `Такой публикации не существует`
};

const schema = Joi.object({
  categories: Joi.array().items(
      Joi.number()
        .integer()
        .positive()
  )
  .min(1)
  .required()
  .messages({'any.required': ErrorArticleMessage.CATEGORIES_EMPTY}),

  title: Joi.string()
    .trim()
    .min(30)
    .max(250)
    .required()
    .messages({
      'string.empty': ErrorArticleMessage.TITLE_EMPTY,
      'string.min': ErrorArticleMessage.TITLE_MIN,
      'string.max': ErrorArticleMessage.TITLE_MAX
    }),

  announce: Joi.string()
    .trim()
    .min(30)
    .max(250)
    .required()
    .messages({
      'string.empty': ErrorArticleMessage.ANNOUNCE_EMPTY,
      'string.min': ErrorArticleMessage.ANNOUNCE_MIN,
      'string.max': ErrorArticleMessage.ANNOUNCE_MAX
    }),

  fullText: Joi.string()
    .empty(``)
    .trim()
    .max(1000)
    .messages({'string.max': ErrorArticleMessage.FULLTEXT_MAX}),

  fullsizePicture: Joi.string()
    .empty(``)
    .trim(),

  previewPicture: Joi.string()
    .empty(``)
    .trim(),

  createdAt: Joi.string()
    .isoDate()
    .required()
    .messages({'string.empty': ErrorArticleMessage.DATE_EMPTY}),

  userId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({'number.base': ErrorArticleMessage.USER_ID})
});

const articleValidator = (req, res, next) => {
  const newArticle = req.body;

  const {error} = schema.validate(newArticle, {abortEarly: false});

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};

const articleExists = (articlesService) => async (req, res, next) => {
  const {articleId} = req.params;
  const article = await articlesService.findOne({articleId});

  if (!article) {
    return res.status(HttpCode.NOT_FOUND)
      .send(ErrorArticleMessage.NOT_FOUND);
  }

  return next();
};

module.exports = {
  articleValidator,
  articleExists
};