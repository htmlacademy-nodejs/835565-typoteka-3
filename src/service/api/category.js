'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);

const categoriesRouter = new Router();

module.exports = (app, categoryService) => {
  app.use(`/categories`, categoriesRouter);

  categoriesRouter.get(`/`, async (req, res) => {
    const {needCount} = req.query;
    const categories = await categoryService.findAll({needCount});
    res.status(HttpCode.OK)
      .json(categories);
  });
};
