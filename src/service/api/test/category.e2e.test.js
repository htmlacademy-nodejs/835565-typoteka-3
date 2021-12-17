'use strict';

const request = require(`supertest`);

const category = require(`../category`);
const CategoryService = require(`../../data-service/category-service`);
const defineModels = require(`../../models`);
const sequelize = require(`../../lib/sequelize`);
const {HttpCode} = require(`../../../const`);
const {mockCategories} = require(`./test-mocks`);
const {createApp} = require(`./test-setup`);

const createAPI = async () => {
  const app = createApp();
  defineModels(sequelize);
  category(app, new CategoryService(sequelize));
  return app;
};

describe(`Category API.`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .get(`/categories`)
      .query({needCount: false});
  });

  test(`Received status OK`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Received number of items should match number of mock categories`,
      () => expect(response.body.length).toBe(mockCategories.length)
  );

  test(`Received list should match mock categories list`,
      () => expect(response.body.map((item) => item.name)).toEqual(
          expect.arrayContaining(mockCategories.map((item) => item.name))
      )
  );

  test(`Received items should not have 'count' key`, () => {
    expect(response.body.forEach((item) => expect(item).not.toHaveProperty(`count`)));
  });

  test(`Received items should have 'count' key if "needCount: true" passed to query`, async () => {
    response = await request(app)
      .get(`/categories`)
      .query({needCount: true});

    expect(response.body.forEach((item) => expect(item).toHaveProperty(`count`)));
  });
});
