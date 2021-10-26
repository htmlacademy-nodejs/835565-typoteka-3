'use strict';

const {Op} = require(`sequelize`);
const {ORDER_BY_LATEST_DATE} = require(`../../const`);
const Aliase = require(`../models/aliase`);

class SearchService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._User = sequelize.models.User;
  }

  // ! unify register of search!
  async findAll(searchText) {
    const articles = await this._Article.findAll({
      where: {
        title: {
          [Op.substring]: searchText
        }
      },
      include: [
        Aliase.CATEGORIES,
        {
          model: this._User,
          as: Aliase.USER,
          attributes: {
            exclude: [`passwordHash`]
          }
        }
      ],
      order: [
        ORDER_BY_LATEST_DATE
      ]
    });

    return articles.map((article) => article.get());
  }
}

module.exports = SearchService;
