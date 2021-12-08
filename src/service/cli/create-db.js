'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const path = require(`path`);

const {generateQueryToCreateDB} = require(`../../utils/utils-data`);
const {createDirs} = require(`../../utils/utils-common`);
const {DB_CREATE_FILE_PATH, SQL_FILES_DIR_PATH, ExitCode} = require(`../../const`);
const {DB_NAME, DB_USER} = process.env;

module.exports = {
  name: `--create-db`,
  async run() {
    const content = generateQueryToCreateDB(DB_NAME, DB_USER);

    try {
      await Promise.all([
        createDirs([SQL_FILES_DIR_PATH]),
        fs.writeFile(
            path.resolve(__dirname, DB_CREATE_FILE_PATH),
            content
        )
      ]);
      console.info(chalk.green(`Operation success. File created.`));
      process.exit();
    } catch (error) {
      console.error(
          chalk.red(`Can't write data to file. Error: ${error.message}`)
      );
      process.exit(ExitCode.ERROR);
    }
  }
};
