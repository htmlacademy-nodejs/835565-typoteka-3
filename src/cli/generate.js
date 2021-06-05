'use strict';

const {
  getRandomNum,
  shuffle,
  getRandomDate
} = require(`../utils`);
const {ExitCode} = require(`../const`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {
  DEFAULT_COUNT,
  FILE_NAME,
  SentencesNum,
  CategoriesNum,
  ARTICLE_TITLES_PATH,
  ARTICLE_DESCRIPTIONS_PATH,
  ARTICLE_CATEGORIES_PATH,
} = require(`../const`);

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (error) {
    console.error(chalk.red(error));
    return [];
  }
};

const generateMockData = (count, titles, descriptions, categories) => {
  return Array(count).fill({}).map(() => ({
    title: titles[getRandomNum(0, titles.length - 1)],
    createdDate: getRandomDate(),
    announce: shuffle(descriptions).slice(0, getRandomNum(SentencesNum.MIN, SentencesNum.MAX)).join(` `),
    fullText: shuffle(descriptions).slice(0, getRandomNum(SentencesNum.MIN, descriptions.length - 1)).join(` `),
    сategory: shuffle(categories).slice(0, getRandomNum(CategoriesNum.MIN, CategoriesNum.MAX)),
  }));
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const titles = await readContent(ARTICLE_TITLES_PATH);
    const descriptions = await readContent(ARTICLE_DESCRIPTIONS_PATH);
    const categories = await readContent(ARTICLE_CATEGORIES_PATH);

    const [count] = args;
    const articlesCount = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const articles = JSON.stringify(generateMockData(articlesCount, titles, descriptions, categories));

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
