'use strict';

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
  ${generate.name}: формирует файл mocks.json
  ${moduleName}: справка
`;

module.exports = {
  name: moduleName,
  run: () => {
    console.info(helpMessage);
  },
};
