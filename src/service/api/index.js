'use strict';

const {Router} = require(`express`);

const category = require(`./category`);
const article = require(`./article`);
const search = require(`./search`);

const {
  CategoryService,
  ArticleService,
  CommentService,
  SearchService
} = require(`../data-service`);

const getMockData = require(`../lib/get-mock-data`);

const app = new Router();

const launchApp = async () => {
  let mockData = null;

  try {
    mockData = await getMockData();

    category(app, new CategoryService(mockData));
    search(app, new SearchService(mockData));
    article(app, new ArticleService(mockData), new CommentService());
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }

  return Promise.resolve(mockData);
};

launchApp();

module.exports = app;
