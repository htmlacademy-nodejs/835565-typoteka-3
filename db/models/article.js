'use strict';

const {Model} = require(`sequelize`);
const {ANNOUNCE_CHAR_LENGTH, Aliase} = require(`../../src/const`);

module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    static associate(models) {
      Article.hasMany(models.comment, {foreignKey: `articleId`});
      Article.belongsTo(models.user, {foreignKey: `userId`});
      Article.belongsToMany(models.category, {through: models.articlesCategories});
    }
  }

  Article.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    announce: {
      // eslint-disable-next-line new-cap
      type: DataTypes.STRING(ANNOUNCE_CHAR_LENGTH),
      allowNull: false
    },
    fullText: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    fullsizePicture: {
      defaultValue: null,
      type: DataTypes.STRING,
      allowNull: true
    },
    previewPicture: {
      defaultValue: null,
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: Aliase.ARTICLE,
  });

  return Article;
};
