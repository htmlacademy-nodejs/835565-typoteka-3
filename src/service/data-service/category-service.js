'use strict';

const {getCategories} = require(`../../utils`);

class CategoryService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll() {
    return getCategories(this._articles);
  }
}

module.exports = CategoryService;
