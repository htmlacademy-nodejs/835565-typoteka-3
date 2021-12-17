'use strict';

const path = require(`path`);
const fs = require(`fs`);
const {Aliase, Env} = require(`../../src/const`);
const {
  mockArticlesCategories,
} = require(`../../src/service/api/test/test-mocks`);

const {NODE_ENV} = process.env;

const articlesCategoriesGenerated = JSON.parse(
    fs.readFileSync(
        path.resolve(__dirname, `../mockSeeders/mockArticlesCategories.json`)
    )
);

const articlesCategories =
  NODE_ENV === Env.TEST ? mockArticlesCategories : articlesCategoriesGenerated;

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkInsert(
        Aliase.ARTICLES_CATEGORIES,
        articlesCategories
    );
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete(Aliase.ARTICLES_CATEGORIES, null, {});
  },
};
