'use strict';

const request = require(`supertest`);
/* eslint-disable-next-line no-unused-vars */
const jestDate = require(`jest-date`);

const comment = require(`../comment`);
const CommentService = require(`../../data-service/comment-service`);
const {HttpCode, LAST_COMMENTS_MAX_NUM} = require(`../../../const`);
const {mockArticles, mockCategories, mockUsers} = require(`./test-mocks`);
const initDB = require(`../../lib/init-db`);
const {mockApp, mockDB} = require(`./test-setup`);

const createAPI = async () => {
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles, users: mockUsers});

  comment(mockApp, new CommentService(mockDB));

  return mockApp;
};


const getCommentsFromArticles = (articles) => {
  const comments = articles.reduce((acc, currentArticle) => {
    currentArticle.comments.forEach((item) => acc.push(item.text));
    return acc;
  }, []);
  return comments;
};

const mockComments = getCommentsFromArticles(mockArticles);


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

    test(`Received items should have 'userId' key`, () => {
      expect(
          response.body.forEach(
              (item) => expect(item).toHaveProperty(`userId`)
          )
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
      expect(
          response.body.forEach(
              (item) => expect(item).toHaveProperty(`article`, {title: mockArticles[item.articleId - 1].title})
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

    test(`Received status OK`, () => expect(response.statusCode).toBe(HttpCode.OK));

    test(`Received number of items should match limit`,
        () => expect(response.body.length).toBe(LAST_COMMENTS_MAX_NUM)
    );

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
