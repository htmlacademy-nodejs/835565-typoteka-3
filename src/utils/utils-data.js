'use strict';

const {nanoid} = require(`nanoid`);
const {
  MAX_ID_LENGTH,
  CommentsNum,
  CommentsSentencesNum,
  SentencesNum,
  CategoriesNum,
  mockImgsNum,
  HOT_ARTICLES_MAX_NUM,
  LAST_COMMENTS_MAX_NUM,
  PREVIEW_ARTICLES_MAX_NUM,
} = require(`../const`);
const {shuffle, getRandomDate, getRandomNum, sortByLatestDate, getRandomSubarray} = require(`./utils-common`);

const getRandomImgFileName = () => {
  return `${getRandomNum(mockImgsNum.MIN, mockImgsNum.MAX)}.jpg`;
};

const generateComments = (count, comments) => {
  return Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments).slice(0, getRandomNum(CommentsSentencesNum.MIN, CommentsSentencesNum.MAX)).join(` `),
    createdAt: getRandomDate(),
  }));
};

const generateMockData = (count, {titles, descriptions, categories, comments}) => {
  return Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    title: titles[getRandomNum(0, titles.length - 1)],
    createdAt: getRandomDate(),
    announce: shuffle(descriptions).slice(0, getRandomNum(SentencesNum.MIN, SentencesNum.MAX)).join(` `),
    fullText: shuffle(descriptions).slice(0, getRandomNum(SentencesNum.MIN, descriptions.length - 1)).join(` `),
    сategories: shuffle(categories).slice(0, getRandomNum(CategoriesNum.MIN, CategoriesNum.MAX)),
    comments: generateComments(getRandomNum(CommentsNum.MIN, CommentsNum.MAX), comments),
    picture: getRandomImgFileName(),
  }));
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

const generateCommentsForDB = (count, articleId, usersCount, comments) => (
  Array(count).fill({}).map(() => ({
    userId: getRandomNum(1, usersCount),
    articleId,
    text: shuffle(comments)
      .slice(0, getRandomNum(CommentsSentencesNum.MIN, CommentsSentencesNum.MAX))
      .join(` `),
    createdAt: getRandomDate()
  }))
);

const generateMockDataForDB = (count, {titles, descriptions, commentsSentences, categories, mockUsersCount}) => {
  return Array(count).fill({}).map((_, index) => ({
    userId: getRandomNum(1, mockUsersCount),
    title: titles[getRandomNum(0, titles.length - 1)],
    createdAt: getRandomDate(),
    announce: shuffle(descriptions).slice(0, getRandomNum(SentencesNum.MIN, SentencesNum.MAX)).join(` `),
    fullText: shuffle(descriptions).slice(0, getRandomNum(SentencesNum.MIN, descriptions.length - 1)).join(` `),
    сategories: getRandomSubarray(categories),
    comments: generateCommentsForDB(getRandomNum(CommentsNum.MIN, CommentsNum.MAX), index + 1, mockUsersCount, commentsSentences),
    picture: getRandomImgFileName(),
  }));
};

const generateQueryToFillDB = ({userValues, categoryValues, articlesValues, articleCategoryValues, commentValues}) => {
  return `
INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
${userValues};
INSERT INTO categories(name) VALUES
${categoryValues};
ALTER TABLE articles DISABLE TRIGGER ALL;
INSERT INTO articles(user_id, title, createdAt, announce, fullText, picture) VALUES
${articlesValues};
ALTER TABLE articles ENABLE TRIGGER ALL;
ALTER TABLE article_categories DISABLE TRIGGER ALL;
INSERT INTO article_categories(article_id, category_id) VALUES
${articleCategoryValues};
ALTER TABLE article_categories ENABLE TRIGGER ALL;
ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO comments(text, user_id, article_id) VALUES
${commentValues};
ALTER TABLE comments ENABLE TRIGGER ALL;`;
};

const generateQueryToGetDataFromDB = (
    {articleId, newCommentsLimit, commentsArticleId, updatedTitle, updatedArticleId}
) => {
  return `
/* Список всех категорий */
SELECT * FROM categories;

/* Список непустых категорий */
SELECT id, name FROM categories
  JOIN article_categories
  ON id = category_id
  GROUP BY id;

/* Категории с количеством статей */
SELECT id, name, count(article_id) FROM categories
  LEFT JOIN article_categories
  ON id = category_id
  GROUP BY id;

/* Список статей, сначала свежие */
SELECT articles.*,
  count(comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
  users.first_name,
  users.last_name,
  users.email
FROM articles
  JOIN article_categories ON articles.id = article_categories.article_id
  JOIN categories ON article_categories.category_id = categories.id
  LEFT JOIN comments ON comments.article_id = articles.id
  JOIN users ON users.id = articles.user_id
  GROUP BY articles.id, users.id
  ORDER BY articles.createdAt DESC;

/* Детальная информация о статье */
SELECT articles.*,
  COUNT(comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
  users.first_name,
  users.last_name,
  users.email
FROM articles
  JOIN article_categories ON articles.id = article_categories.article_id
  JOIN categories ON article_categories.category_id = categories.id
  LEFT JOIN comments ON comments.article_id = articles.id
  JOIN users ON users.id = articles.user_id
WHERE articles.id = ${articleId}
  GROUP BY articles.id, users.id;

/* Свежие комментарии */
SELECT
  comments.id,
  comments.article_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
  ORDER BY comments.createdAt DESC
  LIMIT ${newCommentsLimit};

/* Комментарии к статье, сначала свежие */
SELECT
  comments.id,
  comments.article_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
WHERE comments.article_id = ${commentsArticleId}
  ORDER BY comments.createdAt DESC;

/* Обновить заголовок */
UPDATE articles
SET title = '${updatedTitle}'
WHERE id = ${updatedArticleId}`;
};

module.exports = {
  generateMockData,
  getHotArticles,
  getPreviewArticles,
  parseCommentsForCommentPage,
  getLastComments,
  generateMockDataForDB,
  generateQueryToFillDB,
  generateQueryToGetDataFromDB,
};
