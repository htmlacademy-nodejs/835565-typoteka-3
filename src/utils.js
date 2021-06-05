'use strict';

const {nanoid} = require(`nanoid`);

const {
  MAX_ID_LENGTH,
  DaysGap,
  CommentsNum,
  CommentsSentencesNum,
  SentencesNum,
  CategoriesNum,
} = require(`./const`);
const dayjs = require(`dayjs`);

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

const generateComments = (count, comments) => {
  return Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments).slice(0, getRandomNum(CommentsSentencesNum.MIN, CommentsSentencesNum.MAX)).join(` `),
  }));
};

const generateMockData = (count, titles, descriptions, categories, comments) => {
  return Array(count).fill({}).map(() => ({
    title: titles[getRandomNum(0, titles.length - 1)],
    createdDate: getRandomDate(),
    announce: shuffle(descriptions).slice(0, getRandomNum(SentencesNum.MIN, SentencesNum.MAX)).join(` `),
    fullText: shuffle(descriptions).slice(0, getRandomNum(SentencesNum.MIN, descriptions.length - 1)).join(` `),
    сategories: shuffle(categories).slice(0, getRandomNum(CategoriesNum.MIN, CategoriesNum.MAX)),
    comments: generateComments(getRandomNum(CommentsNum.MIN, CommentsNum.MAX), comments),
  }));
};

module.exports = {
  getRandomNum,
  shuffle,
  getRandomDate,
  generateMockData,
};

