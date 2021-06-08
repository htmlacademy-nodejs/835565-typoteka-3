'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../const`);

class ArticleService {
  constructor(articles) {
    this._articles = articles;
  }

  create(article) {
    const newArticle = Object
      .assign({id: nanoid(MAX_ID_LENGTH), comments: []}, article);
    this._articles.push(newArticle);
    return newArticle;
  }

  update(id, update) {
    const prevArticle = this._articles.find((item) => item.id === id);
    return Object.assign(prevArticle, update);
  }

  delete(id) {
    const deletedArticle = this._articles.find((item) => item.id === id);
    if (!deletedArticle) {
      return null;
    }
    this._articles = this._articles.filter((item) => item.id !== id);
    return deletedArticle;
  }

  findOne(id) {
    return this._articles.find((item) => item.id === id);
  }

  findAll() {
    return this._articles;
  }
}

module.exports = ArticleService;
