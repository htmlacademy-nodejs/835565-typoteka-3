'use strict';

const fs = require(`fs`).promises;
const path = require(`path`);
const chalk = require(`chalk`);
const passwordUtility = require(`../service/lib/password`);
const {
  CommentsSentencesNum,
  SentencesNum,
  CategoriesNum,
  Aliase,
  ARTICLE_TITLES_PATH,
  ARTICLE_DESCRIPTIONS_PATH,
  CATEGORIES_PATH,
  COMMENTS_PATH,
  MOCK_SEEDERS_DIR_PATH
} = require(`../const`);

const {
  shuffle,
  getRandomDate,
  getRandomNum,
  readContent,
} = require(`./utils-common`);

const getMockUsers = async () => [
  {
    firstName: `Иван`,
    lastName: `Иванов`,
    email: `ivanov@example.com`,
    passwordHash: await passwordUtility.hash(`ivanov`),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    avatarFullsize: `avatar-1.png`,
    avatarSmall: `avatar-small-1.png`,
    isAdmin: true,
  },
  {
    firstName: `Пётр`,
    lastName: `Петров`,
    email: `petrov@example.com`,
    passwordHash: await passwordUtility.hash(`petrov`),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    avatarFullsize: `avatar-2.png`,
    avatarSmall: `avatar-small-2.png`,
    isAdmin: false,
  },
  {
    firstName: `Сергей`,
    lastName: `Сергеев`,
    email: `sergeev@example.com`,
    passwordHash: await passwordUtility.hash(`sergeev`),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    avatarFullsize: `avatar-3.webp`,
    avatarSmall: `avatar-small-3.webp`,
    isAdmin: false,
  },
];

const getRandomImgFileName = () => {
  return Math.random() > 0.5
    ? {fullPic: `sea-fullsize@1x.jpg`, smallPic: `sea@1x.jpg`}
    : {fullPic: ``, smallPic: ``};
};

const generateMockArticles = (
    count,
    {titles, descriptions, mockUsers, categories}
) => {
  console.info(chalk.green(`Generating articles`));
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

const generateMockCategories = (categories) => {
  console.info(chalk.green(`Generating categories`));
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

const generateMockComments = (comments, mockUsers, articles) => {
  console.info(chalk.green(`Generating comments`));
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

const generateMockArticlesCategories = (articles) => {
  console.info(chalk.green(`Generating articles_categories assosiations`));
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

const getMockData = async (articlesCount) => {
  console.info(chalk.green(`Generating data... \n`));

  const [
    titles,
    descriptions,
    categories,
    commentSentenses,
    mockUsers
  ] = await Promise.all([
    readContent(
        path.resolve(__dirname, ARTICLE_TITLES_PATH)
    ),
    readContent(
        path.resolve(__dirname, ARTICLE_DESCRIPTIONS_PATH)
    ),
    readContent(
        path.resolve(__dirname, CATEGORIES_PATH)
    ),
    readContent(
        path.resolve(__dirname, COMMENTS_PATH)
    ),
    getMockUsers()
  ]);

  const mockArticles = generateMockArticles(articlesCount, {
    titles,
    descriptions,
    mockUsers,
    categories,
  });

  const mockCategories = generateMockCategories(categories);

  const mockComments = generateMockComments(
      commentSentenses,
      mockUsers,
      mockArticles
  );

  const mockArticlesCategories = generateMockArticlesCategories(
      mockArticles
  );

  console.info(chalk.green(`Finished. \n`));

  return {
    mockUsers,
    mockArticles,
    mockCategories,
    mockComments,
    mockArticlesCategories
  };
};

const createMockData = async (data) => {
  console.info(chalk.green(`Writing generated data...`));
  const promises = Object.keys(data).map(async (item) => {
    console.info(chalk.green(`Writing file: ${item}.json`));
    await fs.writeFile(
        `${process.cwd()}/${MOCK_SEEDERS_DIR_PATH}/${item}.json`,
        data[item]
    );
  });

  console.info(chalk.green(`Finished. \n`));
  return await Promise.all(promises);
};

const generateQueryToCreateDB = (dbName, dbUser) => {
  console.info(chalk.green(`Creating .sql file... \n Default options for PostgreSQL. \n`));
  return `
CREATE DATABASE ${dbName}
WITH
OWNER = ${dbUser}
ENCODING = 'UTF8'
LC_COLLATE = 'C'
LC_CTYPE = 'C'
TABLESPACE = pg_default
TEMPLATE template0
CONNECTION LIMIT = -1;
`;
};

const generateDbSchema = () => {
  console.info(chalk.green(`Creating .sql schema file... \n`));
  return `
DROP TABLE IF EXISTS "${Aliase.ARTICLES_CATEGORIES}" CASCADE;
DROP TABLE IF EXISTS "${Aliase.COMMENTS}" CASCADE;
DROP TABLE IF EXISTS "${Aliase.ARTICLES}" CASCADE;
DROP TABLE IF EXISTS "${Aliase.USERS}" CASCADE;
DROP TABLE IF EXISTS "${Aliase.CATEGORIES}" CASCADE;

CREATE TABLE "${Aliase.CATEGORIES}"
  (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "${Aliase.CATEGORIES}_pkey" PRIMARY KEY (id)
  );

CREATE TABLE "${Aliase.USERS}"
  (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "avatarFullsize" VARCHAR(255),
    "avatarSmall" VARCHAR(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "isAdmin" boolean NOT NULL,
    CONSTRAINT "${Aliase.USERS}_pkey" PRIMARY KEY (id),
    CONSTRAINT "${Aliase.USERS}_email_key" UNIQUE (email)
  );

CREATE TABLE "${Aliase.ARTICLES}"
  (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    "title" VARCHAR(255) NOT NULL,
    "announce" VARCHAR(1000) NOT NULL,
    "fullText" text,
    "fullsizePicture" VARCHAR(255),
    "previewPicture" VARCHAR(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "userId" integer,
    CONSTRAINT "${Aliase.ARTICLES}_pkey" PRIMARY KEY (id),
    CONSTRAINT "${Aliase.ARTICLES}_userId_fkey" FOREIGN KEY ("userId")
      REFERENCES "${Aliase.USERS}" (id) MATCH SIMPLE
      ON UPDATE CASCADE
      ON DELETE SET NULL
  );

CREATE TABLE "${Aliase.COMMENTS}"
  (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    "text" VARCHAR(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "articleId" integer,
    "userId" integer,
    CONSTRAINT "${Aliase.COMMENTS}_pkey" PRIMARY KEY (id),
    CONSTRAINT "${Aliase.COMMENTS}_articleId_fkey" FOREIGN KEY ("articleId")
      REFERENCES "${Aliase.ARTICLES}" (id) MATCH SIMPLE
      ON UPDATE CASCADE
      ON DELETE CASCADE,
    CONSTRAINT "${Aliase.COMMENTS}_userId_fkey" FOREIGN KEY ("userId")
      REFERENCES "${Aliase.USERS}" (id) MATCH SIMPLE
      ON UPDATE CASCADE
      ON DELETE SET NULL
  );

CREATE TABLE "${Aliase.ARTICLES_CATEGORIES}"
  (
    "articleId" integer,
    "categoryId" integer,
    CONSTRAINT "${Aliase.ARTICLES_CATEGORIES}_articleId_fkey" FOREIGN KEY ("articleId")
      REFERENCES "${Aliase.ARTICLES}" (id) MATCH SIMPLE
      ON UPDATE CASCADE
      ON DELETE CASCADE,
    CONSTRAINT "${Aliase.ARTICLES_CATEGORIES}_categoryId_fkey" FOREIGN KEY ("categoryId")
      REFERENCES "${Aliase.CATEGORIES}" (id) MATCH SIMPLE
      ON UPDATE CASCADE
      ON DELETE CASCADE
  );
`;
};

const generateQueryToFillDB = ({
  userValues,
  categoryValues,
  articlesValues,
  articleCategoryValues,
  commentValues,
}) => {
  return `
INSERT INTO "${Aliase.USERS}"(
"email",
"passwordHash",
"firstName",
"lastName",
"avatarFullsize",
"avatarSmall",
"isAdmin",
"createdAt",
"updatedAt") VALUES
${userValues};

INSERT INTO "${Aliase.CATEGORIES}"("name", "createdAt", "updatedAt") VALUES
${categoryValues};

ALTER TABLE "${Aliase.ARTICLES}" DISABLE TRIGGER ALL;
INSERT INTO "${Aliase.ARTICLES}"(
"userId",
"title",
"announce",
"fullText",
"fullsizePicture",
"previewPicture",
"createdAt",
"updatedAt") VALUES
${articlesValues};
ALTER TABLE "${Aliase.ARTICLES}" ENABLE TRIGGER ALL;

ALTER TABLE "${Aliase.ARTICLES_CATEGORIES}" DISABLE TRIGGER ALL;
INSERT INTO "${Aliase.ARTICLES_CATEGORIES}"("articleId", "categoryId") VALUES
${articleCategoryValues};
ALTER TABLE "${Aliase.ARTICLES_CATEGORIES}" ENABLE TRIGGER ALL;

ALTER TABLE "${Aliase.COMMENTS}" DISABLE TRIGGER ALL;
INSERT INTO "${Aliase.COMMENTS}"("text", "userId", "articleId", "createdAt", "updatedAt") VALUES
${commentValues};
ALTER TABLE "${Aliase.COMMENTS}" ENABLE TRIGGER ALL;`;
};

module.exports = {
  getMockUsers,
  getRandomImgFileName,
  generateMockArticles,
  generateMockCategories,
  generateMockComments,
  generateMockArticlesCategories,
  getMockData,
  createMockData,
  generateQueryToCreateDB,
  generateDbSchema,
  generateQueryToFillDB,
};
