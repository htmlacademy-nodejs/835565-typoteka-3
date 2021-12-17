'use strict';

const request = require(`supertest`);

const defineModels = require(`../../models`);
const search = require(`../search`);
const SearchService = require(`../../data-service/search-service`);
const sequelize = require(`../../lib/sequelize`);
const {mockArticles} = require(`./test-mocks`);
const {createApp, findArticlesByTitle} = require(`./test-setup`);
const {HttpCode} = require(`../../../const`);
const {getRandomNum} = require(`../../../utils/utils-common`);

const createAPI = async () => {
  const app = createApp();
  defineModels(sequelize);
  search(app, new SearchService(sequelize));
  return app;
};

/* eslint-disable max-nested-callbacks */
describe(`Search API.`, () => {

  describe(`Positive search result.`, () => {
    let response;
    let app;
    const queryString =
      mockArticles[getRandomNum(0, mockArticles.length - 1)].title;
    const matchingArticles = findArticlesByTitle(mockArticles, queryString);

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .get(`/search`)
        .query({
          query: queryString,
        });
    });

    test(`Received status OK`, () =>
      expect(response.statusCode).toBe(HttpCode.OK));

    test(`Found ${matchingArticles.length} result(s)`, () => expect(response.body.length).toEqual(matchingArticles.length));

    test(`Received article's title corresponds query`, () => {
      expect(
          response.body.forEach((item, i) =>
            expect(item.title).toEqual(matchingArticles[i].title)
          )
      );
    });
  });

  describe(`Negative search result.`, () => {
    let app;

    beforeAll(async () => {
      app = await createAPI();
    });

    test(`Returns 404 if nothing is found`, () =>
      request(app)
        .get(`/search`)
        .query({
          query: `Абракадабра`,
        })
        .expect(HttpCode.NOT_FOUND));

    test(`Returns 400 if query string is absent`, () =>
      request(app).get(`/search`).expect(HttpCode.BAD_REQUEST));
  });
});
