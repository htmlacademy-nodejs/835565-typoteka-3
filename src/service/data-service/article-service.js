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

  async update({id, update}) {
    const affectedRows = await this._Article.update(update, {
      where: {id}
    });

    const updatedArticle = await this._Article.findOne({
      where: {id}
    });

    await updatedArticle.setCategories(update.categories);

    return !!affectedRows;
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  async findOne({articleId, viewMode}) {
    if (!viewMode) {
      return this._Article.findByPk(articleId, {
        include: [Aliase.CATEGORIES]
      });
    }

    const options = {
      include: [
        {
          model: this._Comment,
          as: Aliase.COMMENTS,
        },
        {
          model: this._Category,
          as: Aliase.CATEGORIES,
          attributes: {
            include: [
              [this._sequelize.fn(`COUNT`, `*`), `count`]
            ]
          }
        }
      ],
      order: [
        [{model: this._Comment, as: Aliase.COMMENTS}, `createdAt`, `DESC`]
      ],
      group: [
        `Article.id`,
        `comments.id`,
        `categories.id`,
        `categories->ArticleCategory.ArticleId`,
        `categories->ArticleCategory.CategoryId`
      ],
      where: {id: articleId}
    };

    return this._Article.findOne(options);
  }

  async findAll(needComments) {
    const options = {
      attributes: [`id`, `createdAt`, `title`],
      order: [ORDER_BY_LATEST_DATE]
    };

    if (needComments) {
      options.include = [Aliase.COMMENTS];
    }

    const articles = await this._Article.findAll(options);
    return articles.map((item) => item.get());
  }

  async findLimit({limit}) {
    const options = {
      attributes: [
        `id`,
        `announce`,
        [this._sequelize.fn(`COUNT`, this._sequelize.col(`comments.id`)), `commentsCount`]
      ],
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
      subQuery: false,
      limit,
      offset,
      attributes: [
        `title`,
        `announce`,
        `picture`,
        `createdAt`,
        [this._sequelize.fn(`COUNT`, this._sequelize.col(`comments.id`)), `commentsCount`]
      ],
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
      order: [ORDER_BY_LATEST_DATE],
      group: [
        `Article.id`,
        `categories.id`,
        `categories->ArticleCategory.ArticleId`,
        `categories->ArticleCategory.CategoryId`
      ],
      distinct: true
    };

    let [count, articles] = [
      await this._Article.count(),
      await this._Article.findAll(options)
    ];

    articles = articles.map((item) => item.get());

    return {count, articles};
  }
}

module.exports = ArticleService;
