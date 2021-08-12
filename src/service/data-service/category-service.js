'use strict';

const {getCategories} = require(`../../utils/utils-data`);

class CategoryService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll() {
    return getCategories(this._articles);
  }
}

module.exports = CategoryService;
