'use strict';

const sequelize = require(`../lib/sequelize`);
const path = require(`path`);
const initDB = require(`../lib/init-db`);
const passwordUtility = require(`../lib/password`);

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

    const mockUsers = [
      {
        firstName: `Иван`,
        lastName: `Иванов`,
        email: `ivanov@example.com`,
        passwordHash: await passwordUtility.hash(`ivanov`),
        avatarFullsize: `avatar-1.png`,
        avatarSmall: `avatar-small-1.png`
      },
      {
        firstName: `Пётр`,
        lastName: `Петров`,
        email: `petrov@example.com`,
        passwordHash: await passwordUtility.hash(`petrov`),
        avatarFullsize: `avatar-2.png`,
        avatarSmall: `avatar-small-2.png`
      },
      {
        firstName: `Сергей`,
        lastName: `Сергеев`,
        email: `sergeev@example.com`,
        passwordHash: await passwordUtility.hash(`sergeev`),
        avatarFullsize: `avatar-3.webp`,
        avatarSmall: `avatar-small-3.webp`
      },
      {
        firstName: `Алексей`,
        lastName: `Алексеев`,
        email: `alekseev@example.com`,
        passwordHash: await passwordUtility.hash(`alekseev`),
        avatarFullsize: `avatar-2.webp`,
        avatarSmall: `avatar-small-2.webp`
      },
      {
        firstName: `Михаил`,
        lastName: `Михайлов`,
        email: `mikhailov@example.com`,
        passwordHash: await passwordUtility.hash(`mikhailov`),
        avatarFullsize: `avatar-1.png`,
        avatarSmall: `avatar-small-1.png`
      }
    ];

    const categories = await readContent(path.resolve(__dirname, ARTICLE_CATEGORIES_PATH));

    const options = {
      titles: await readContent(path.resolve(__dirname, ARTICLE_TITLES_PATH)),
      descriptions: await readContent(path.resolve(__dirname, ARTICLE_DESCRIPTIONS_PATH)),
      commentsSentences: await readContent(path.resolve(__dirname, COMMENTS_PATH)),
      categories,
      mockUsers,
    };

    const articles = generateMockDataForDB(articlesCount, options);

    initDB(sequelize, {articles, categories, users: mockUsers});
  }
};
