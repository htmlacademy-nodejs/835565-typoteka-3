'use strict';

const {ORDER_BY_LATEST_DATE} = require(`../../const`);

class CommentService {
  constructor(sequelize) {
    this._Article = sequelize.models.article;
    this._Comment = sequelize.models.comment;
    this._User = sequelize.models.user;
  }

  async create(id, comment) {
    return await this._Comment.create({
      articleId: id,
      ...comment
    }, {
      include: [{model: this._Article}]
    });
  }

  async drop(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });

    return !!deletedRows;
  }

  async findOne(id) {
    return await this._Comment.findOne({
      where: {id},
      include: [
        {
          model: this._User,
          attributes: {exclude: [`passwordHash`]}
        }
      ]
    });
  }

  async findAll() {
    return await this._Comment.findAll({
      include: [
        {
          model: this._User,
          attributes: {exclude: [`passwordHash`]}
        },
        {
          model: this._Article,
          attributes: [`title`]
        }
      ],
      order: [ORDER_BY_LATEST_DATE],
    });
  }

  async findLimit({limit}) {
    return await this._Comment.findAll({
      limit,
      include: {
        model: this._User,
        attributes: {exclude: [`passwordHash`]}
      },
      order: [ORDER_BY_LATEST_DATE]
    });
  }
}

module.exports = CommentService;
