'use strict';

const {
  getRandomNum,
  shuffle,
  getRandomDate
} = require(`./utils`);
const {ExitCode} = require(`../mock-app/const`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {
  DEFAULT_COUNT,
  FILE_NAME,
  SentencesNum,
  CategoriesNum,
  TITLES,
  TEXT,
  CATEGORY,
} = require(`./const`);

const generateMockData = (count) => {
  return Array(count).fill({}).map(() => ({
    title: TITLES[getRandomNum(0, TITLES.length - 1)],
    createdDate: getRandomDate(),
    announce: shuffle(TEXT).slice(0, getRandomNum(SentencesNum.MIN, SentencesNum.MAX)).join(` `),
    fullText: shuffle(TEXT).slice(0, getRandomNum(SentencesNum.MIN, TEXT.length - 1)).join(` `),
    сategory: shuffle(CATEGORY).slice(0, getRandomNum(CategoriesNum.MIN, CategoriesNum.MAX)),
  }));
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    const articlesCount = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const articles = JSON.stringify(generateMockData(articlesCount));

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
