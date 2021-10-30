'use strict';

const CategoryService = require(`./category-service`);
const ArticleService = require(`./article-service`);
const CommentService = require(`./comment-service`);
const SearchService = require(`./search-service`);
const UserService = require(`./user-service`);

module.exports = {
  CategoryService,
  ArticleService,
  CommentService,
  SearchService,
  UserService
};
