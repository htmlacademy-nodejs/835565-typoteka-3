'use strict';

const path = require(`path`);
const fs = require(`fs`);

const {Aliase} = require(`../../src/const`);

const comments = fs.readFileSync(path.resolve(__dirname, `../mockSeeders/mockComments.json`));

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkInsert(Aliase.COMMENTS, JSON.parse(comments));
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete(Aliase.COMMENTS, null, {});
  }
};
