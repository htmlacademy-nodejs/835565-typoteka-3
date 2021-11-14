'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../const`);

const ErrorCommentMessage = {
  TEXT_EMPTY: `Нельзя оставить пустой комментарий.`,
  TEXT_MIN: `Комментарий слишком короткий. Минимум 20 символов.`,
  USER_ID: `Некорректный идентификатор пользователя`
};

const schema = Joi.object({
  text: Joi.string()
    .trim()
    .min(20)
    .required()
    .messages({'string.empty': ErrorCommentMessage.TEXT_EMPTY})
    .messages({'string.min': ErrorCommentMessage.TEXT_MIN}),

  userId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({'number.base': ErrorCommentMessage.USER_ID})
});

module.exports = (req, res, next) => {
  const comment = req.body;

  const {error} = schema.validate(comment, {abortEarly: false});

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
