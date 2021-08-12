'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const dayjs = require(`dayjs`);

const {DaysGap} = require(`../const`);

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
  return dayjs().add(-randomDaysGap, `day`).format();
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (error) {
    console.error(chalk.red(error));
    return [];
  }
};

const humanizeDate = (format, date) => {
  return dayjs(date).format(format);
};

const ensureArray = (value) => Array.isArray(value) ? value : [value];

const sortByLatestDate = (left, right) => {
  if (left.date > right.date) {
    return -1;
  }
  if (left.date < right.date) {
    return 1;
  }
  return 0;
};

module.exports = {
  getRandomNum,
  shuffle,
  getRandomDate,
  readContent,
  humanizeDate,
  ensureArray,
  sortByLatestDate,
};

