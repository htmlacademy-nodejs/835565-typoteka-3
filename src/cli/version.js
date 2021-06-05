'use strict';

const chalk = require(`chalk`);
const packageJSONFile = require(`../../package.json`);

module.exports = {
  name: `--version`,
  run: () => console.info(chalk.blue(packageJSONFile.version))
};
