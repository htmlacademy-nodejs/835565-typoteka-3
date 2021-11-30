'use strict';

const help = require(`./help`);
const generate = require(`./generate`);
const version = require(`./version`);
const server = require(`./server`);
const fill = require(`./fill`);
const filldb = require(`./fill-db`);
const generateSeeders = require(`./generate-seeders`);

const Cli = {
  [generate.name]: generate,
  [help.name]: help,
  [version.name]: version,
  [server.name]: server,
  [fill.name]: fill,
  [filldb.name]: filldb,
  [generateSeeders.name]: generateSeeders,
};

module.exports = {Cli};
