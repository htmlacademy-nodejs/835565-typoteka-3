'use strict';

const path = require(`path`);
const fs = require(`fs`);

const {Aliase} = require(`../../src/const`);

const categories = fs.readFileSync(path.resolve(__dirname, `../mockSeeders/mockCategories.json`));

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkInsert(Aliase.CATEGORIES, JSON.parse(categories));
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete(Aliase.CATEGORIES, null, {});
  }
};
