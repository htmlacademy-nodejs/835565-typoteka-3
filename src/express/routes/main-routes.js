'use strict';

const {Router} = require(`express`);
const {
  getHotArticles,
  getLastComments,
  getPreviewArticles,
  getCategories,
  humanizeDate
} = require(`../../utils`);
const {HumanizedDateFormat} = require(`../../const`);
const api = require(`../api`).getAPI();
const {getLogger} = require(`../../service/lib/logger`);

const mainRouter = new Router();
const logger = getLogger({name: `front-api`});

const utils = {
  humanizeDate,
  HumanizedDateFormat,
};


mainRouter.get(`/`, async (req, res) => {
  try {
    const articles = await api.getArticles();

    const options = {
      previewArticles: getPreviewArticles(articles),
      hotArticles: getHotArticles(articles),
      lastComments: getLastComments(articles),
      currentCategories: getCategories(articles),
      ...utils
    };

    res.render(`main`, {...options});
  } catch (error) {
    logger.error(`Internal server error: ${error.message}`);
    res.render(`errors/500`);
  }
});

mainRouter.get(`/register`, (req, res) => res.render(`registration`));

mainRouter.get(`/login`, (req, res) => res.render(`login`));

mainRouter.get(`/search`, async (req, res) => {
  const {search} = req.query;
  try {
    if (search) {
      const options = {
        search,
        results: await api.search(search),
        ...utils,
      };
      res.render(`search`, {...options});
    } else {
      res.render(`search`);
    }
  } catch (error) {
    try {
      res.render(`search-empty`, {search});
    } catch (err) {
      logger.error(`Internal server error: ${err.message}`);
      res.render(`errors/500`);
    }
  }
});

mainRouter.get(`/categories`, (req, res) => res.render(`categories`));

module.exports = mainRouter;
