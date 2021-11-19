'use strict';

const path = require(`path`);
const fs = require(`fs`);

const {Aliase} = require(`../../src/const`);

const users = fs.readFileSync(path.resolve(__dirname, `../mockSeeders/mockUsers.json`));

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkInsert(Aliase.USERS, JSON.parse(users));
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete(Aliase.USERS, null, {});
  }
};
