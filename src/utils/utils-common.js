'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const dayjs = require(`dayjs`);

const {DaysGap, HoursGap} = require(`../const`);

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
  return dayjs().add(-randomDaysGap, `day`).add(-randomHoursGap, `hour`).format();
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

const getRandomSubarray = (items, count) => {
  items = items.slice();
  const result = [];
  while (count--) {
    result.push(
        ...items.splice(
            getRandomNum(0, items.length - 1), 1
        )
    );
  }
  return result;
};

const prepareErrors = (errors) => {
  return errors.response.data.split(`\n`);
};

const getRandomMockArticleId = (mockArticles) => getRandomNum(1, mockArticles.length);

module.exports = {
  getRandomNum,
  shuffle,
  getRandomDate,
  readContent,
  humanizeDate,
  getRandomSubarray,
  prepareErrors,
  getRandomMockArticleId,
};

