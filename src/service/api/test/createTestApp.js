'use strict';

const express = require(`express`);
const {queryParser} = require(`express-query-parser`);

const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use(queryParser({parseBoolean: true}));
  return app;
};

module.exports = {
  createApp,
};
