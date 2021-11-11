'use strict';

const express = require(`express`);
const {queryParser} = require(`express-query-parser`);

const routes = require(`../api`);
const {getLogger} = require(`../lib/logger`);
const sequelize = require(`../lib/sequelize`);

const {
  DEFAULT_PORT_SERVER,
  API_PREFIX,
  HttpCode,
  ExitCode,
} = require(`../../const`);

const logger = getLogger({name: `api`});
const app = express();

app.use(express.json());
app.use(queryParser({parseBoolean: true}));

app.use(API_PREFIX, routes);

app.use((req, res) => {
  switch (res.status) {
    case HttpCode.NOT_FOUND:
      res.status(HttpCode.NOT_FOUND)
        .render(`errors/404`);
      logger.error(`Route not found: ${req.url}`);
      break;

    case HttpCode.SERVER_ERROR:
      res.status(HttpCode.SERVER_ERROR)
        .render(`errors/500`);
      logger.error(`Internal server error on route: ${req.url}`);
      break;
  }
});

app.use((err, _req, _res, _next) => {
  logger.error(`An error occurred on processing request: ${err.message}`);
});

app.use((req, res, next) => {
  logger.debug(`Request on route ${req.url}`);
  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });
  next();
});

module.exports = {
  name: `--server`,
  async run(args) {
    try {
      logger.info(`Connecting to DB...`);
      await sequelize.authenticate();
    } catch (error) {
      logger.error(`Connection to DB failed, an error occurred: ${error.message}`);
      process.exit(ExitCode.ERROR);
    }
    logger.info(`Connected to DB successfully!`);

    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT_SERVER;

    app.listen(port, (error) => {
      if (error) {
        return logger.error(`Error while hosting server`, error);
      }
      return logger.info(`Listening to port ${port}`);
    });
  }
};
