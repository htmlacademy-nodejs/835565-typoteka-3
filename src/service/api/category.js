'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);

const categoriesRouter = new Router();

module.exports = (app, service) => {
  app.use(`/categories`, categoriesRouter);

  categoriesRouter.get(`/`, async (req, res) => {
    const categories = await service.findAll();
    res.status(HttpCode.OK)
      .json(categories);
  });
};
