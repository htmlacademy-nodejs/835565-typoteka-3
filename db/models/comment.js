'use strict';

const {Model} = require(`sequelize`);
const {Aliase, COMMENT_CHAR_LENGTH} = require(`../../src/const`);

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.article, {foreignKey: `articleId`});
      Comment.belongsTo(models.user, {foreignKey: `userId`});
    }
  }

  Comment.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    text: {
      // eslint-disable-next-line new-cap
      type: DataTypes.STRING(COMMENT_CHAR_LENGTH),
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: Aliase.COMMENT,
  });

  return Comment;
};
