'use strict';

const {Router} = require(`express`);
const userValidator = require(`../middlewares/user-validator`);
const passwordUtility = require(`../lib/password`);
const {HttpCode} = require(`../../const`);

const userRouter = new Router();

const ErrorAuthMessage = {
  EMAIL: `Электронный адрес не существует`,
  PASSWORD: `Неверный пароль`
};

module.exports = (app, userService) => {
  app.use(`/user`, userRouter);

  userRouter.post(`/`, userValidator(userService), async (req, res) => {
    const data = req.body;

    data.passwordHash = await passwordUtility.hash(data.password);

    const result = await userService.create(data);

    delete result.passwordHash;

    res.status(HttpCode.CREATED)
      .json(result);
  });

  userRouter.post(`/auth`, async (req, res) => {
    const {email, password} = req.body;

    const user = await userService.findByEmail(email);

    if (!user) {
      res.status(HttpCode.UNAUTHORIZED).send(ErrorAuthMessage.EMAIL);
      return;
    }

    const passwordIsCorrect = await passwordUtility.compare(password, user.passwordHash);

    if (passwordIsCorrect) {
      delete user.passwordHash;
      res.status(HttpCode.OK).json(user);
    } else {
      res.status(HttpCode.UNAUTHORIZED).send(ErrorAuthMessage.PASSWORD);
    }
  });
};

