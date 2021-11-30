"use strict";

const passwordUtility = require(`../service/lib/password`);

const {
  CommentsSentencesNum,
  SentencesNum,
  CategoriesNum,
} = require(`../const`);

const {shuffle, getRandomDate, getRandomNum} = require(`./utils-common`);

const {getRandomImgFileName} = require(`./utils-data`);

const getMockUsers = async () => [
  {
    firstName: `Иван`,
    lastName: `Иванов`,
    email: `ivanov@example.com`,
    passwordHash: await passwordUtility.hash(`ivanov`),
    createdAt: new Date(),
    updatedAt: new Date(),
    avatarFullsize: `avatar-1.png`,
    avatarSmall: `avatar-small-1.png`,
    isAdmin: true,
  },
  {
    firstName: `Пётр`,
    lastName: `Петров`,
    email: `petrov@example.com`,
    passwordHash: await passwordUtility.hash(`petrov`),
    createdAt: new Date(),
    updatedAt: new Date(),
    avatarFullsize: `avatar-2.png`,
    avatarSmall: `avatar-small-2.png`,
    isAdmin: false,
  },
  {
    firstName: `Сергей`,
    lastName: `Сергеев`,
    email: `sergeev@example.com`,
    passwordHash: await passwordUtility.hash(`sergeev`),
    createdAt: new Date(),
    updatedAt: new Date(),
    avatarFullsize: `avatar-3.webp`,
    avatarSmall: `avatar-small-3.webp`,
    isAdmin: false,
  },
];

const generateMockArticlesForDB = (
    count,
    {titles, descriptions, mockUsers, categories}
) => {
  return Array(count)
    .fill({})
    .map(() => {
      const {fullPic, smallPic} = getRandomImgFileName();
      const randomDate = getRandomDate();

      return {
        userId: getRandomNum(1, mockUsers.length),
        title: titles[getRandomNum(0, titles.length - 1)],
        createdAt: randomDate,
        updatedAt: randomDate,
        announce: shuffle(descriptions)
          .slice(0, getRandomNum(SentencesNum.MIN, SentencesNum.MAX))
          .join(` `),
        fullText: shuffle(descriptions)
          .slice(0, getRandomNum(SentencesNum.MIN, descriptions.length - 1))
          .join(` `),
        fullsizePicture: fullPic,
        previewPicture: smallPic,
        categories: Array(getRandomNum(CategoriesNum.MIN, CategoriesNum.MAX))
          .fill()
          .map(() => getRandomNum(1, categories.length)),
      };
    });
};

const generateMockCategoriesForDB = (categories) => {
  return Array(categories.length)
    .fill({})
    .map((item, i) => {
      const randomDate = getRandomDate();

      return {
        name: categories[i],
        createdAt: randomDate,
        updatedAt: randomDate,
      };
    });
};

const generateMockCommentsForDB = (comments, mockUsers, articles) => {
  return Array(comments.length)
    .fill({})
    .map(() => {
      const randomDate = getRandomDate();

      return {
        userId: getRandomNum(1, mockUsers.length),
        articleId: getRandomNum(1, articles.length),
        text: shuffle(comments)
          .slice(
              0,
              getRandomNum(CommentsSentencesNum.MIN, CommentsSentencesNum.MAX)
          )
          .join(` `),
        createdAt: randomDate,
        updatedAt: randomDate,
      };
    });
};

const generateMockArticlesCategoriesForDB = (articles) => {
  return articles.reduce((acc, item, i) => {
    const result = item.categories.map((category) => ({
      articleId: i + 1,
      categoryId: category,
    }));
    acc.push(...result);
    delete item.categories;
    return acc;
  }, []);
};

module.exports = {
  getMockUsers,
  generateMockArticlesForDB,
  generateMockCategoriesForDB,
  generateMockCommentsForDB,
  generateMockArticlesCategoriesForDB,
};
