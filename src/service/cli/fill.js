'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const path = require(`path`);

const {readContent, getRandomNum} = require(`../../utils/utils-common`);
const {
  generateMockDataForDB,
  generateQueryToFillDB,
  generateQueryToGetDataFromDB
} = require(`../../utils/utils-data`);
const {
  DEFAULT_COUNT,
  ARTICLE_TITLES_PATH,
  ARTICLE_DESCRIPTIONS_PATH,
  ARTICLE_CATEGORIES_PATH,
  COMMENTS_PATH,
  ExitCode,
  DB_FILL_FILE_PATH,
  DB_QUERIES_FILE_PATH,
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

    const titles = await readContent(path.resolve(__dirname, ARTICLE_TITLES_PATH));
    const descriptions = await readContent(path.resolve(__dirname, ARTICLE_DESCRIPTIONS_PATH));
    const categories = await readContent(path.resolve(__dirname, ARTICLE_CATEGORIES_PATH));
    const commentsSentences = await readContent(path.resolve(__dirname, COMMENTS_PATH));

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

    const valuesToFill = {
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

    const valuesToGetData = {
      articleId: getRandomNum(1, articles.length),
      newCommentsLimit: 5,
      commentsArticleId: getRandomNum(1, articles.length),
      updatedTitle: `New Title`,
      updatedArticleId: getRandomNum(1, articles.length),
    };

    const contentToFill = generateQueryToFillDB(valuesToFill);
    const contentToGetData = generateQueryToGetDataFromDB(valuesToGetData);

    try {
      await fs.writeFile(path.resolve(__dirname, DB_FILL_FILE_PATH), contentToFill);
      await fs.writeFile(path.resolve(__dirname, DB_QUERIES_FILE_PATH), contentToGetData);
      console.info(chalk.green(`Operation success. Files created.`));
      process.exit();
    } catch (error) {
      console.error(chalk.red(`Can't write data to file. Error: ${error.message}`));
      process.exit(ExitCode.ERROR);
    }
  }
};
