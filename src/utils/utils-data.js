'use strict';

const {nanoid} = require(`nanoid`);
const {
  MAX_ID_LENGTH,
  CommentsNum,
  CommentsSentencesNum,
  SentencesNum,
  CategoriesNum,
  HOT_ARTICLES_MAX_NUM,
  LAST_COMMENTS_MAX_NUM,
  PREVIEW_ARTICLES_MAX_NUM,
} = require(`../const`);
const {shuffle, getRandomDate, getRandomNum, sortByLatestDate} = require(`./utils-common`);

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
    date: getRandomDate(),
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
    .sort(sortByLatestDate)
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
  return comments.sort(sortByLatestDate);
};

const getLastComments = (articles) => {
  return getCommentsByLatestDate(articles).slice(0, LAST_COMMENTS_MAX_NUM);
};

const getRandomCategoriesId = (categoriesNum, categoriesCount) => {
  const categories = [];
  for (let i = 0; i < categoriesNum; i++) {
    categories.push(getRandomNum(1, categoriesCount));
  }
  return categories;
};

const generateCommentsForDB = (count, articleId, usersCount, comments) => (
  Array(count).fill({}).map(() => ({
    userId: getRandomNum(1, usersCount),
    articleId,
    text: shuffle(comments)
      .slice(0, getRandomNum(CommentsSentencesNum.MIN, CommentsSentencesNum.MAX))
      .join(` `),
  }))
);

const generateMockDataForDB = (count, {titles, descriptions, commentsSentences, categoriesCount, mockUsersCount}) => {
  return Array(count).fill({}).map((_, index) => ({
    userId: getRandomNum(1, mockUsersCount),
    title: titles[getRandomNum(0, titles.length - 1)],
    date: getRandomDate(),
    announce: shuffle(descriptions).slice(0, getRandomNum(SentencesNum.MIN, SentencesNum.MAX)).join(` `),
    fullText: shuffle(descriptions).slice(0, getRandomNum(SentencesNum.MIN, descriptions.length - 1)).join(` `),
    сategories: getRandomCategoriesId(getRandomNum(CategoriesNum.MIN, CategoriesNum.MAX), categoriesCount),
    comments: generateCommentsForDB(getRandomNum(CommentsNum.MIN, CommentsNum.MAX), index + 1, mockUsersCount, commentsSentences),
    picture: ``,
  }));
};

const generateQueryToFillDB = ({userValues, categoryValues, articlesValues, articleCategoryValues, commentValues}) => {
  return `
INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
${userValues};
INSERT INTO categories(name) VALUES
${categoryValues};
ALTER TABLE articles DISABLE TRIGGER ALL;
INSERT INTO articles(user_id, title, date, announce, fullText, picture) VALUES
${articlesValues};
ALTER TABLE articles ENABLE TRIGGER ALL;
ALTER TABLE articles_categories DISABLE TRIGGER ALL;
INSERT INTO articles_categories(article_id, category_id) VALUES
${articleCategoryValues};
ALTER TABLE articles_categories ENABLE TRIGGER ALL;
ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO comments(text, user_id, article_id) VALUES
${commentValues};
ALTER TABLE comments ENABLE TRIGGER ALL;`;
};

module.exports = {
  generateMockData,
  getCategories,
  getHotArticles,
  getPreviewArticles,
  parseCommentsForCommentPage,
  getLastComments,
  generateMockDataForDB,
  generateQueryToFillDB,
};
