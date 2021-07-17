'use strict';

const {sortByLatestDate} = require(`../../utils`);

class SearchService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll(searchText) {
    const relevantArticles = this._articles.reduce((acc, currentArticle) => {
      const formattedArticleTitle = currentArticle.title.toLowerCase();
      if (formattedArticleTitle.includes(searchText.toLowerCase())) {
        acc.push(currentArticle);
      }
      return acc;
    }, []);

    return relevantArticles.sort(sortByLatestDate);
  }
}

module.exports = SearchService;
