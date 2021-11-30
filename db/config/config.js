'use strict';

require(`dotenv`).config();

const {DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD} = process.env;

module.exports = {
  "development": {
    "username": DB_USER,
    "password": DB_PASSWORD,
    "database": DB_NAME,
    "host": DB_HOST,
    "port": DB_PORT,
    "dialect": `postgres`
  },
  "test": {
    "username": DB_USER,
    "password": null,
    "database": DB_NAME,
    "host": DB_HOST,
    "port": DB_PORT,
    "dialect": `postgres`
  },
  "production": {
    "username": DB_USER,
    "password": DB_PASSWORD,
    "database": DB_NAME,
    "host": DB_HOST,
    "port": DB_PORT,
    "dialect": `postgres`
  }
};
