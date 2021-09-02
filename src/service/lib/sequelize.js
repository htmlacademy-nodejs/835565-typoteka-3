'use strict';

const Sequelize = require(`sequelize`);
const {Env} = require(`../../const`);
const {DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT} = process.env;

const envVariablesAreMissing = [
  DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT
].some((variable) => variable === undefined);

if (process.env.NODE_ENV === Env.DEVELOPMENT) {
  if (envVariablesAreMissing) {
    throw new Error(`Some environmental variables are not defined`);
  }
}

module.exports = new Sequelize(
    DB_NAME, DB_USER, DB_PASSWORD, {
      host: DB_HOST,
      port: DB_PORT,
      dialect: `postgres`,
      pool: {
        max: 5,
        min: 0,
        acquire: 10000,
        idle: 10000
      }
    }
);
