'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);
const categoryValidator = require(`../middlewares/category-validator`);

const categoriesRouter = new Router();

module.exports = (app, categoryService) => {
  app.use(`/categories`, categoriesRouter);

  categoriesRouter.get(`/`, async (req, res) => {
    const {needCount} = req.query;
    const categories = await categoryService.findAll({needCount});
    res.status(HttpCode.OK)
      .json(categories);
  });

  categoriesRouter.post(`/`, categoryValidator, async (req, res) => {
    const newCategory = await categoryService.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(newCategory);
  });

  categoriesRouter.put(`/:categoryId`, [routeParamsValidator, categoryValidator], async (req, res) => {
    const {categoryId} = req.params;

    await categoryService.update({id: categoryId, update: req.body});

    return res.status(HttpCode.OK)
      .send(`Updated`);
  });
};
