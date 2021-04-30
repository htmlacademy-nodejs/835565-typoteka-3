'use strict';
const chalk = require(`chalk`);
const {helpTitle} = require(`./const`);
const generate = require(`./generate`);
const version = require(`./version`);

const moduleName = `--help`;

const helpMessage = `
  ${helpTitle}
  Гайд:
  service.js <command>
  Команды:
  ${version.name}: выводит номер версии
  ${generate.name} <count>: формирует файл mocks.json
  ${moduleName}: справка
`;

module.exports = {
  name: moduleName,
  run: () => console.info(chalk.gray(helpMessage))
};
