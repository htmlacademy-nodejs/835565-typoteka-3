'use strict';

const {Model} = require(`sequelize`);
const {Aliase} = require(`../../src/const`);

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.belongsToMany(models.article, {
        through: models.articlesCategories
      });
      Category.hasMany(models.articlesCategories);
    }
  }

  Category.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: Aliase.CATEGORY,
  });

  return Category;
};
