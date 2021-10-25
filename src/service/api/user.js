'use strict';

const {Router} = require(`express`);
const userValidator = require(`../middlewares/user-validator`);
const passwordUtility = require(`../lib/password`);
const {HttpCode} = require(`../../const`);

const userRouter = new Router();

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
};

