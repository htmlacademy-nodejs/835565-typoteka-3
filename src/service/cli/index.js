'use strict';

const help = require(`./help`);
const version = require(`./version`);
const server = require(`./server`);
const fill = require(`./fill`);
const generateSeeders = require(`./generate-seeders`);

const Cli = {
  [help.name]: help,
  [version.name]: version,
  [server.name]: server,
  [fill.name]: fill,
  [generateSeeders.name]: generateSeeders,
};

module.exports = {Cli};
