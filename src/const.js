'use strict';

// Cli
const DEFAULT_COUNT = 1;
const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const DEFAULT_PORT_SERVER = 3000;
const API_PREFIX = `/api`;

const ExitCode = {
  SUCCESS: 0,
  ERROR: 1,
};

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

const HttpMethod = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

// DB
const ANNOUNCE_CHAR_LENGTH = 1000;
const FILE_TYPES = [`image/png`, `image/jpg`, `image/jpeg`];
const ORDER_BY_LATEST_DATE = [`createdAt`, `DESC`];
const HOT_ARTICLES_LIMIT = 4;
const ARTICLES_PER_PAGE = 8;
const COMMENTS_COUNT_KEY_NAME = `commentsCount`;
const SALT_ROUNDS = 10;
const USER_NAME_REGEXP = /[^0-9$&+,:;=?@#|'<>.^*()%!]+$/;

const Aliase = {
  ARTICLE: `article`,
  ARTICLES: `articles`,
  COMMENT: `comment`,
  COMMENTS: `comments`,
  CATEGORY: `category`,
  CATEGORIES: `categories`,
  ARTICLES_CATEGORIES: `articlesCategories`,
  USERS: `users`,
  USER: `user`
};

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
const UPLOAD_DIR_PATH = `../public/upload/img/`;
const TEMPLATES_DIR_NAME = `templates`;
const UPLOADED_FILE_INPUT_NAME = `upload`;
const PUBLIC_DIR_NAME = `public`;
const UPLOADED_IMG_OUTPUT_FROMAT = `jpeg`;

// Front
const DEFAULT_PORT_FRONT = 8080;
const MAX_ID_LENGTH = 10;
const LAST_COMMENTS_MAX_NUM = 4;
const MAX_UPLOAD_FILE_SIZE = 1 * 1024 * 1024; // 1 Mb
const PAGINATION_WIDTH = 2;
const EXPIRY_PERIOD = 10 * 60 * 1000; // 10 minustes
const ARTICLE_PICTURE_JPEG_QUALITY = 90;

const TextVisibleLimit = {
  COMMENT: 100,
  ANNOUNCE: 100,
};

const HumanizedDateFormat = {
  SHORT: `YYYY-MM-DD`,
  FULL: `DD.MM.YYYY, HH:mm`,
};

const HttpCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

const ArticlePictureSize = {
  PREVIEW: {
    WIDTH: 460,
    HEIGHT: 240
  },
  FULL_SIZE: {
    WIDTH: 940,
    HEIGHT: 490
  }
};

const AvatarImgSize = {
  FULL_SIZE: {
    WIDTH: 50,
    HEIGHT: 50
  },
  SMALL: {
    WIDTH: 20,
    HEIGHT: 20
  }
};

// Mocks
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
const HoursGap = {
  MIN: 1,
  MAX: 12,
};
const CommentsNum = {
  MIN: 2,
  MAX: 4,
};
const CommentsSentencesNum = {
  MIN: 1,
  MAX: 2,
};

module.exports = {
  // Cli
  DEFAULT_COUNT,
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  DEFAULT_PORT_SERVER,
  API_PREFIX,
  ExitCode,
  Env,
  HttpMethod,

  // DB
  ANNOUNCE_CHAR_LENGTH,
  FILE_TYPES,
  ORDER_BY_LATEST_DATE,
  HOT_ARTICLES_LIMIT,
  ARTICLES_PER_PAGE,
  COMMENTS_COUNT_KEY_NAME,
  SALT_ROUNDS,
  USER_NAME_REGEXP,
  Aliase,

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
  UPLOADED_FILE_INPUT_NAME,
  DB_FILL_FILE_PATH,
  DB_QUERIES_FILE_PATH,
  LOG_FILE_PATH,
  UPLOADED_IMG_OUTPUT_FROMAT,

  // Front
  DEFAULT_PORT_FRONT,
  MAX_ID_LENGTH,
  LAST_COMMENTS_MAX_NUM,
  MAX_UPLOAD_FILE_SIZE,
  PAGINATION_WIDTH,
  EXPIRY_PERIOD,
  ARTICLE_PICTURE_JPEG_QUALITY,
  TextVisibleLimit,
  HumanizedDateFormat,
  HttpCode,
  ArticlePictureSize,
  AvatarImgSize,

  // Mocks
  SentencesNum,
  CategoriesNum,
  DaysGap,
  HoursGap,
  CommentsNum,
  CommentsSentencesNum,
};
