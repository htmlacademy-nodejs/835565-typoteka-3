'use strict';

const {nanoid} = require(`nanoid`);
const dayjs = require(`dayjs`);

const {
  MAX_ID_LENGTH,
  DaysGap,
  CommentsNum,
  CommentsSentencesNum,
  SentencesNum,
  CategoriesNum,
  HOT_ARTICLES_MAX_NUM,
  LAST_COMMENTS_MAX_NUM,
  PREVIEW_ARTICLES_MAX_NUM,
} = require(`./const`);

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
    date: getRandomDate(),
  }));
};

const generateMockData = (count, {titles, descriptions, categories, comments}) => {
  return Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    title: titles[getRandomNum(0, titles.length - 1)],
    createdDate: getRandomDate(),
    announce: shuffle(descriptions).slice(0, getRandomNum(SentencesNum.MIN, SentencesNum.MAX)).join(` `),
    fullText: shuffle(descriptions).slice(0, getRandomNum(SentencesNum.MIN, descriptions.length - 1)).join(` `),
    сategories: shuffle(categories).slice(0, getRandomNum(CategoriesNum.MIN, CategoriesNum.MAX)),
    comments: generateComments(getRandomNum(CommentsNum.MIN, CommentsNum.MAX), comments),
    picture: ``,
  }));
};

const getCategories = (articles) => {
  return articles.reduce((acc, currentArticle) => {
    currentArticle.сategories.forEach((categoryItem) => {
      if (!acc.some((item) => item.name === categoryItem)) {
        acc.push({name: categoryItem, count: 1});
      } else {
        acc.find((item) => item.name === categoryItem).count += 1;
      }
    });
    return acc;
  }, []);
};

const getHotArticles = (articles) => {
  return articles.slice()
    .sort((left, right) => right.comments.length - left.comments.length)
    .slice(0, HOT_ARTICLES_MAX_NUM);
};

const getPreviewArticles = (articles) => {
  return articles.slice()
    .sort((left, right) => right.createdDate - left.createdDate)
    .slice(0, PREVIEW_ARTICLES_MAX_NUM);
};

const parseCommentsForCommentPage = (articles) => {
  const comments = getCommentsByLatestDate(articles);
  return comments.reduce((acc, currentComment) => {
    articles.forEach((article) => {
      article.comments.forEach((comment) => {
        if (comment.id === currentComment.id) {
          acc.push(
              Object.assign(
                  {},
                  currentComment,
                  {"articleTitle": article.title}
              )
          );
        }
      });
    });
    return acc;
  }, []);
};

const getCommentsByLatestDate = (articles) => {
  const comments = articles.reduce((acc, currentArticle) => {
    currentArticle.comments.forEach((comment) => acc.push(comment));
    return acc;
  }, []);
  return comments.sort((left, right) => {
    if (left.date > right.date) {
      return -1;
    }
    if (left.date < right.date) {
      return 1;
    }
    return 0;
  });
};

const getLastComments = (articles) => {
  return getCommentsByLatestDate(articles).slice(0, LAST_COMMENTS_MAX_NUM);
};

const humanizeDate = (format, date) => {
  return dayjs(date).format(format);
};

const ensureArray = (value) => Array.isArray(value) ? value : [value];

module.exports = {
  getRandomNum,
  shuffle,
  getRandomDate,
  generateMockData,
  getCategories,
  getHotArticles,
  getPreviewArticles,
  parseCommentsForCommentPage,
  getCommentsByLatestDate,
  getLastComments,
  humanizeDate,
  ensureArray,
};

