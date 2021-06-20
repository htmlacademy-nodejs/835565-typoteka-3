'use strict';

const {MockApp} = require(`./cli`);
const {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  ExitCode
} = require(`../const`);

const userArguments = process.argv.slice(USER_ARGV_INDEX);
const [userCommand] = userArguments;

if (userArguments.length === 0 || !MockApp[userCommand]) {
  MockApp[DEFAULT_COMMAND].run();
  process.exit(ExitCode.success);
}

MockApp[userCommand].run(userArguments.slice(1));
