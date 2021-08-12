'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {readContent} = require(`../../utils/utils-common`);
const {generateMockDataForDB, generateQueryToFillDB} = require(`../../utils/utils-data`);
const {
  DEFAULT_COUNT,
  DB_FILE_PATH,
  ARTICLE_TITLES_PATH,
  ARTICLE_DESCRIPTIONS_PATH,
  ARTICLE_CATEGORIES_PATH,
  COMMENTS_PATH,
  ExitCode,
} = require(`../../const`);

const mockUsers = [
  {
    email: `ivanov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf95`,
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar1.jpg`
  },
  {
    email: `petrov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf93`,
    firstName: `Пётр`,
    lastName: `Петров`,
    avatar: `avatar2.jpg`
  }
];

module.exports = {
  name: `--fill`,
  async run(args) {
    const [count] = args;
    const articlesCount = Number.parseInt(count, 10) || DEFAULT_COUNT;

    const titles = await readContent(ARTICLE_TITLES_PATH);
    const descriptions = await readContent(ARTICLE_DESCRIPTIONS_PATH);
    const categories = await readContent(ARTICLE_CATEGORIES_PATH);
    const commentsSentences = await readContent(COMMENTS_PATH);

    const options = {
      titles,
      descriptions,
      commentsSentences,
      categoriesCount: categories.length,
      mockUsersCount: mockUsers.length,
    };

    const articles = generateMockDataForDB(articlesCount, options);
    const comments = articles.flatMap((article) => article.comments);
    const articleCategories = articles.reduce((acc, currentArticle, index) => {
      currentArticle.сategories.forEach((categoryId) => acc.push({articleId: index + 1, categoryId}));
      return acc;
    }, []);

    const values = {
      userValues: mockUsers.map(
          ({email, passwordHash, firstName, lastName, avatar}) =>
            `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}')`
      ).join(`,\n`),

      categoryValues: categories.map((name) => `('${name}')`).join(`,\n`),

      articlesValues: articles.map(
          ({userId, title, date, announce, fullText, picture}) =>
            `(${userId}, '${title}', '${date}', '${announce}', '${fullText}', '${picture}')`
      ).join(`,\n`),

      articleCategoryValues: articleCategories.map(
          ({articleId, categoryId}) =>
            `(${articleId}, ${categoryId})`
      ).join(`,\n`),

      commentValues: comments.map(
          ({text, userId, articleId}) =>
            `('${text}', ${userId}, ${articleId})`
      ).join(`,\n`),
    };

    const content = generateQueryToFillDB(values);

    try {
      await fs.writeFile(DB_FILE_PATH, content);
      console.info(chalk.green(`Operation success. File created.`));
      process.exit(ExitCode.SUCCESS);
    } catch (error) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.ERROR);
    }
  }
};
