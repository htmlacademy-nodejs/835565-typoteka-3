'use strict';

const DEFAULT_COUNT = 1;
const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const FILE_NAME = `mocks.json`;
const DEFAULT_PORT = 3000;
const FILE_PATH = `./src/service/mocks.json`;
const NOT_FOUND_MESSAGE = `NOT FOUND`;
const ARTICLE_TITLES_PATH = `../data/titles.txt`;
const ARTICLE_DESCRIPTIONS_PATH = `../data/descriptions.txt`;
const ARTICLE_CATEGORIES_PATH = `../data/categories.txt`;
const COMMENTS_PATH = `../data/comments.txt`;
const MAX_ID_LENGTH = 10;
const API_PREFIX = `/api`;

const defaultArticleKeys = [`title`, `createdDate`, `announce`, `fullText`, `сategories`];
const defaultCommentKeys = [`text`];

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
};
