'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`);
const path = require(`path`);
const dayjs = require(`dayjs`);

const {DaysGap, HoursGap, MinutesGap} = require(`../const`);

const getRandomNum = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }
  return someArray;
};

const getRandomDate = () => {
  const randomDaysGap = getRandomNum(DaysGap.MIN, DaysGap.MAX);
  const randomHoursGap = getRandomNum(HoursGap.MIN, HoursGap.MAX);
  const randomMinutesGap = getRandomNum(MinutesGap.MIN, MinutesGap.MAX);
  return dayjs().add(-randomDaysGap, `day`).add(-randomHoursGap, `hour`).add(-randomMinutesGap, `minute`).format();
};

const readContent = async (filePath) => {
  try {
    const content = await fs.promises.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (error) {
    console.error(chalk.red(error));
    return [];
  }
};

const humanizeDate = (format, date) => {
  return dayjs(date).format(format);
};

const validationErrorHandler = (error) => error.response?.data.split(`\n`) || [error];

const getRandomMockArticleId = (mockArticles) => getRandomNum(1, mockArticles.length);

const findArticlesByTitle = (articles, title) => {
  return articles.filter((article) => article.title === title);
};

const adaptFormDataToClient = (data) => (
  {
    ...data,
    categories: data.categories?.map((categoryId) => ({id: +categoryId}))
  }
);

const createDirs = (dirpaths) => {
  console.info(chalk.green(`Creating folders...`));
  for (const dirpath of dirpaths) {
    console.info(chalk.green(`Creating folder: ${dirpath}`));
    fs.mkdirSync(path.resolve(process.cwd(), dirpath), {
      recursive: true,
    });
  }
  console.info(chalk.green(`Finished. \n`));
};

const copyFiles = async (sourceDir, targetDir) => {
  const files = await fs.promises.readdir(sourceDir);
  console.info(chalk.green(`Copying mock images...`));

  for (const file of files) {
    console.info(chalk.green(`Copying file: ${file}`));
    await fs.promises.copyFile(path.join(sourceDir, file), path.join(targetDir, file));
  }
  console.info(chalk.green(`Finished. \n`));
};

module.exports = {
  getRandomNum,
  shuffle,
  getRandomDate,
  readContent,
  humanizeDate,
  validationErrorHandler,
  getRandomMockArticleId,
  findArticlesByTitle,
  adaptFormDataToClient,
  createDirs,
  copyFiles,
};

