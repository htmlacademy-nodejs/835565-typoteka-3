'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const path = require(`path`);

const {getMockData, generateQueryToFillDB} = require(`../../utils/utils-data`);
const {createDirs} = require(`../../utils/utils-common`);
const {
  DEFAULT_COUNT,
  DB_FILL_FILE_PATH,
  SQL_FILES_DIR_PATH,
  ExitCode
} = require(`../../const`);

module.exports = {
  name: `--fill-db`,
  async run(args) {
    const [count] = args;
    const articlesCount = Number.parseInt(count, 10) || DEFAULT_COUNT;

    const {
      mockUsers,
      mockArticles,
      mockCategories,
      mockComments,
      mockArticlesCategories
    } = await getMockData(articlesCount);

    const valuesToFill = {
      userValues: mockUsers.map(
          ({
            email,
            passwordHash,
            firstName,
            lastName,
            avatarFullsize,
            avatarSmall,
            isAdmin,
            createdAt,
            updatedAt,
          }) => `(
            '${email}',
            '${passwordHash}',
            '${firstName}',
            '${lastName}',
            '${avatarFullsize}',
            '${avatarSmall}',
            '${isAdmin}' ,
            '${createdAt}',
            '${updatedAt}'
          )`
      ).join(`,\n`),

      categoryValues: mockCategories.map(
          ({name, createdAt, updatedAt}) =>
            `('${name}', '${createdAt}', '${updatedAt}')`
      ).join(`,\n`),

      articlesValues: mockArticles.map(
          ({
            userId,
            title,
            announce,
            fullText,
            fullsizePicture,
            previewPicture,
            createdAt,
            updatedAt
          }) => `(
            '${userId}',
            '${title}',
            '${announce}',
            '${fullText}',
            '${fullsizePicture}',
            '${previewPicture}',
            '${createdAt}',
            '${updatedAt}'
          )`
      ).join(`,\n`),

      articleCategoryValues: mockArticlesCategories
        .map(({articleId, categoryId}) => `(${articleId}, ${categoryId})`)
        .join(`,\n`),

      commentValues: mockComments
        .map(
            ({text, userId, articleId, createdAt, updatedAt}) =>
              `('${text}', '${userId}', '${articleId}', '${createdAt}', '${updatedAt}')`
        ).join(`,\n`),
    };

    const contentToFill = generateQueryToFillDB(valuesToFill);

    try {
      createDirs([SQL_FILES_DIR_PATH]);
      await fs.writeFile(
          path.resolve(__dirname, DB_FILL_FILE_PATH),
          contentToFill
      );

      console.info(chalk.green(`Operation success. File created.`));
      process.exit();
    } catch (error) {
      console.error(
          chalk.red(`Can't write data to file. Error: ${error.message}`)
      );
      process.exit(ExitCode.ERROR);
    }
  },
};
