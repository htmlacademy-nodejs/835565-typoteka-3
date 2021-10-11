'use strict';

const {ORDER_BY_LATEST_DATE} = require(`../../const`);
const Aliase = require(`../models/aliase`);

class CommentService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
  }

  async create(id, comment) {
    return this._Comment.create({
      id,
      ...comment
    });
  }

  async drop(id) {
    const deletedRows = this._Comment.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  async findAll({id, needArticles}) {
    if (!needArticles) {
      return await this._Comment.findAll({
        where: {id},
        raw: true
      });
    }

    return await this._Comment.findAll({
      include: {
        model: this._Article,
        as: Aliase.ARTICLE,
        attributes: [`title`, `id`]
      },
      order: [ORDER_BY_LATEST_DATE]
    });
  }

  async findLimit({limit}) {
    const options = {
      limit,
      order: [ORDER_BY_LATEST_DATE]
    };

    return await this._Comment.findAll(options);
  }
}

module.exports = CommentService;
