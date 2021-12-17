'use strict';

const Joi = require(`joi`);
const {HttpCode, COMMENT_CHAR_LENGTH} = require(`../../const`);

const CommentTextLimit = {
  MIN: 20,
  MAX: COMMENT_CHAR_LENGTH
};
const ErrorCommentMessage = {
  TEXT_EMPTY: `Нельзя оставить пустой комментарий`,
  TEXT_MIN: `Комментарий слишком короткий. Минимум 20 символов`,
  TEXT_MAX: `Комментарий слишком длинный. Максимум 500 символов`,
  USER_ID: `Некорректный идентификатор пользователя`,
  NOT_FOUND: `Искомый комментарий не найден`
};

const schema = Joi.object({
  text: Joi.string()
    .trim()
    .min(CommentTextLimit.MIN)
    .max(CommentTextLimit.MAX)
    .required()
    .messages({'string.empty': ErrorCommentMessage.TEXT_EMPTY})
    .messages({'string.min': ErrorCommentMessage.TEXT_MIN})
    .messages({'string.max': ErrorCommentMessage.TEXT_MAX}),

  userId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({'number.base': ErrorCommentMessage.USER_ID})
});

const commentValidator = (req, res, next) => {
  const comment = req.body;

  const {error} = schema.validate(comment, {abortEarly: false});

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};

const commentExists = (commentService) => async (req, res, next) => {
  const {commentId} = req.params;
  const comment = await commentService.findOne(commentId);

  if (!comment) {
    return res.status(HttpCode.NOT_FOUND)
      .send(ErrorCommentMessage.NOT_FOUND);
  }

  return next();
};

module.exports = {
  commentValidator,
  commentExists
};
