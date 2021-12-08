'use strict';

const help = require(`./help`);
const version = require(`./version`);
const server = require(`./server`);
const createDB = require(`./create-db`);
const createSchema = require(`./create-schema`);
const fillDB = require(`./fill-db`);
const generateSeeders = require(`./generate-seeders`);

const Cli = {
  [help.name]: help,
  [version.name]: version,
  [server.name]: server,
  [createDB.name]: createDB,
  [createSchema.name]: createSchema,
  [fillDB.name]: fillDB,
  [generateSeeders.name]: generateSeeders,
};

module.exports = {Cli};
