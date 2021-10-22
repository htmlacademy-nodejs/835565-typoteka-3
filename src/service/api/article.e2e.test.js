'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
/* eslint-disable-next-line no-unused-vars */
const jestDate = require(`jest-date`);

const article = require(`./article`);
const ArticleService = require(`../data-service/article-service`);
const CommentService = require(`../data-service/comment-service`);
const {getRandomNum} = require(`../../utils/utils-common`);
const {HttpCode, HOT_ARTICLES_LIMIT, COMMENTS_COUNT_KEY_NAME, ARTICLES_PER_PAGE} = require(`../../const`);
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
  title: `Новая валидная статья с заголовком не менее 30 символов `,
  createdAt: `2021-08-21T21:19:10+03:00`,
  announce: `Анонс новой статьи должен содержать не менее 30 символов.`,
  fullText: `Это содержание новой статьи.`,
  categories: [1, 2, 4],
  picture: `1.jpg`
};

const invalidArticle = {
  title: `Это невалидная статья`,
  announce: `Отсутсвуют некоторые поля`,
};

/* eslint-disable max-nested-callbacks */
describe(`Articles API.`, () => {

  /**
   * Testing API request for most commented articles
   */
  describe(`API returns a list of most commented (hot) articles:`, () => {
    let response;
    let app;
    let receivedData;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .get(`/articles`)
        .query({limit: HOT_ARTICLES_LIMIT});
      receivedData = response.body.hot;
    });

    test(`Received status 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

    test(`Received items should have 'commentsCount' key`, () => {
      expect(
          receivedData.forEach(
              (item) => expect(item).toHaveProperty(COMMENTS_COUNT_KEY_NAME)
          )
      );
    });

    test(`'commentsCount' key should have non-zero value`, () => {
      expect(
          receivedData.forEach(
              (item) => expect(item[COMMENTS_COUNT_KEY_NAME]).toBeTruthy()
          )
      );
    });

    test(`Received items should be ordered by number of comments descending`, () => {
      expect(receivedData[0][COMMENTS_COUNT_KEY_NAME])
        .toBeGreaterThanOrEqual(receivedData[receivedData.length - 1][COMMENTS_COUNT_KEY_NAME]);
    });
  });

  /**
   * Testing API request for most recent articles
   */
  describe(`API returns a list of most recent articles:`, () => {
    let response;
    let app;
    let receivedData;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .get(`/articles`)
        .query({limit: ARTICLES_PER_PAGE, offset: 0});
      receivedData = response.body.recent;
    });

    test(`Received status 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

    test(`Received items should have 'commentsCount' key`, () => {
      expect(
          receivedData.articles.forEach(
              (item) => expect(item).toHaveProperty(COMMENTS_COUNT_KEY_NAME)
          )
      );
    });

    test(`Received items should be ordered by date descending`, () => {
      expect(
          receivedData.articles.forEach((_item, i, arr) => (
            (i < arr.length - 1) &&
            expect(new Date(arr[i].createdAt)).toBeAfter(new Date(arr[i + 1].createdAt)))
          )
      );
    });
  });

  /**
   * Testing API request for a single article
   */
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


  /**
   * Testing API request for adding new article
   */
  describe(`API creates new article if data is valid:`, () => {
    let app;
    let response;

    const validArticle = {
      title: `Новая валидная статья с заголовком не менее 30 символов `,
      createdAt: `2021-08-21T21:19:10+03:00`,
      announce: `Анонс новой статьи должен содержать не менее 30 символов.`,
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

      expect(response.body.total.length).toBe(mockData.length + 1);
    });
  });

  describe(`API does not create article if data is invalid:`, () => {
    let app;

    beforeAll(async () => {
      app = await createAPI();
    });

    test(`Posting new article with missing fields should receive status 400`, async () => {
      await request(app)
      .post(`/articles`)
      .send(invalidArticle)
      .expect(HttpCode.BAD_REQUEST);
    });

    test(`Posting new article with invalid field types should receive status 400`, async () => {
      const badArticles = [
        {...newArticle, title: true},
        {...newArticle, announce: `короткий анонс`},
        {...newArticle, categories: `строка вместо массива`}
      ];

      for (const badArticle of badArticles) {
        await request(app)
          .post(`/articles`)
          .send(badArticle)
          .expect(HttpCode.BAD_REQUEST);
      }
    });
  });


  /**
   * Testing API request for editing an article
   */
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

  describe(`API does not change article if data is invalid or unexisting route requested`, () => {
    let app;

    beforeAll(async () => {
      app = await createAPI();
    });

    test(`Trying to change unexisting article should receive status 404`, async () => {
      await request(app)
        .put(`/articles/20`)
        .send(newArticle)
        .expect(HttpCode.NOT_FOUND);
    });

    test(`Trying to update article with invalid data should receive status 400`, async () => {
      await request(app)
        .put(`/articles/1`)
        .send(invalidArticle)
        .expect(HttpCode.BAD_REQUEST);
    });

  });
});
