'use strict';

const {Router} = require(`express`);
const {
  getHotArticles,
  getPreviewArticles,
} = require(`../../utils/utils-data`);
const {humanizeDate} = require(`../../utils/utils-common`);
const {HumanizedDateFormat, LAST_COMMENTS_MAX_NUM} = require(`../../const`);
const api = require(`../api`).getAPI();
const {getLogger} = require(`../../service/lib/logger`);

const mainRouter = new Router();
const logger = getLogger({name: `main-routes api`});

const utils = {
  humanizeDate,
  HumanizedDateFormat,
};


mainRouter.get(`/`, async (req, res) => {
  try {
    const [articles, categories, comments] = await Promise.all([
      await api.getArticles({comments: true}),
      await api.getCategories(true),
      await api.getComments(LAST_COMMENTS_MAX_NUM)
    ]);

    const options = {
      previewArticles: getPreviewArticles(articles),
      hotArticles: getHotArticles(articles),
      lastComments: comments,
      categories,
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
      // добавить вывод error.message в шаблоне /500.pug
      res.render(`errors/500`);
    }
  }
});

mainRouter.get(`/categories`, async (req, res) => {
  try {
    const categories = await api.getCategories();
    res.render(`categories`, {categories});
  } catch (error) {
    logger.error(`Internal server error: ${error.message}`);
    res.render(`errors/500`);
  }
});

module.exports = mainRouter;
