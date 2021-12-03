'use strict';
const chalk = require(`chalk`);
const version = require(`./version`);
const server = require(`./server`);
const createDB = require(`./create-db`);
const createSchema = require(`./create-schema`);
const fillDB = require(`./fill-db`);

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
  ${createDB.name}            формирует .sql файл для создания базы данных
  ${createSchema.name}         формирует .sql файл схемы базы данных
  ${fillDB.name} <count>       формирует .sql файл для начального заполнения базы данных
`;

module.exports = {
  name: moduleName,
  run: () => console.info(chalk.yellow(helpMessage))
};
