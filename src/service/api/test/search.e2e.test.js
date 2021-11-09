'use strict';

const request = require(`supertest`);

const search = require(`../search`);
const SearchService = require(`../../data-service/search-service`);
const {HttpCode} = require(`../../../const`);
const {mockArticles, mockCategories, mockUsers} = require(`./test-mocks`);
const initDB = require(`../../lib/init-db`);
const {mockApp, mockDB} = require(`./test-setup`);

beforeAll(async () => {
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles, users: mockUsers});
  search(mockApp, new SearchService(mockDB));
});

describe(`Search API.`, () => {

  describe(`Positive search result.`, () => {
    let response;
    const receivedMockArticle = mockArticles[0];

    beforeAll(async () => {
      response = await request(mockApp)
        .get(`/search`)
        .query({
          query: `Рок`
        });
    });

    test(`Received status OK`, () => expect(response.statusCode).toBe(HttpCode.OK));
    test(`Found 1 mock article`, () => expect(response.body.length).toEqual(1));
    test(`Received article's title corresponds query`, () => expect(response.body[0].title).toEqual(receivedMockArticle.title));
  });

  describe(`Negative search result.`, () => {

    test(`Returns 404 if nothing is found`, () =>
      request(mockApp)
      .get(`/search`)
      .query({
        query: `Абракадабра`
      })
      .expect(HttpCode.NOT_FOUND)
    );

    test(`Returns 400 if query string is absent`, () =>
      request(mockApp)
        .get(`/search`)
        .expect(HttpCode.BAD_REQUEST)
    );
  });
});

