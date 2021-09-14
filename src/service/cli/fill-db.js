'use strict';

const sequelize = require(`../lib/sequelize`);
const path = require(`path`);
const initDB = require(`../lib/init-db`);

const {getLogger} = require(`../lib/logger`);
const {readContent} = require(`../../utils/utils-common`);
const {generateMockDataForDB} = require(`../../utils/utils-data`);

const {
  DEFAULT_COUNT,
  ExitCode,
  ARTICLE_TITLES_PATH,
  ARTICLE_DESCRIPTIONS_PATH,
  ARTICLE_CATEGORIES_PATH,
  COMMENTS_PATH,
  mockUsers
} = require(`../../const`);

const logger = getLogger({name: `fill-db`});

module.exports = {
  name: `--filldb`,
  async run(args) {
    const [count] = args;
    const articlesCount = Number.parseInt(count, 10) || DEFAULT_COUNT;

    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(ExitCode.ERROR);
    }
    logger.info(`Connection to database established`);

    const categories = await readContent(path.resolve(__dirname, ARTICLE_CATEGORIES_PATH));

    const options = {
      titles: await readContent(path.resolve(__dirname, ARTICLE_TITLES_PATH)),
      descriptions: await readContent(path.resolve(__dirname, ARTICLE_DESCRIPTIONS_PATH)),
      commentsSentences: await readContent(path.resolve(__dirname, COMMENTS_PATH)),
      categories,
      mockUsersCount: mockUsers.length,
    };

    const articles = generateMockDataForDB(articlesCount, options);

    initDB(sequelize, {articles, categories});
  }
};
