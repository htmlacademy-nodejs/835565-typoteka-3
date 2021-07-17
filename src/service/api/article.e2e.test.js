'use strict';

const express = require(`express`);
const request = require(`supertest`);

const article = require(`./article`);
const ArticleService = require(`../data-service/article-service`);
const CommentService = require(`../data-service/comment-service`);
const {getRandomNum} = require(`../../utils`);
const {HttpCode} = require(`../../const`);
const {mockData} = require(`./article.e2e.test-mocks`);

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  article(app, new ArticleService(cloneData), new CommentService());
  return app;
};

const newArticle = {
  title: `Новая статья`,
  date: ``,
  announce: `Аоывашоыашрвыа`,
  fullText: `Ырвыащгпацлрилпгк. Шываы выаиышвгп ыщврагвыщгр щывравыщр`,
  сategories: [`Самообразование`, `Программирование`, `Математика`],
};

describe(`Articles API.`, () => {

  describe(`API returns a list of all articles.`, () => {
    const app = createAPI();
    let response;

    beforeAll(async () => {
      response = await request(app)
        .get(`/articles`);
    });

    test(`Received status 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

    test(`Received number of items should match number of mock articles`, () =>
      expect(response.body.length).toBe(mockData.length)
    );

    test(`Received items should match mock articles by ID`, () => {
      const randomArticleIndex = getRandomNum(0, mockData.length - 1);
      expect(response.body[randomArticleIndex].id).toBe(mockData[randomArticleIndex].id);
    });
  });

  describe(`API returns an article with given id.`, () => {
    const app = createAPI();
    let response;
    const requestedMockArticle = mockData[(getRandomNum(0, mockData.length - 1))];

    beforeAll(async () => {
      response = await request(app)
        .get(`/articles/${requestedMockArticle.id}`);
    });

    test(`Received status 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

    test(`Received item should match corresponding mock article by title`, () =>
      expect(response.body.title).toBe(requestedMockArticle.title)
    );

    test(`Received status 404 if unexisting article is requested`, async () => {
      response = await request(app)
        .get(`/acticles/unext`);
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });

  describe(`API creates new article if data is valid.`, () => {
    const app = createAPI();
    let response;

    beforeAll(async () => {
      response = await request(app)
        .post(`/articles`)
        .send(newArticle);
    });

    test(`Received status 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

    test(`Returns created article`, () =>
      expect(response.body).toMatchObject(newArticle)
    );

    test(`Received article should contain ID`, () =>
      expect(response.body).toHaveProperty(`id`)
    );

    test(`Articles count should increace after adding new article`, async () => {
      response = await request(app)
        .get(`/articles`);
      expect(response.body.length).toBe(mockData.length + 1);
    });
  });

  describe(`API does not create article if data is invalid.`, () => {
    const app = createAPI();

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
    const app = createAPI();
    let response;
    const updatedMockArticle = mockData[getRandomNum(0, mockData.length - 1)];

    beforeAll(async () => {
      response = await request(app)
        .put(`/articles/${updatedMockArticle.id}`)
        .send(newArticle);
    });

    test(`Received status 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

    test(`Returns changed article`, () => expect(response.body).toMatchObject(newArticle));

    test(`Article should be updated`, async () => {
      response = await request(app)
        .get(`/articles/${updatedMockArticle.id}`);
      expect(response.body.title).toBe(newArticle.title);
    });

    test(`Trying to change unexisting article should receive status 404`, () => {
      return request(app)
        .put(`/articles/unexst`)
        .send(newArticle)
        .expect(HttpCode.NOT_FOUND);
    });

    test(`Trying to send invalid article should receive status 400`, () => {
      const invalidArticle = {
        title: `Это невалидная статья`,
        date: ``,
        announce: `Отсутсвует поле fullText`,
        сategories: [`Самообразование`, `Программирование`, `Математика`],
      };
      return request(app)
        .put(`/articles/${updatedMockArticle.id}`)
        .send(invalidArticle)
        .expect(HttpCode.BAD_REQUEST);
    });
  });
});
