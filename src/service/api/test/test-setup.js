'use strict';

const express = require(`express`);
const {queryParser} = require(`express-query-parser`);
const Sequelize = require(`sequelize`);

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
const mockApp = express();
mockApp.use(express.json());
mockApp.use(queryParser({parseBoolean: true}));

module.exports = {
  mockApp,
  mockDB
};
