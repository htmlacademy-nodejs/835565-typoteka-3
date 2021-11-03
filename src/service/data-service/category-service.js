'use strict';

const Aliase = require(`../models/aliase`);
const {ORDER_BY_LATEST_DATE} = require(`../../const`);

class CategoryService {
  constructor(sequelize) {
    this._sequelize = sequelize;
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async create(data) {
    console.log(data);
    const category = await this._Category.create(data);
    return category.get();
  }

  async findAll({needCount}) {
    if (needCount) {
      const result = await this._Category.findAll({
        attributes: [
          `id`,
          `name`,
          [this._sequelize.fn(`COUNT`, `*`), `count`]
        ],
        group: [this._sequelize.col(`Category.id`)],
        include: [{
          model: this._ArticleCategory,
          as: Aliase.ARTICLE_CATEGORIES,
          attributes: []
        }],
        order: [ORDER_BY_LATEST_DATE]
      });
      return result.map((item) => item.get());
    } else {
      return this._Category.findAll({raw: true});
    }
  }
}

module.exports = CategoryService;
