'use strict';

const DEFAULT_COUNT = 1;
const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const FILE_NAME = `mocks.json`;
const DEFAULT_PORT = 3000;
const FILE_PATH = `./mocks.json`;
const DB_FILE_PATH = `./sql/fill-db.sql`;
const NOT_FOUND_MESSAGE = `NOT FOUND`;
const ARTICLE_TITLES_PATH = `./src/data/titles.txt`;
const ARTICLE_DESCRIPTIONS_PATH = `./src/data/descriptions.txt`;
const ARTICLE_CATEGORIES_PATH = `./src/data/categories.txt`;
const COMMENTS_PATH = `./src/data/comments.txt`;
const MAX_ID_LENGTH = 10;
const API_PREFIX = `/api`;
const HOT_ARTICLES_MAX_NUM = 4;
const PREVIEW_ARTICLES_MAX_NUM = 4;
const LAST_COMMENTS_MAX_NUM = 4;
const TEMPLATES_DIR = `templates`;
const UPLOAD_PATH = `../upload/img/`;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;
const MAX_UPLOAD_FILE_SIZE = 1048576;
const NEW_POST_FILE_INPUT_NAME = `upload`;

const defaultArticleKeys = [`title`, `date`, `announce`, `fullText`, `сategories`, `picture`];
const defaultCommentKeys = [`text`, `date`];

const HumanizedDateFormat = {
  SHORT: `YYYY-MM-DD`,
  FULL: `DD.MM.YYYY, HH:mm`,
};

const ErrorMessage = {
  SERVER_ERROR: `Bad connection, try again later.`
};

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

const url = {
  ROOT: `/`,
};
const HttpCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};
const ExitCode = {
  SUCCESS: 0,
  ERROR: 1,
};
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
  DEFAULT_COUNT,
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  FILE_NAME,
  ARTICLE_TITLES_PATH,
  ARTICLE_DESCRIPTIONS_PATH,
  ARTICLE_CATEGORIES_PATH,
  COMMENTS_PATH,
  MAX_ID_LENGTH,
  API_PREFIX,
  HOT_ARTICLES_MAX_NUM,
  PREVIEW_ARTICLES_MAX_NUM,
  LAST_COMMENTS_MAX_NUM,
  TEMPLATES_DIR,
  UPLOAD_PATH,
  PUBLIC_DIR,
  UPLOAD_DIR,
  MAX_UPLOAD_FILE_SIZE,
  NEW_POST_FILE_INPUT_NAME,
  HumanizedDateFormat,
  ErrorMessage,
  ExitCode,
  SentencesNum,
  CategoriesNum,
  DaysGap,
  mockImgsNum,
  DEFAULT_PORT,
  FILE_PATH,
  DB_FILE_PATH,
  NOT_FOUND_MESSAGE,
  url,
  HttpCode,
  CommentsNum,
  CommentsSentencesNum,
  defaultArticleKeys,
  defaultCommentKeys,
  Env,
};
