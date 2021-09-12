'use strict';

const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);
const Aliase = require(`../models/aliase`);
const path = require(`path`);

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

    const {Category, Article} = defineModels(sequelize);

    await sequelize.sync({force: true});

    const titles = await readContent(path.resolve(__dirname, ARTICLE_TITLES_PATH));
    const descriptions = await readContent(path.resolve(__dirname, ARTICLE_DESCRIPTIONS_PATH));
    const categories = await readContent(path.resolve(__dirname, ARTICLE_CATEGORIES_PATH));
    const commentsSentences = await readContent(path.resolve(__dirname, COMMENTS_PATH));

    const categoryModels = await Category.bulkCreate(
        categories.map((item) => ({name: item}))
    );
    const options = {
      titles,
      descriptions,
      commentsSentences,
      categories: categoryModels,
      mockUsersCount: mockUsers.length,
    };

    const articles = generateMockDataForDB(articlesCount, options);
    const articlePromises = articles.map(async (article) => {
      const articleModel = await Article.create(article, {include: [Aliase.COMMENTS]});
      await articleModel.addCategories(article.сategories);
    });
    await Promise.all(articlePromises);
  }
};
