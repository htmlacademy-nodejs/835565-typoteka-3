'use strict';
const chalk = require(`chalk`);
const generate = require(`./generate`);
const version = require(`./version`);
const server = require(`./server`);

const moduleName = `--help`;

const helpMessage = `
  Программа запускает http-сервер и формирует файл с данными для API
  Гайд:
  service.js <command>
  Команды:
  ${version.name}:              выводит номер версии
  ${generate.name} <count>:     формирует файл mocks.json
  ${moduleName}:                 справка
  ${server.name}:               запускает http-сервер
`;

module.exports = {
  name: moduleName,
  run: () => console.info(chalk.gray(helpMessage))
};
