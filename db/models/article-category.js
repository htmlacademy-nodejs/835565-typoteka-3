'use strict';

const {Model} = require(`sequelize`);
const {Aliase} = require(`../../src/const`);

module.exports = (sequelize, _DataTypes) => {
  class ArticleCategory extends Model {
    static associate() {}
  }
  ArticleCategory.init({}, {
    sequelize,
    modelName: Aliase.ARTICLES_CATEGORIES,
    timestamps: false
  });

  return ArticleCategory;
};
