'use strict';

const Aliase = require(`../models/aliase`);
const {ORDER_BY_LATEST_DATE} = require(`../../const`);

class CategoryService {
  constructor(sequelize) {
    this._sequelize = sequelize;
    this._Article = sequelize.models.Article;
    this._Category = sequelize.models.Category;
    this._Comment = sequelize.models.Comment;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async create(data) {
    const category = await this._Category.create(data);
    return category.get();
  }

  async update({id, update}) {
    const affectedRow = await this._Category.update(update, {
      where: {id}
    });

    return !!affectedRow;
  }

  async drop({id}) {
    const deletedRow = await this._Category.destroy({
      where: {id}
    });

    return !!deletedRow;
  }

  async findOne({id, needCount}) {
    if (needCount) {
      return this._Category.findOne({
        where: {id},
        attributes: {
          include: [
            [this._sequelize.fn(`COUNT`, this._sequelize.col(`CategoryId`)), `count`]
          ]
        },
        group: [this._sequelize.col(`Category.id`)],
        include: [{
          model: this._ArticleCategory,
          as: Aliase.ARTICLE_CATEGORIES,
          attributes: [],
        }],
        raw: true
      });
    }

    return this._Category.findByPk(id);
  }

  async findAll({needCount}) {
    if (needCount) {
      const result = await this._Category.findAll({
        attributes: [
          `id`,
          `name`,
          [this._sequelize.fn(`COUNT`, this._sequelize.col(`CategoryId`)), `count`]
        ],
        group: [this._sequelize.col(`Category.id`)],
        include: [{
          model: this._ArticleCategory,
          as: Aliase.ARTICLE_CATEGORIES,
          attributes: [],
        }],
        order: [ORDER_BY_LATEST_DATE]
      });
      return result.map((item) => item.get());
    } else {
      return this._Category.findAll({
        raw: true,
      });
    }
  }

  async findPage({categoryId, limit, offset}) {
    const articlesIdByCategory = await this._ArticleCategory.findAll({
      attributes: [`ArticleId`],
      where: {
        CategoryId: categoryId
      },
      raw: true
    });

    const articlesId = articlesIdByCategory.map((item) => item.ArticleId);

    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include: [
        Aliase.CATEGORIES,
        {
          model: this._Comment,
          as: Aliase.COMMENTS,
          attributes: [`id`]
        },
      ],
      order: [ORDER_BY_LATEST_DATE],
      where: {
        id: articlesId
      },
      distinct: true
    });

    return {count, articlesByCategory: rows};
  }
}

module.exports = CategoryService;
