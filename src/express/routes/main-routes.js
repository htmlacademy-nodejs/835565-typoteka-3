'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();

mainRouter.get(`/`, (request, response) => response.send(`/`));
mainRouter.get(`/register`, (request, response) => response.send(`/register`));
mainRouter.get(`/login`, (request, response) => response.send(`/login`));
mainRouter.get(`/search`, (request, response) => response.send(`/search`));
mainRouter.get(`/categories`, (request, response) => response.send(`/categories`));

module.exports = mainRouter;
