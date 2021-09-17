'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const comment = require(`./comment`);
const CommentService = require(`../data-service/comment-service`);
const {HttpCode} = require(`../../const`);
const {mockData, mockCategories} = require(`./comment.e2e.test-mocks`);
const initDB = require(`../lib/init-db`);

const app = express();
app.use(express.json());
const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

beforeAll(async () => {
  await initDB(mockDB, {categories: mockCategories, articles: mockData});
  comment(app, new CommentService(mockDB));
});

const getCommentsFromArticles = (articles) => {
  const comments = articles.reduce((acc, currentArticle) => {
    currentArticle.comments.forEach((item) => acc.push(item.text));
    return acc;
  }, []);
  return comments;
};

describe(`Comment API.`, () => {
  let response;
  const mockComments = getCommentsFromArticles(mockData);

  beforeAll(async () => {
    response = await request(app)
      .get(`/comments`);
  });

  test(`Received status OK`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Received number of items should match number of mock comments`,
      () => expect(response.body.length).toBe(mockComments.length)
  );

  test(`Received list should match mock comments list`,
      () => expect(response.body.map((item) => item.text)).toEqual(
          expect.arrayContaining(mockComments)
      )
  );
});
