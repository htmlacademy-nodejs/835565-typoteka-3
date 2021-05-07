'use strict';

const DEFAULT_COUNT = 1;
const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const FILE_NAME = `mocks.json`;
const ARTICLE_TITLES_PATH = `../data/titles.txt`;
const ARTICLE_DESCRIPTIONS_PATH = `../data/descriptions.txt`;
const ARTICLE_CATEGORIES_PATH = `../data/categories.txt`;
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

module.exports = {
  DEFAULT_COUNT,
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  FILE_NAME,
  ARTICLE_TITLES_PATH,
  ARTICLE_DESCRIPTIONS_PATH,
  ARTICLE_CATEGORIES_PATH,
  ExitCode,
  SentencesNum,
  CategoriesNum,
  DaysGap,
};
