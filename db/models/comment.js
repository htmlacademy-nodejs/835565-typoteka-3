'use strict';

const {Model} = require(`sequelize`);
const {Aliase} = require(`../../src/const`);

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
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: Aliase.COMMENT,
  });

  return Comment;
};
