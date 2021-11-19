'use strict';

const {Op} = require(`sequelize`);
const {ORDER_BY_LATEST_DATE} = require(`../../const`);

class SearchService {
  constructor(sequelize) {
    this._Article = sequelize.models.article;
    this._User = sequelize.models.user;
    this._Category = sequelize.models.category;
  }

  async findAll(searchText) {
    const articles = await this._Article.findAll({
      where: {
        title: {
          [Op.substring]: searchText
        }
      },
      include: [
        {
          model: this._Category
        },
        {
          model: this._User,
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
