'use strict';

const {Router} = require(`express`);
const {HumanizedDateFormat} = require(`../../const`);
const {getLogger} = require(`../../service/lib/logger`);
const {humanizeDate} = require(`../../utils/utils-common`);
const api = require(`../api`).getAPI();

const myRouter = new Router();
const logger = getLogger({name: `my-routes api`});

const utils = {
  humanizeDate,
  HumanizedDateFormat
};

myRouter.get(`/`, async (req, res) => {
  try {
    const {current: articles} = await api.getArticles({user: true});
    res.render(`my`, {articles, ...utils});
  } catch (error) {
    logger.error(`Internal server error: ${error.message}`);
    res.render(`errors/500`);
  }
});

myRouter.get(`/comments`, async (req, res) => {
  try {
    const comments = await api.getComments({needArticles: true});
    res.render(`comments`, {comments, ...utils});
  } catch (error) {
    logger.error(`Internal server error: ${error.message}`);
    res.render(`errors/500`);
  }
});

module.exports = myRouter;
