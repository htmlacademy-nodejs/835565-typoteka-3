'use strict';

const {generateMockData} = require(`../../utils`);
const {ExitCode} = require(`../../const`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {
  DEFAULT_COUNT,
  FILE_NAME,
  ARTICLE_TITLES_PATH,
  ARTICLE_DESCRIPTIONS_PATH,
  ARTICLE_CATEGORIES_PATH,
  COMMENTS_PATH,
} = require(`../../const`);

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (error) {
    console.error(chalk.red(error));
    return [];
  }
};

module.exports = {
  name: `--generate`,
  async run(args) {

    const options = {
      titles: await readContent(ARTICLE_TITLES_PATH),
      descriptions: await readContent(ARTICLE_DESCRIPTIONS_PATH),
      categories: await readContent(ARTICLE_CATEGORIES_PATH),
      comments: await readContent(COMMENTS_PATH),
    };

    const [count] = args;
    const articlesCount = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const articles = JSON.stringify(generateMockData(articlesCount, options));

    try {
      await fs.writeFile(FILE_NAME, articles);
      console.info(chalk.green(`Operation success. File created.`));
      process.exit(ExitCode.SUCCESS);
    } catch (error) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.ERROR);
    }
  }
};
