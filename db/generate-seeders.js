'use strict';

const path = require(`path`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {readContent} = require(`../src/utils/utils-common`);
const {DEFAULT_COUNT} = require(`../src/const`);
const {
  getMockUsers,
  generateMockArticlesForDB,
  generateMockCategoriesForDB,
  generateMockCommentsForDB,
  generateMockArticlesCategoriesForDB
} = require(`./migrations-utils`);


module.exports = {
  name: `--generate-seeders`,
  async run(args) {
    console.info(chalk.green(`Generating data...`));

    const [count] = args;
    const articlesCount = Number.parseInt(count, 10) || DEFAULT_COUNT;

    const titles = await readContent(path.resolve(__dirname, `../src/data/titles.txt`));
    const descriptions = await readContent(path.resolve(__dirname, `../src/data/descriptions.txt`));
    const categories = await readContent(path.resolve(__dirname, `../src/data/categories.txt`));
    const commentSentenses = await readContent(path.resolve(__dirname, `../src/data/comments.txt`));

    const mockUsers = await getMockUsers();
    const mockArticles = generateMockArticlesForDB(articlesCount, {titles, descriptions, mockUsers, categories});
    const mockCategories = generateMockCategoriesForDB(categories);
    const mockComments = generateMockCommentsForDB(commentSentenses, mockUsers, mockArticles);
    const mockArticlesCategories = generateMockArticlesCategoriesForDB(mockArticles);

    const data = {
      mockUsers: JSON.stringify(mockUsers),
      mockArticles: JSON.stringify(mockArticles),
      mockCategories: JSON.stringify(mockCategories),
      mockComments: JSON.stringify(mockComments),
      mockArticlesCategories: JSON.stringify(mockArticlesCategories),
    };

    try {
      console.info(chalk.green(`Writing...`));

      const promises = Object.keys(data).map(async (item) => {
        await fs.writeFile(path.resolve(__dirname, `mockSeeders/${item}.json`), data[item]);
      });

      await Promise.all(promises);

      console.info(chalk.green(`Operation success. All files created.`));
      process.exit();
    } catch (error) {
      console.error(chalk.red(`Can't write data to files. Error: ${error.message}`));
      process.exit(1);
    }
  }
};

