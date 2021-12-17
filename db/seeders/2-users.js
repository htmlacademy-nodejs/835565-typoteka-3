'use strict';

const path = require(`path`);
const fs = require(`fs`);
const {Aliase, Env} = require(`../../src/const`);
const {mockUsers} = require(`../../src/service/api/test/test-mocks`);

const {NODE_ENV} = process.env;

const usersGenerated = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, `../mockSeeders/mockUsers.json`))
);

const users = NODE_ENV === Env.TEST ? mockUsers : usersGenerated;

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkInsert(Aliase.USERS, users);
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete(Aliase.USERS, null, {});
  },
};
