'use strict';

const path = require(`path`);
const fs = require(`fs`);
const {Aliase, Env} = require(`../../src/const`);
const {mockCategories} = require(`../../src/service/api/test/test-mocks`);

const {NODE_ENV} = process.env;

const categoriesGenerated = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, `../mockSeeders/mockCategories.json`))
);

const categories = NODE_ENV === Env.TEST ? mockCategories : categoriesGenerated;

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkInsert(Aliase.CATEGORIES, categories);
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete(Aliase.CATEGORIES, null, {});
  },
};
