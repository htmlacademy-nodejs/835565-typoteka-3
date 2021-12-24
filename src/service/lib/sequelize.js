'use strict';

const Sequelize = require(`sequelize`);
const {Env} = require(`../../const`);
const {DB_NAME, DB_NAME_TEST, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT} = process.env;

let dbName = DB_NAME;
let needLogging = (msg) => console.log(msg);

const envVariablesAreMissing = [
  DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT
].some((variable) => variable === undefined);

if (process.env.NODE_ENV === Env.DEVELOPMENT) {
  if (envVariablesAreMissing) {
    throw new Error(`Some environmental variables are not defined`);
  }
}

if (process.env.NODE_ENV === Env.TEST) {
  dbName = DB_NAME_TEST;
  needLogging = false;
}

module.exports = new Sequelize(
    dbName, DB_USER, DB_PASSWORD, {
      host: DB_HOST,
      port: DB_PORT,
      dialect: `postgres`,
      logging: needLogging,
      pool: {
        max: 5,
        min: 0,
        acquire: 10000,
        idle: 10000
      }
    }
);
