'use strict';

const {ORDER_BY_LATEST_DATE} = require(`../../const`);
const Aliase = require(`../models/aliase`);

class CommentService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
  }

  async create(id, comment) {
    return await this._Comment.create({
      articleId: id,
      ...comment
    }, {
      include: [Aliase.ARTICLE]
    });
  }

  async drop(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });

    return !!deletedRows;
  }

  async findOne(id) {
    return await this._Comment.findByPk(id);
  }

  async findAll() {
    return await this._Comment.findAll({
      include: [
        {
          model: this._User,
          as: Aliase.USER,
          attributes: {exclude: [`passwordHash`]}
        },
        {
          model: this._Article,
          as: Aliase.ARTICLE,
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
        as: Aliase.USER,
        attributes: {exclude: [`passwordHash`]}
      },
      order: [ORDER_BY_LATEST_DATE]
    });
  }
}

module.exports = CommentService;
