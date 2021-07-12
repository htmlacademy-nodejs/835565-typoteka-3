'use strict';

const {Router} = require(`express`);
const {
  getHotArticles,
  getLastComments,
  getPreviewArticles,
  getCategories
} = require(`../../utils`);
const api = require(`../api`).getAPI();
const {getLogger} = require(`../../service/lib/logger`);

const mainRouter = new Router();
const logger = getLogger({name: `front-api`});

mainRouter.get(`/`, async (req, res) => {
  try {
    const articles = await api.getArticles();

    const options = {
      previewArticles: getPreviewArticles(articles),
      hotArticles: getHotArticles(articles),
      lastComments: getLastComments(articles),
      currentCategories: getCategories(articles),
    };

    res.render(`main`, {...options});
  } catch (error) {
    logger.error(`Internal server error: ${error.message}`);
    res.render(`errors/500`);
  }
});

mainRouter.get(`/register`, (req, res) => res.render(`registration`));

mainRouter.get(`/login`, (req, res) => res.render(`login`));

mainRouter.get(`/search`, (req, res) => res.render(`search`));

mainRouter.get(`/categories`, (req, res) => res.render(`categories`));

module.exports = mainRouter;
