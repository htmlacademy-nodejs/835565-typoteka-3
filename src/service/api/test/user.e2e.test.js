'use strict';

const request = require(`supertest`);

const user = require(`../user`);
const UserService = require(`../../data-service/user-service`);
const sequelize = require(`../../lib/sequelize`);
const defineModels = require(`../../models`);
const {createApp} = require(`./createTestApp`);

const {HttpCode} = require(`../../../const`);
const {mockUsers} = require(`./test-mocks`);

const createAPI = async () => {
  const app = createApp();
  defineModels(sequelize);
  user(app, new UserService(sequelize));
  return app;
};

const validUserData = {
  email: `aaaaaaa@example.com`,
  firstName: `Имя`,
  lastName: `Фамилия`,
  password: `123456`,
  passwordRepeated: `123456`,
  isAdmin: false,
  // avatar in not required
};


const validAuthData = {
  email: `ivanov@example.com`,
  password: `ivanov`
};


/* eslint-disable max-nested-callbacks */
describe(`Users API.`, () => {
  /**
   * Testing API request for adding new user
   */
  describe(`API creates user if data is valid:`, () => {
    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .post(`/user`)
        .send(validUserData);
    });

    test(`Received status 201`, () =>
      expect(response.statusCode).toBe(HttpCode.CREATED));
  });

  describe(`API refuses to create user if data is invalid:`, () => {
    let app;

    beforeAll(async () => {
      app = await createAPI();
    });

    test(`Received status 400 when any required field is missing`, async () => {
      for (const key of Object.keys(validUserData)) {
        const invalidUserData = {...validUserData};
        delete invalidUserData[key];
        await request(app)
          .post(`/user`)
          .send(invalidUserData)
          .expect(HttpCode.BAD_REQUEST);
      }
    });

    test(`Received status 400 when field type is wrong`, async () => {
      const invalidUsers = [
        {...validUserData, firstName: true},
        {...validUserData, lastName: undefined},
        {...validUserData, password: NaN},
        {...validUserData, email: 1}
      ];

      for (const invalidUser of invalidUsers) {
        await request(app)
          .post(`/user`)
          .send(invalidUser)
          .expect(HttpCode.BAD_REQUEST);
      }
    });

    test(`Received status 400 when field value is wrong`, async () => {
      const invalidUsers = [
        {...validUserData, password: `1`}, // password is too short
        {...validUserData, email: `invalid.com`} // email has invalid format
      ];

      for (const invalidUser of invalidUsers) {
        await request(app)
          .post(`/user`)
          .send(invalidUser)
          .expect(HttpCode.BAD_REQUEST);
      }
    });

    test(`Received status 400 when password and passwordRepeated are not equal`, async () => {
      const invalidUser = {...validUserData, passwordRepeated: `654321`};
      await request(app)
        .post(`/user`)
        .send(invalidUser)
        .expect(HttpCode.BAD_REQUEST);
    });

    test(`When email is already in use status code is 400`, async () => {
      const invalidUser = {...validUserData, email: mockUsers[0].email};
      await request(app)
        .post(`/user`)
        .send(invalidUser)
        .expect(HttpCode.BAD_REQUEST);
    });
  });

  describe(`API authenticate user if data is valid:`, () => {
    let response;
    const admin = mockUsers.find((mockUser) => mockUser.isAdmin);

    beforeAll(async () => {
      const app = await createAPI();
      response = await request(app)
        .post(`/user/auth`)
        .send(validAuthData);
    });

    test(`Received status 200`, () =>
      expect(response.statusCode).toBe(HttpCode.OK));

    test(`User name is correct`, () => {
      const {firstName, lastName} = response.body;
      expect(firstName).toBe(admin.firstName);
      expect(lastName).toBe(admin.lastName);
    });
  });

  describe(`API refuses to authenticate user if data is invalid:`, () => {
    let app;

    beforeAll(async () => {
      app = await createAPI();
    });

    test(`Received status 401 if email is incorrect`, async () => {
      const invalidAuthData = {
        email: `not-exist@example.com`,
        password: `nonexistent`
      };

      await request(app)
        .post(`/user/auth`)
        .send(invalidAuthData)
        .expect(HttpCode.UNAUTHORIZED);
    });

    test(`Received status 401 if password doesn't match`, async () => {
      const invalidAuthData = {
        email: mockUsers[1].email,
        password: `nonexistent`
      };
      await request(app)
        .post(`/user/auth`)
        .send(invalidAuthData)
        .expect(HttpCode.UNAUTHORIZED);
    });
  });
});
