'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();

articlesRouter.get(`/add`, (request, response) => response.render(`post-edit`));
articlesRouter.get(`/edit/:id`, (request, response) => response.render(`post-edit`));
articlesRouter.get(`/category/:id`, (request, response) => response.render(`posts-by-category`));
articlesRouter.get(`/:id`, (request, response) => response.render(`post`));

module.exports = articlesRouter;
