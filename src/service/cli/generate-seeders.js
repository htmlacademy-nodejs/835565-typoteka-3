"use strict";

const path = require(`path`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {readContent} = require(`../../utils/utils-common`);
const {
  DEFAULT_COUNT,
  ARTICLE_TITLES_PATH,
  ARTICLE_DESCRIPTIONS_PATH,
  COMMENTS_PATH,
  ARTICLE_CATEGORIES_PATH,
} = require(`../../const`);
const {
  getMockUsers,
  generateMockArticlesForDB,
  generateMockCategoriesForDB,
  generateMockCommentsForDB,
  generateMockArticlesCategoriesForDB,
} = require(`../../utils/migrations-utils`);

module.exports = {
  name: `--generate-seeders`,
  async run(args) {
    console.info(chalk.green(`Generating data...`));

    const [count] = args;
    const articlesCount = Number.parseInt(count, 10) || DEFAULT_COUNT;

    const titles = await readContent(
        path.resolve(__dirname, ARTICLE_TITLES_PATH)
    );
    const descriptions = await readContent(
        path.resolve(__dirname, ARTICLE_DESCRIPTIONS_PATH)
    );
    const categories = await readContent(
        path.resolve(__dirname, ARTICLE_CATEGORIES_PATH)
    );
    const commentSentenses = await readContent(
        path.resolve(__dirname, COMMENTS_PATH)
    );

    const mockUsers = await getMockUsers();
    const mockArticles = generateMockArticlesForDB(articlesCount, {
      titles,
      descriptions,
      mockUsers,
      categories,
    });
    const mockCategories = generateMockCategoriesForDB(categories);
    const mockComments = generateMockCommentsForDB(
        commentSentenses,
        mockUsers,
        mockArticles
    );
    const mockArticlesCategories = generateMockArticlesCategoriesForDB(
        mockArticles
    );

    const data = {
      mockUsers: JSON.stringify(mockUsers),
      mockArticles: JSON.stringify(mockArticles),
      mockCategories: JSON.stringify(mockCategories),
      mockComments: JSON.stringify(mockComments),
      mockArticlesCategories: JSON.stringify(mockArticlesCategories),
    };

    try {
      console.info(chalk.green(`Writing...`));

      await fs.mkdir(`./db/mockSeeders`, {
        recursive: true,
      });
      const promises = Object.keys(data).map(async (item) => {
        await fs.writeFile(`./db/mockSeeders/${item}.json`, data[item]);
      });

      await Promise.all(promises);

      console.info(chalk.green(`Operation success. All files created.`));
      process.exit();
    } catch (error) {
      console.error(
          chalk.red(`Can't write data to files. Error: ${error.message}`)
      );
      process.exit(1);
    }
  },
};
