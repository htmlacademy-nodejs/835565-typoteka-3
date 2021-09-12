'use strict';

const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineArticle = require(`./article`);
const defineArticleCategory = require(`./article-category`);
const Aliase = require(`./aliase`);

module.exports = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);
  const ArticleCategory = defineArticleCategory(sequelize);

  Article.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `articleId`});
  Comment.belongsTo(Article, {foreignKey: `articleId`});

  Article.belongsToMany(Category, {through: ArticleCategory, as: Aliase.CATEGORIES});
  Category.belongsToMany(Article, {through: ArticleCategory, as: Aliase.ARTICLES});
  Category.hasMany(ArticleCategory, {as: Aliase.ARTICLE_CATEGORIES});

  return {Category, Comment, Article, ArticleCategory};
};
