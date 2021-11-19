'use strict';

const {Aliase} = require(`../../src/const`);

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.createTable(Aliase.ARTICLES_CATEGORIES, {});
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.dropTable(Aliase.ARTICLES_CATEGORIES);
  }
};
