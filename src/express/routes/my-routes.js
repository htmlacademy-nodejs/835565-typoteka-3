'use strict';

const {Router} = require(`express`);
const {HumanizedDateFormat} = require(`../../const`);
const checkAuth = require(`../middlewares/auth`);
const {getLogger} = require(`../../service/lib/logger`);
const {humanizeDate} = require(`../../utils/utils-common`);
const api = require(`../api`).getAPI();

const myRouter = new Router();
const logger = getLogger({name: `my-routes api`});

const utils = {
  humanizeDate,
  HumanizedDateFormat
};

myRouter.use(checkAuth);

myRouter.get(`/`, async (req, res) => {
  const {user} = req.session;

  try {
    res.render(`my`, {articles, user, ...utils});
  } catch (error) {
    logger.error(`Internal server error: ${error.message}`);
    res.render(`errors/500`);
  }
});

myRouter.get(`/comments`, async (req, res) => {
  const {user} = req.session;

  try {
    res.render(`comments`, {comments, user, ...utils});
  } catch (error) {
    logger.error(`Internal server error: ${error.message}`);
    res.render(`errors/500`);
  }
});

module.exports = myRouter;
