'use strict';

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

  async findAll(id) {
    if (id) {
      return await this._Comment.findAll({
        where: {id},
        raw: true
      });
    }
    return await this._Comment.findAll({
      include: {
        model: this._Article,
        as: Aliase.ARTICLE,
        attributes: [`title`]
      },
      order: [
        [`createdAt`, `DESC`]
      ]
    });
  }
}

module.exports = CommentService;
