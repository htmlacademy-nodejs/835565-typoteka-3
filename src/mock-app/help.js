'use strict';
const chalk = require(`chalk`);
const generate = require(`./generate`);
const version = require(`./version`);

const moduleName = `--help`;

const helpMessage = `
  Программа для генерации файла с моковыми публикациями
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
