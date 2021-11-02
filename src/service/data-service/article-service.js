'use strict';

const {ORDER_BY_LATEST_DATE, COMMENTS_COUNT_KEY_NAME} = require(`../../const`);
const Aliase = require(`../models/aliase`);

class ArticleService {
  constructor(sequelize) {
    this._sequelize = sequelize;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._Article = sequelize.models.Article;
    this._User = sequelize.models.User;
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
    const options = {
      include: [
        Aliase.CATEGORIES,
        {
          model: this._User,
          as: Aliase.USER,
          attributes: {exclude: [`passwordHash`]}
        }
      ],
      where: {id: articleId}
    };

    if (viewMode) {
      options.include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [
          {
            model: this._User,
            as: Aliase.USER,
            attributes: {exclude: [`passwordHash`]}
          }
        ]
      });

      options.order = [
        [{model: this._Comment, as: Aliase.COMMENTS}, `createdAt`, `DESC`]
      ];
    }

    return await this._Article.findOne(options);
  }

  async findAll() {
    const articles = await this._Article.findAll({
      include: [
        {
          model: this._User,
          as: Aliase.USER,
          attributes: {exclude: [`passwordHash`]}
        }
      ],
      order: [ORDER_BY_LATEST_DATE]
    });

    return articles.map((item) => item.get());
  }

  async findLimit({limit}) {
    const options = {
      attributes: [
        `id`,
        `announce`,
        [this._sequelize.fn(`COUNT`, this._sequelize.col(`comments.id`)), COMMENTS_COUNT_KEY_NAME]
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
      .filter((item) => item[COMMENTS_COUNT_KEY_NAME] > 0);

    return articles.slice(0, limit);
  }

  async findPage({limit, offset}) {
    const options = {
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
      distinct: true
    };

    let {count, rows} = await this._Article.findAndCountAll(options);

    rows = rows.map((item) => item.get());

    return {count, articles: rows};
  }
}

module.exports = ArticleService;
