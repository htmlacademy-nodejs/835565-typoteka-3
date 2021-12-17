'use strict';

const request = require(`supertest`);
/* eslint-disable-next-line no-unused-vars */
const jestDate = require(`jest-date`);

const comment = require(`../comment`);
const CommentService = require(`../../data-service/comment-service`);
const sequelize = require(`../../lib/sequelize`);
const defineModels = require(`../../models`);
const {mockArticles, mockComments} = require(`./test-mocks`);
const {createApp} = require(`./createTestApp`);
const {HttpCode, LAST_COMMENTS_MAX_NUM} = require(`../../../const`);

const createAPI = async () => {
  const app = createApp();
  defineModels(sequelize);
  comment(app, new CommentService(sequelize));
  return app;
};

/* eslint-disable max-nested-callbacks */
describe(`Comment API.`, () => {
  /**
   * Testing API request for all comments in DB
   */
  describe(`API returns a list of all comments:`, () => {
    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app).get(`/comments`);
    });

    test(`Received status OK`, () =>
      expect(response.statusCode).toBe(HttpCode.OK));

    test(`Received number of items should match number of mock comments`, () =>
      expect(response.body.length).toBe(mockComments.length));

    test(`Received items should have 'userId' key`, () => {
      expect(
          response.body.forEach((item) => expect(item).toHaveProperty(`userId`))
      );
    });

    test(`Received items should have 'articleId' key`, () => {
      expect(
          response.body.forEach(
              (item) => expect(item).toHaveProperty(`articleId`)
          )
      );
    });

    test(`Received items should contain 'article' object with the title of corresponding article`, () => {
      // console.log(response.body);
      expect(
          response.body.forEach((item) =>
            expect(item).toHaveProperty(`article`, {
              title: mockArticles[item.articleId - 1].title,
            })
          )
      );
    });
  });

  describe(`API returns a list of last comments or main page:`, () => {
    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .get(`/comments`)
        .query({limit: LAST_COMMENTS_MAX_NUM});
    });

    test(`Received status OK`, () =>
      expect(response.statusCode).toBe(HttpCode.OK));

    test(`Received number of items should match limit`, () =>
      expect(response.body.length).toBe(LAST_COMMENTS_MAX_NUM));

    test(`Received items should be ordered by date descending`, () => {
      expect(
          response.body.forEach((_item, i, arr) => (
            (i < arr.length - 1) &&
            expect(new Date(arr[i].createdAt)).toBeAfter(new Date(arr[i + 1].createdAt)))
          )
      );
    });
  });
});
