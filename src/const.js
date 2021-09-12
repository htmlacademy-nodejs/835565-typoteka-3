'use strict';

// Cli
const DEFAULT_COUNT = 1;
const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const DEFAULT_PORT_SERVER = 3000;
const API_PREFIX = `/api`;
const NOT_FOUND_MESSAGE = `NOT FOUND`;

const ExitCode = {
  SUCCESS: 0,
  ERROR: 1,
};

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

// DB
const ANNOUNCE_CHAR_LENGTH = 1000;
const defaultArticleKeys = [`title`, `date`, `announce`, `fullText`, `сategories`, `picture`];
const defaultCommentKeys = [`text`, `date`];

// File names and paths
const FILE_NAME = `mocks.json`;
const FILE_PATH = `../../../mocks.json`;
const DB_FILL_FILE_PATH = `../../../sql/fill-db.sql`;
const DB_QUERIES_FILE_PATH = `../../../sql/queries.sql`;
const ARTICLE_TITLES_PATH = `../../data/titles.txt`;
const ARTICLE_DESCRIPTIONS_PATH = `../../data/descriptions.txt`;
const ARTICLE_CATEGORIES_PATH = `../../data/categories.txt`;
const COMMENTS_PATH = `../../data/comments.txt`;
const LOG_FILE_PATH = `../../../logs/api.log`;
const UPLOAD_DIR_PATH = `../upload/img/`;
const TEMPLATES_DIR_NAME = `templates`;
const NEW_POST_FILE_INPUT_NAME = `upload`;
const PUBLIC_DIR_NAME = `public`;
const UPLOAD_DIR_NAME = `upload`;

// Front
const DEFAULT_PORT_FRONT = 8080;
const MAX_ID_LENGTH = 10;
const HOT_ARTICLES_MAX_NUM = 4;
const PREVIEW_ARTICLES_MAX_NUM = 4;
const LAST_COMMENTS_MAX_NUM = 4;
const MAX_UPLOAD_FILE_SIZE = 1048576;

const HumanizedDateFormat = {
  SHORT: `YYYY-MM-DD`,
  FULL: `DD.MM.YYYY, HH:mm`,
};

const ErrorMessage = {
  SERVER_ERROR: `Bad connection, try again later.`
};

const HttpCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

// Mocks
const mockUsers = [
  {
    email: `ivanov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf95`,
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar1.jpg`
  },
  {
    email: `petrov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf93`,
    firstName: `Пётр`,
    lastName: `Петров`,
    avatar: `avatar2.jpg`
  }
];

const SentencesNum = {
  MIN: 1,
  MAX: 3,
};
const CategoriesNum = {
  MIN: 1,
  MAX: 3,
};
const DaysGap = {
  MIN: 1,
  MAX: 14,
};
const CommentsNum = {
  MIN: 2,
  MAX: 4,
};
const CommentsSentencesNum = {
  MIN: 1,
  MAX: 2,
};
const mockImgsNum = {
  MIN: 1,
  MAX: 3,
};

module.exports = {
  // Cli
  DEFAULT_COUNT,
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  DEFAULT_PORT_SERVER,
  API_PREFIX,
  NOT_FOUND_MESSAGE,
  ExitCode,
  Env,
  ANNOUNCE_CHAR_LENGTH,

  // File names and paths
  FILE_NAME,
  FILE_PATH,
  ARTICLE_TITLES_PATH,
  ARTICLE_DESCRIPTIONS_PATH,
  ARTICLE_CATEGORIES_PATH,
  COMMENTS_PATH,
  TEMPLATES_DIR_NAME,
  UPLOAD_DIR_PATH,
  PUBLIC_DIR_NAME,
  UPLOAD_DIR_NAME,
  NEW_POST_FILE_INPUT_NAME,
  DB_FILL_FILE_PATH,
  DB_QUERIES_FILE_PATH,
  LOG_FILE_PATH,

  // Front
  DEFAULT_PORT_FRONT,
  MAX_ID_LENGTH,
  HOT_ARTICLES_MAX_NUM,
  PREVIEW_ARTICLES_MAX_NUM,
  LAST_COMMENTS_MAX_NUM,
  MAX_UPLOAD_FILE_SIZE,
  HumanizedDateFormat,
  ErrorMessage,
  HttpCode,
  defaultArticleKeys,
  defaultCommentKeys,

  // Mocks
  mockUsers,
  SentencesNum,
  CategoriesNum,
  DaysGap,
  mockImgsNum,
  CommentsNum,
  CommentsSentencesNum,
};
