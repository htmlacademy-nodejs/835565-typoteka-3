'use strict';

const {DataTypes, Model} = require(`sequelize`);
const {ANNOUNCE_CHAR_LENGTH} = require(`../../const`);

class Article extends Model {}

module.exports = (sequelize) => Article.init({
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
  picture: {
    defaultValue: null,
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize,
  modelName: `Article`,
  tableName: `articles`,
  paranoid: true
});
