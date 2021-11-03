'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);
const categoryValidator = require(`../middlewares/category-validator`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);

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

  categoriesRouter.get(`/:categoryId`, routeParamsValidator, async (req, res) => {
    const {categoryId} = req.params;
    const {limit, offset} = req.query;

    const [category, {count, articlesByCategory}] = await Promise.all([
      categoryService.findOne(categoryId),
      categoryService.findPage({categoryId, limit, offset})
    ]);

    return res.status(HttpCode.OK)
      .json({
        category,
        count,
        articlesByCategory
      });
  });

  categoriesRouter.put(`/:categoryId`, [routeParamsValidator, categoryValidator], async (req, res) => {
    const {categoryId} = req.params;

    await categoryService.update({id: categoryId, update: req.body});

    return res.status(HttpCode.OK)
      .send(`Updated`);
  });

  categoriesRouter.delete(`/:categoryId`, routeParamsValidator, async (req, res) => {
    const {categoryId} = req.params;

    const category = await categoryService.findOne(categoryId);

    if (!category) {
      return res.status(HttpCode.NOT_FOUND)
      .send(`Unable to delete unexisting category!`);
    }

    await categoryService.drop({id: categoryId});

    return res.status(HttpCode.OK)
      .send(`Deleted`);
  });
};
