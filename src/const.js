'use strict';

const DEFAULT_COUNT = 1;
const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const FILE_NAME = `mocks.json`;
const DEFAULT_PORT = 3000;
const FILE_PATH = `./mocks.json`;
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

const defaultArticleKeys = [`title`, `createdDate`, `announce`, `fullText`, `сategories`];
const defaultCommentKeys = [`text`, `date`];

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
  MAX: 5,
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
  MIN: 1,
  MAX: 4,
};

const CommentsSentencesNum = {
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
  ExitCode,
  SentencesNum,
  CategoriesNum,
  DaysGap,
  DEFAULT_PORT,
  FILE_PATH,
  NOT_FOUND_MESSAGE,
  url,
  HttpCode,
  CommentsNum,
  CommentsSentencesNum,
  defaultArticleKeys,
  defaultCommentKeys,
  Env,
};
