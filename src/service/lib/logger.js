'use strict';

const pino = require(`pino`);
const {Env, LOG_FILE_PATH} = require(`../../const`);
const path = require(`path`);

const LOG_FILE = path.resolve(__dirname, LOG_FILE_PATH);
const isDevMode = process.env.NODE_ENV === Env.DEVELOPMENT;
const defaultLogLevel = isDevMode ? `info` : `error`;

const logger = pino({
  name: `base-logger`,
  level: process.env.LOG_LEVEL || defaultLogLevel,
  prettyPrint: isDevMode,
}, isDevMode ? process.stdout : pino.destination(LOG_FILE));

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
