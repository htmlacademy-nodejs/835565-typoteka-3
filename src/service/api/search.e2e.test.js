'use strict';

const express = require(`express`);
const request = require(`supertest`);

const search = require(`./search`);
const SearchService = require(`../data-service/search-service`);
const {HttpCode} = require(`../../const`);
const {mockData} = require(`./search.e2e.test-mocks`);

const app = express();
app.use(express.json());
search(app, new SearchService(mockData));

describe(`Search API.`, () => {

  describe(`Positive search result.`, () => {
    let response;
    const receivedMockArticle = mockData[0];

    beforeAll(async () => {
      response = await request(app)
        .get(`/search`)
        .query({
          query: `Поверь в себя`
        });
    });

    test(`Received status OK`, () => expect(response.statusCode).toBe(HttpCode.OK));
    test(`Found 1 mock article`, () => expect(response.body.length).toEqual(1));
    test(`Received article's title corresponds query`, () => expect(response.body[0].title).toEqual(receivedMockArticle.title));
  });

  describe(`Negative search result.`, () => {

    test(`Returns 404 if nothing is found`, () =>
      request(app)
      .get(`/search`)
      .query({
        query: `Абракадабра`
      })
      .expect(HttpCode.NOT_FOUND)
    );

    test(`Returns 400 if query string is absent`, () =>
      request(app)
        .get(`/search`)
        .expect(HttpCode.BAD_REQUEST)
    );
  });

});

