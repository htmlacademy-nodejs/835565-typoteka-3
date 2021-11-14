'use strict';

const request = require(`supertest`);

const category = require(`../category`);
const CategoryService = require(`../../data-service/category-service`);
const {mockArticles, mockCategories, mockUsers} = require(`./test-mocks`);
const {HttpCode} = require(`../../../const`);
const initDB = require(`../../lib/init-db`);
const {mockApp, mockDB} = require(`./test-setup`);


beforeAll(async () => {
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles, users: mockUsers});
  category(mockApp, new CategoryService(mockDB));
});

describe(`Category API.`, () => {
  let response;

  beforeAll(async () => {
    response = await request(mockApp)
      .get(`/categories`)
      .query({needCount: false});
  });

  test(`Received status OK`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Received number of items should match number of mock categories`,
      () => expect(response.body.length).toBe(mockCategories.length)
  );
  test(`Received list should match mock categories list`,
      () => expect(response.body.map((item) => item.name)).toEqual(
          expect.arrayContaining(mockCategories)
      )
  );

  test(`Received items should not have 'count' key`, () => {
    expect(response.body.forEach((item) => expect(item).not.toHaveProperty(`count`)));
  });

  test(`Received items should have 'count' key if "needCount: true" passed to query`, async () => {
    response = await request(mockApp)
      .get(`/categories`)
      .query({needCount: true});

    expect(response.body.forEach((item) => expect(item).toHaveProperty(`count`)));
  });
});
