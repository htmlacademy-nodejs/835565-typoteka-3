'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const category = require(`./category`);
const CategoryService = require(`../data-service/category-service`);
const {mockData, mockCategories} = require(`./category.e2e.test-mocks`);
const {HttpCode} = require(`../../const`);
const initDB = require(`../lib/init-db`);

const app = express();
app.use(express.json());
const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

beforeAll(async () => {
  await initDB(mockDB, {categories: mockCategories, articles: mockData});
  category(app, new CategoryService(mockDB));
});

describe(`Category API.`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/categories`);
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
});
