'use strict';
const chalk = require(`chalk`);
const version = require(`./version`);
const server = require(`./server`);
const fill = require(`./fill`);

const moduleName = `--help`;

const helpMessage = `
  Учебный проект «Типотека» от HTML Academy.

  Гайд:
  ./src/service/
  node service.js <command>

  Команды:
  ${version.name}:              выводит номер версии приложения
  ${moduleName}:                 справка
  ${server.name}:               запускает http-сервер
  ${fill.name} <count>          формирует .sql файл для начального заполнения базы данных
`;

module.exports = {
  name: moduleName,
  run: () => console.info(chalk.yellow(helpMessage))
};
