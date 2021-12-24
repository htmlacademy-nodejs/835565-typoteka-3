'use strict';

const {Router} = require(`express`);

const category = require(`./category`);
const article = require(`./article`);
const search = require(`./search`);
const comment = require(`./comment`);
const user = require(`./user`);
const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);

const {
  CategoryService,
  ArticleService,
  CommentService,
  SearchService,
  UserService
} = require(`../data-service`);

const app = new Router();
defineModels(sequelize);

(async () => {
  try {
    return await Promise.all([
      category(app, new CategoryService(sequelize)),
      search(app, new SearchService(sequelize)),
      article(app, new ArticleService(sequelize), new CommentService(sequelize)),
      comment(app, new CommentService(sequelize)),
      user(app, new UserService(sequelize))
    ]);
  } catch (error) {
    console.error(error);
    throw new Error(`Error while setting up server-side API: ${error.message}`);
  }
})();

module.exports = app;
