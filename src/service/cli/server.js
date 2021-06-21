'use strict';

const express = require(`express`);
const routes = require(`../api`);
const {getLogger} = require(`../lib/logger`);

const {
  DEFAULT_PORT,
  NOT_FOUND_MESSAGE,
  API_PREFIX,
  HttpCode,
  ExitCode,
} = require(`../../const`);

const logger = getLogger({name: `api`});
const app = express();
app.use(express.json());

app.use(API_PREFIX, routes);

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND)
    .send(NOT_FOUND_MESSAGE);
  logger.error(`Route not found: ${req.url}`);
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
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    try {
      app.listen(port, (error) => {
        if (error) {
          return logger.error(`An error occured while creating a server`, error);
        }
        return logger.info(`Listening to port ${port}`);
      });
    } catch (error) {
      logger.error(`An error occurred: ${error.message}`);
      process.exit(ExitCode.ERROR);
    }
  }
};
