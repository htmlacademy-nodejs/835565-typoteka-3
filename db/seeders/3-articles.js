'use strict';

const path = require(`path`);
const fs = require(`fs`);
const {Aliase} = require(`../../src/const`);

const articles = fs.readFileSync(path.resolve(__dirname, `../mockSeeders/mockArticles.json`));

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkInsert(Aliase.ARTICLES, JSON.parse(articles));
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete(Aliase.ARTICLES, null, {});
  }
};
