'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);

const categoriesRouter = new Router();

module.exports = (app, service) => {
  app.use(`/categories`, categoriesRouter);

  categoriesRouter.get(`/`, (req, res) => {
    const categories = service.findAll();
    res.status(HttpCode.OK)
      .json(categories);
  });
};
