'use strict';

const {ORDER_BY_LATEST_DATE} = require(`../../const`);
const Aliase = require(`../models/aliase`);

class ArticleService {
  constructor(sequelize) {
    this._sequelize = sequelize;
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

  async findOne(id, needComments = false) {
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
    const options = {
      include: [],
      order: [ORDER_BY_LATEST_DATE]
    };

    if (needComments) {
      options.include.push(Aliase.COMMENTS);
    }

    const articles = await this._Article.findAll(options);
    return articles.map((item) => item.get());
  }

  async findLimit({limit}) {
    const options = {
      attributes: {
        include: [
          [this._sequelize.fn(`COUNT`, this._sequelize.col(`comments.id`)), `commentsCount`]
        ]
      },
      include: [
        {
          model: this._Comment,
          as: Aliase.COMMENTS,
          attributes: [],
        },
      ],
      group: [
        `Article.id`,
      ],
      order: [
        [this._sequelize.fn(`COUNT`, this._sequelize.col(`comments.id`)), `DESC`]
      ]
    };

    let articles = await this._Article.findAll(options);

    articles = articles
      .map((item) => item.get())
      .filter((item) => item.commentsCount > 0);

    return articles.slice(0, limit);
  }

  async findPage({limit, offset}) {
    const options = {
      // limit,
      offset,
      attributes: {
        include: [
          [this._sequelize.fn(`COUNT`, this._sequelize.col(`comments.id`)), `commentsCount`]
        ]
      },
      include: [
        {
          model: this._Comment,
          as: Aliase.COMMENTS,
          attributes: [],
        },
        {
          model: this._Category,
          as: Aliase.CATEGORIES,
          attributes: [`id`, `name`]
        }
      ],
      group: [
        `Article.id`,
        `categories.id`,
        `categories->ArticleCategory.ArticleId`,
        `categories->ArticleCategory.CategoryId`
      ],
      order: [ORDER_BY_LATEST_DATE],
      distinct: true
    };

    let {count, rows: articles} = await this._Article.findAndCountAll(options);

    return {count, articles};
  }
}

module.exports = ArticleService;
