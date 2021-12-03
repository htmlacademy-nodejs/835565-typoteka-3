'use strict';

const {Router} = require(`express`);
const {HumanizedDateFormat} = require(`../../const`);
const checkAuth = require(`../middlewares/auth`);
const {getLogger} = require(`../../service/lib/logger`);
const {humanizeDate} = require(`../../utils/utils-common`);
const admin = require(`../middlewares/admin`);
const api = require(`../api`).getAPI();

const myRouter = new Router();
const logger = getLogger({name: `my-routes api`});

const utils = {
  humanizeDate,
  HumanizedDateFormat
};

myRouter.use(checkAuth);
myRouter.use(admin);

myRouter.get(`/`, async (req, res) => {
  const {user} = req.session;

  try {
    const {total: articles} = await api.getArticles();
    res.render(`my`, {articles, user, ...utils});
  } catch (error) {
    logger.error(`Internal server error: ${error.message}`);
    res.render(`errors/500`);
  }
});

myRouter.get(`/comments`, async (req, res) => {
  const {user} = req.session;

  try {
    const comments = await api.getComments();
    res.render(`comments`, {comments, user, ...utils});
  } catch (error) {
    logger.error(`Internal server error: ${error.message}`);
    res.render(`errors/500`);
  }
});

module.exports = myRouter;
