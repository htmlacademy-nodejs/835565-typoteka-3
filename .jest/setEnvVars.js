'use strict';

require(`dotenv`).config();
const {DB_HOST, DB_PORT, DB_NAME_TEST, DB_USER, DB_PASSWORD} = process.env;

process.env.DB_HOST=DB_HOST
process.env.DB_PORT=DB_PORT
process.env.DB_NAME_TEST=DB_NAME_TEST
process.env.DB_USER=DB_USER
process.env.DB_PASSWORD=DB_PASSWORD
