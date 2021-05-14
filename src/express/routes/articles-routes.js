'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();

articlesRouter.get(`/add`, (request, response) => response.send(`/articles/add`));
articlesRouter.get(`/edit/:id`, (request, response) => response.send(`/articles/edit/:id`));
articlesRouter.get(`/category/:id`, (request, response) => response.send(`/articles/category/:id`));
articlesRouter.get(`/:id`, (request, response) => response.send(`/articles/:id`));

module.exports = articlesRouter;
