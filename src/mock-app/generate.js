'use strict';

const {
  getRandomNum,
  shuffle,
  getRandomDate
} = require(`./utils`);
const fs = require(`fs`);
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
  run(args) {
    const [count] = args;
    const articlesCount = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const articles = JSON.stringify(generateMockData(articlesCount));

    fs.writeFile(FILE_NAME, articles, (err) => {
      return (
        err
          ? console.error(chalk.red(`Can't write data to file...`))
          : console.info(chalk.green(`Operation success. File created.`))
      );
    });
  }
};
