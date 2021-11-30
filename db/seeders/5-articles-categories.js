'use strict';

const path = require(`path`);
const fs = require(`fs`);

const {Aliase} = require(`../../src/const`);

const articlesCategories = fs.readFileSync(path.resolve(__dirname, `../mockSeeders/mockArticlesCategories.json`));

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkInsert(Aliase.ARTICLES_CATEGORIES, JSON.parse(articlesCategories));
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete(Aliase.ARTICLES_CATEGORIES, null, {});
  }
};
