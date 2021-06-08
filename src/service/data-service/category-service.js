'use strict';

class CategoryService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll() {
    const categories = this._articles.reduce((acc, currentArticle) => {
      currentArticle.сategories.forEach((categoryItem) => acc.add(categoryItem));
      return acc;
    }, new Set());

    return [...categories];
  }
}

module.exports = CategoryService;
