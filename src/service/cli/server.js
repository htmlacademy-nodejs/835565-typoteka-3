'use strict';

const express = require(`express`);
const http = require(`http`);
const socket = require(`../lib/socket`);
const helmet = require(`helmet`);
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
const server = http.createServer(app);

const io = socket(server);
app.locals.socketio = io;

app.use(express.json());

app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "script-src": [`'self'`, `http://localhost:${DEFAULT_PORT_SERVER}`],
        }
      }
    })
);
app.disable(`x-powered-by`);

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

    try {
      server.listen(port, (error) => {
        if (error) {
          return logger.error(`Error while hosting server`, error);
        }
        return logger.info(`Listening to port ${port}`);
      });
    } catch (error) {
      logger.error(`An error occured: ${error.message}`);
      process.exit(ExitCode.ERROR);
    }
  }
};
