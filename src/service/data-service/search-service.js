'use strict';

class SearchService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll(searchText) {
    const relevantArticles = this._articles.reduce((acc, currentArticle) => {
      if (currentArticle.title.includes(searchText)) {
        acc.push(currentArticle);
      }
      return acc;
    }, []);

    return relevantArticles;
  }
}

module.exports = SearchService;
