'use strict';

const {QueryOptions} = require(`../../const`);
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

  async findAllByArticleId(id) {
    return await this._Comment.findAll({
      where: {id},
      raw: true
    });
  }

  async findAll(limit) {
    return await this._Comment.findAll({
      include: {
        model: this._Article,
        as: Aliase.ARTICLE,
        attributes: [`title`]
      },
      order: [
        QueryOptions.order.BY_LATEST_DATE
      ],
      limit
    });
  }
}

module.exports = CommentService;
