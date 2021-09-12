'use strict';

const {Model, DataTypes} = require(`sequelize`);

class ArticleCategory extends Model {}

module.exports = (sequelize) => ArticleCategory.init(
    {
      ArticleId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      CategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: `ArticleCategory`,
      tableName: `article_categories`,
      timestamps: false
    }
);
