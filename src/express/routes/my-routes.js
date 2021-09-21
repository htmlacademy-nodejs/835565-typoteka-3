'use strict';

const {Router} = require(`express`);
const {HumanizedDateFormat} = require(`../../const`);
const {getLogger} = require(`../../service/lib/logger`);
const {humanizeDate, sortByLatestDate} = require(`../../utils/utils-common`);
const api = require(`../api`).getAPI();

const myRouter = new Router();
const logger = getLogger({name: `my-routes api`});

myRouter.get(`/`, async (req, res) => {
  try {
    const options = {
      articles: await api.getArticles({comments: false})
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
    const comments = await api.getComments();
    const options = {
      humanizeDate,
      HumanizedDateFormat,
    };
    res.render(`comments`, {comments, ...options});
  } catch (error) {
    logger.error(`Internal server error: ${error.message}`);
    res.render(`errors/500`);
  }
});

module.exports = myRouter;
