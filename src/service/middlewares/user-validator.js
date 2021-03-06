'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../const`);

const PASSWORD_MIN_LENGTH = 6;
const USER_NAME_REGEXP = /[^0-9$&+,:;=?@#|'<>.^*()%!]+$/;
const ErrorRegisterMessage = {
  NAME: `Имя содержит некорректные символы`,
  NAME_EMPTY: `Укажите имя`,
  SURNAME: `Имя содержит некорректные символы`,
  SURNAME_EMPTY: `Укажите фамилию`,
  EMAIL: `Некорректный электронный адрес`,
  EMAIL_EMPTY: `Укажите электронный адрес`,
  EMAIL_EXISTS: `Электронный адрес уже используется`,
  PASSWORD: `Пароль содержит меньше 6-ти символов`,
  PASSWORD_EMPTY: `Пароль не может быть пустым`,
  PASSWORD_REPEAT: `Пароли не совпадают`,
  ADMIN: `Нельзя зарегистрировать нового администратора`
};

const schema = Joi.object({
  firstName: Joi.string()
    .trim()
    .pattern(USER_NAME_REGEXP)
    .required()
    .messages({'string.empty': ErrorRegisterMessage.NAME_EMPTY})
    .messages({'string.pattern.base': ErrorRegisterMessage.NAME}),

  lastName: Joi.string()
    .trim()
    .pattern(USER_NAME_REGEXP)
    .required()
    .messages({'string.empty': ErrorRegisterMessage.SURNAME_EMPTY})
    .messages({'string.pattern.base': ErrorRegisterMessage.SURNAME}),

  email: Joi.string()
    .trim()
    .email()
    .required()
    .messages({'string.empty': ErrorRegisterMessage.EMAIL_EMPTY})
    .messages({'string.email': ErrorRegisterMessage.EMAIL}),

  password: Joi.string()
    .trim()
    .min(PASSWORD_MIN_LENGTH)
    .required()
    .messages({'string.empty': ErrorRegisterMessage.PASSWORD_EMPTY})
    .messages({'string.min': ErrorRegisterMessage.PASSWORD}),

  passwordRepeated: Joi.string()
    .trim()
    .required()
    .valid(Joi.ref(`password`))
    .required()
    .messages({'any.only': ErrorRegisterMessage.PASSWORD_REPEAT}),

  avatarFullsize: Joi.string()
    .empty(``)
    .trim(),

  avatarSmall: Joi.string()
    .empty(``)
    .trim(),

  isAdmin: Joi.boolean()
    .required()
    .valid(false)
    .messages({'any.only': ErrorRegisterMessage.ADMIN})
});

module.exports = (userService) => async (req, res, next) => {
  const newUser = req.body;

  const {error} = schema.validate(newUser, {abortEarly: false});

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  const userByEmail = await userService.findByEmail(req.body.email);

  if (userByEmail) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(ErrorRegisterMessage.EMAIL_EXISTS);
  }

  return next();
};
