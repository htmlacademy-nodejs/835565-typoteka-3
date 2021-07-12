'use strict';

const {Router} = require(`express`);
const {getLogger} = require(`../../service/lib/logger`);
const {parseCommentsForCommentPage} = require(`../../utils`);
const api = require(`../api`).getAPI();

const myRouter = new Router();
const logger = getLogger({name: `front-api`});

myRouter.get(`/`, async (req, res) => {
  try {
    const articles = await api.getArticles();
    res.render(`my`, {articles});
  } catch (error) {
    logger.error(`Internal server error: ${error.message}`);
    res.render(`errors/500`);
  }
});

myRouter.get(`/comments`, async (req, res) => {
  try {
    const comments = await api.getArticles()
      .then((results) => parseCommentsForCommentPage(results));
    res.render(`comments`, {comments});
  } catch (error) {
    logger.error(`Internal server error: ${error.message}`);
    res.render(`errors/500`);
  }
});

module.exports = myRouter;
