'use strict';

const path = require(`path`);
const fs = require(`fs`);
const {Aliase, Env} = require(`../../src/const`);
const {mockArticles} = require(`../../src/service/api/test/test-mocks`);

const {NODE_ENV} = process.env;

const articlesGenerated = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, `../mockSeeders/mockArticles.json`))
);

const articles = NODE_ENV === Env.TEST ? mockArticles : articlesGenerated;

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkInsert(Aliase.ARTICLES, articles);
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete(Aliase.ARTICLES, null, {});
  },
};
