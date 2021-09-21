'use strict';

const Aliase = require(`../models/aliase`);

class ArticleService {
  constructor(sequelize) {
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._Article = sequelize.models.Article;
  }

  async create(data) {
    const article = await this._Article.create(data);
    await article.addCategories(data.categories);
    return article.get();
  }

  async update(id, update) {
    const [affectedRows] = await this._Article.update(
        update,
        {where: {id}}
    );
    return !!affectedRows;
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  findOne(id, needComments = false) {
    const include = [Aliase.CATEGORIES];
    if (needComments) {
      include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
      });
    }
    return this._Article.findByPk(id, {include});
  }

  async findAll(needComments) {
    const include = [Aliase.CATEGORIES];
    if (needComments) {
      include.push(Aliase.COMMENTS);
    }
    const articles = await this._Article.findAll({include});
    return articles.map((item) => item.get());
  }
}

module.exports = ArticleService;
