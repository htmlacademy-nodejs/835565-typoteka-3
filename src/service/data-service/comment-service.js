'use strict';

class CommentService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
  }

  // !
  getComments(article) {
    this._comments = article.comments;
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

  findAll(id) {
    return this._Comment.findAll({
      where: {id},
      raw: true
    });
  }
}

module.exports = CommentService;
