'use strict';

const {Router} = require(`express`);
const {HumanizedDateFormat} = require(`../../const`);
const {getLogger} = require(`../../service/lib/logger`);
const {parseCommentsForCommentPage, humanizeDate, sortByLatestDate} = require(`../../utils`);
const api = require(`../api`).getAPI();

const myRouter = new Router();
const logger = getLogger({name: `front-api`});

myRouter.get(`/`, async (req, res) => {
  try {
    const options = {
      articles: await api.getArticles()
        .then((results) => results.sort(sortByLatestDate)),
      humanizeDate,
      HumanizedDateFormat,
    };
    res.render(`my`, {...options});
  } catch (error) {
    logger.error(`Internal server error: ${error.message}`);
    res.render(`errors/500`);
  }
});

myRouter.get(`/comments`, async (req, res) => {
  try {
    const options = {
      comments: await api.getArticles()
        .then((results) => parseCommentsForCommentPage(results)),
      humanizeDate,
      HumanizedDateFormat,
    };
    res.render(`comments`, {...options});
  } catch (error) {
    logger.error(`Internal server error: ${error.message}`);
    res.render(`errors/500`);
  }
});

module.exports = myRouter;
