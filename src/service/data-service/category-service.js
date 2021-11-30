'use strict';

const {ORDER_BY_LATEST_DATE} = require(`../../const`);

class CategoryService {
  constructor(sequelize) {
    this._sequelize = sequelize;
    this._Article = sequelize.models.article;
    this._Category = sequelize.models.category;
    this._Comment = sequelize.models.comment;
    this._ArticlesCategories = sequelize.models.articlesCategories;
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
            [this._sequelize.fn(`COUNT`, this._sequelize.col(`categoryId`)), `count`]
          ]
        },
        group: [this._sequelize.col(`category.id`)],
        include: [{
          model: this._ArticlesCategories,
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
          [this._sequelize.fn(`COUNT`, this._sequelize.col(`categoryId`)), `count`]
        ],
        group: [this._sequelize.col(`category.id`)],
        include: [{
          model: this._ArticlesCategories,
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
    const articlesIdByCategory = await this._ArticlesCategories.findAll({
      attributes: [`articleId`],
      where: {
        categoryId
      },
      raw: true
    });

    const articlesId = articlesIdByCategory.map((item) => item.articleId);

    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include: [
        {model: this._Category},
        {
          model: this._Comment,
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
