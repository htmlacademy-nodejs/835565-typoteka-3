'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const article = require(`./article`);
const ArticleService = require(`../data-service/article-service`);
const CommentService = require(`../data-service/comment-service`);
const {getRandomNum} = require(`../../utils/utils-common`);
const {HttpCode} = require(`../../const`);
const {mockData, mockCategories} = require(`./article.e2e.test-mocks`);
const initDB = require(`../lib/init-db`);

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, articles: mockData});

  const app = express();
  app.use(express.json());
  article(app, new ArticleService(mockDB), new CommentService(mockDB));
  return app;
};

const newArticle = {
  title: `Новая статья`,
  createdAt: `2021-08-21T21:19:10+03:00`,
  announce: `Анонс новой статьи.`,
  fullText: `Это содержание новой статьи.`,
  categories: [1, 2, 4],
  picture: `1.jpg`
};

describe(`Articles API.`, () => {

  describe(`API returns a list of all articles:`, () => {
    let response;

    beforeAll(async () => {
      const app = await createAPI();
      response = await request(app)
        .get(`/articles`);
    });

    test(`Received status 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

    test(`Received number of items should match number of mock articles`, () =>
      expect(response.body.length).toBe(mockData.length)
    );

    test(`Received items should match mock articles by title`, () => {
      const randomArticleIndex = getRandomNum(0, mockData.length - 1);
      expect(response.body[randomArticleIndex].title).toBe(mockData[randomArticleIndex].title);
    });
  });

  describe(`API returns an article with given id:`, () => {
    let app;
    let response;
    const requestedMockArticleId = getRandomNum(1, mockData.length);
    const requestedMockArticle = mockData[requestedMockArticleId - 1];

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .get(`/articles/${requestedMockArticleId}`);
    });

    test(`Received status 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

    test(`Received item should match corresponding mock article by title`, () =>
      expect(response.body.title).toBe(requestedMockArticle.title)
    );

    test(`Received status 404 if unexisting article is requested`, async () => {
      app = await createAPI();
      response = await request(app)
        .get(`/acticles/unext`);
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });

  describe(`API creates new article if data is valid:`, () => {
    let app;
    let response;

    const validArticle = {
      title: `Новая валидная статья`,
      createdAt: `2021-08-21T21:19:10+03:00`,
      announce: `Анонс новой статьи.`,
      fullText: `Это содержание новой статьи.`,
      categories: [1, 2, 4],
      picture: `1.jpg`
    };

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .post(`/articles`)
        .send(validArticle);
    });

    test(`Received status 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

    test(`Articles count should increace after adding new article`, async () => {
      response = await request(app)
        .get(`/articles`);
      expect(response.body.length).toBe(mockData.length + 1);
    });
  });

  describe(`API does not create article if data is invalid:`, () => {
    let app;

    beforeAll(async () => {
      app = await createAPI();
    });

    test(`Unvalidated article post should receive status 400`, async () => {
      for (const key of Object.keys(newArticle)) {
        const badArticle = {...newArticle};
        delete badArticle[key];
        await request(app)
          .post(`/articles`)
          .send(badArticle)
          .expect(HttpCode.BAD_REQUEST);
      }
    });
  });

  describe(`API changes an article.`, () => {
    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .put(`/articles/1`)
        .send(newArticle);
    });

    test(`Received status 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

    test(`Article should be updated`, async () => {
      response = await request(app)
        .get(`/articles/1`);
      expect(response.body.title).toBe(newArticle.title);
    });
  });

  test(`Trying to change unexisting article should receive status 404`, async () => {
    const app = await createAPI();

    return request(app)
      .put(`/articles/unexst`)
      .send(newArticle)
      .expect(HttpCode.NOT_FOUND);
  });

  test(`Trying to send invalid article should receive status 400`, async () => {
    const app = await createAPI();
    const invalidArticle = {
      title: `Это невалидная статья`,
      announce: `Отсутсвуют некоторые поля`,
      сategories: [1, 2],
    };
    return request(app)
      .put(`/articles/1`)
      .send(invalidArticle)
      .expect(HttpCode.BAD_REQUEST);
  });

});
