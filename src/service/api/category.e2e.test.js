'use strict';

const express = require(`express`);
const request = require(`supertest`);

const category = require(`./category`);
const CategoryService = require(`../data-service/category-service`);
const {mockData} = require(`./category.e2e.test-mocks`);
const {getCategories} = require(`../../utils`);
const {HttpCode} = require(`../../const`);

const app = express();
app.use(express.json());
category(app, new CategoryService(mockData));

describe(`Category API.`, () => {
  let response;
  const mockCategories = getCategories(mockData);

  beforeAll(async () => {
    response = await request(app)
      .get(`/categories`);
  });

  test(`Received status OK`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Received number of items should match number of mock categories`,
      () => expect(response.body.length).toBe(mockCategories.length)
  );
  test(`Received list should match mock categories list`, () => expect(response.body).toEqual(mockCategories));
});
