'use strict';

const path = require(`path`);
const fs = require(`fs`);
const {Aliase, Env} = require(`../../src/const`);
const {mockComments} = require(`../../src/service/api/test/test-mocks`);

const {NODE_ENV} = process.env;

const commentsGenerated = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, `../mockSeeders/mockComments.json`))
);

const comments = NODE_ENV === Env.TEST ? mockComments : commentsGenerated;

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkInsert(Aliase.COMMENTS, comments);
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete(Aliase.COMMENTS, null, {});
  },
};
