'use strict';

const {Router} = require(`express`);
const {HumanizedDateFormat} = require(`../../const`);
const {humanizeDate} = require(`../../utils`);
const {getLogger} = require(`../../service/lib/logger`);

const api = require(`../api`).getAPI();
const articlesRouter = new Router();
const logger = getLogger({name: `front-api`});

articlesRouter.get(`/add`, (req, res) => res.render(`post-edit`));

articlesRouter.get(`/edit/:id`, async (req, res) => {
  try {
    const {id} = req.params;
    const options = {
      article: await api.getArticle(id),
      categories: await api.getCategories(),
      humanizeDate,
      HumanizedDateFormat,
    };
    res.render(`post-edit`, {...options});
  } catch (error) {
    logger.error(`Internal server error: ${error.message}`);
    res.render(`errors/500`);
  }
});

articlesRouter.get(`/category/:id`, (req, res) => res.render(`posts-by-category`));

articlesRouter.get(`/:id`, (req, res) => res.render(`post`));

module.exports = articlesRouter;
