'use strict';

const request = require(`supertest`);
/* eslint-disable-next-line no-unused-vars */
const jestDate = require(`jest-date`);

const article = require(`../article`);
const ArticleService = require(`../../data-service/article-service`);
const CommentService = require(`../../data-service/comment-service`);
const {getRandomMockArticleId, getRandomNum} = require(`../../../utils/utils-common`);
const {HttpCode, HOT_ARTICLES_LIMIT, COMMENTS_COUNT_KEY_NAME, ARTICLES_PER_PAGE} = require(`../../../const`);
const {mockArticles, mockCategories, mockUsers} = require(`./test-mocks`);
const initDB = require(`../../lib/init-db`);
const {mockApp, mockDB} = require(`./test-setup`);

const createAPI = async () => {
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles, users: mockUsers});

  article(mockApp, new ArticleService(mockDB), new CommentService(mockDB));

  return mockApp;
};

const newArticle = {
  title: `Новая валидная статья с заголовком не менее 30 символов `,
  createdAt: `2021-08-21T21:19:10+03:00`,
  announce: `Анонс новой статьи должен содержать не менее 30 символов.`,
  categories: [1, 2, 4],
  userId: 1
  // fullText: `Это содержание новой статьи.`, // full text field is not required
  // picture: `1.jpg`, // picture is not requires
};

const newComment = {
  text: `Новый валидный комментарий длиной не менее 20 символов`,
  userId: 1
};

const articleId = 1;
const unexistingArticleId = mockArticles.length + 1;


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

    test(`Received number of items should match the limit`, () => expect(receivedData.length).toBe(HOT_ARTICLES_LIMIT));

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

    test(`Received number of items should match the limit`, () =>
      expect(receivedData.articles.length).toBe(ARTICLES_PER_PAGE)
    );

    test(`Received number of items should match the mock articles number`, () =>
      expect(receivedData.count).toBe(mockArticles.length)
    );

    test(`Received items should include comments`, () => {
      expect(
          receivedData.articles.forEach(
              (item) => expect(item).toHaveProperty(`comments`)
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
    const requestedArticleId = getRandomMockArticleId(mockArticles);
    const requestedMockArticle = mockArticles[requestedArticleId - 1];

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .get(`/articles/${requestedArticleId}`);
    });

    test(`Received status 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

    test(`Received item should match corresponding mock article by title`, () =>
      expect(response.body.title).toBe(requestedMockArticle.title)
    );

    test(`Received item should have a list of comments if ViewMode parameter is active`, async () => {
      response = await request(app)
        .get(`/articles/${requestedArticleId}`)
        .query({viewMode: true});

      expect(response.body).toHaveProperty(`comments`);
    });

    test(`Received status 404 if unexisting article is requested`, async () => {
      response = await request(app)
        .get(`/articles/${unexistingArticleId}`);
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
      picture: `1.jpg`,
      userId: 1
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

      expect(response.body.total.length).toBe(unexistingArticleId);
    });
  });

  describe(`API does not create article if data is invalid:`, () => {
    let app;

    beforeAll(async () => {
      app = await createAPI();
    });

    test(`Posting new article with missing fields should receive status 400`, async () => {
      for (const key of Object.keys(newArticle)) {
        const invalidArticle = {...newArticle};
        delete invalidArticle[key];
        await request(app)
          .post(`/articles`)
          .send(invalidArticle)
          .expect(HttpCode.BAD_REQUEST);
      }
    });

    test(`Posting new article with invalid field types should receive status 400`, async () => {
      const invalidArticles = [
        {...newArticle, title: true},
        {...newArticle, announce: `короткий анонс`},
        {...newArticle, categories: `строка вместо массива`}
      ];

      for (const invalidArticle of invalidArticles) {
        await request(app)
          .post(`/articles`)
          .send(invalidArticle)
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
    const requestedArticleId = getRandomMockArticleId(mockArticles);

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .put(`/articles/${requestedArticleId}`)
        .send(newArticle);
    });

    test(`Received status 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

    test(`Article should be updated`, async () => {
      response = await request(app)
        .get(`/articles/${requestedArticleId}`);
      expect(response.body.title).toBe(newArticle.title);
    });
  });

  describe(`API does not change article if data is invalid or unexisting route requested:`, () => {
    let app;

    beforeAll(async () => {
      app = await createAPI();
    });

    test(`Trying to change unexisting article should receive status 404`, async () => {
      await request(app)
        .put(`/articles/${unexistingArticleId}`)
        .send(newArticle)
        .expect(HttpCode.NOT_FOUND);
    });

    test(`Trying to update article with invalid data should receive status 400`, async () => {
      for (const key of Object.keys(newArticle)) {
        const invalidArticle = {...newArticle};
        delete invalidArticle[key];
        await request(app)
          .put(`/articles/${articleId}`)
          .send(invalidArticle)
          .expect(HttpCode.BAD_REQUEST);
      }
    });
  });


  /**
   * Testing API request for creating a comment
   */
  describe(`API creates new comment if data is valid:`, () => {
    let app;
    let response;
    const requestedArticleId = getRandomMockArticleId(mockArticles);

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .post(`/articles/${requestedArticleId}/comments`)
        .send(newComment);
    });

    test(`Received status 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

    test(`Number of comments should increace`, async () => {
      response = await request(app)
        .get(`/articles/${requestedArticleId}`)
        .query({viewMode: true});

      expect(response.body.comments.length).toBe(mockArticles[requestedArticleId - 1].comments.length + 1);
    });

    test(`Trying to add comment to unexisting article should receive status 404`, async () => {
      response = await request(app)
        .post(`/articles/${unexistingArticleId}/comments`)
        .send(newComment)
        .expect(HttpCode.NOT_FOUND);
    });
  });


  describe(`API does not create comment if data is invalid:`, () => {
    let app;

    beforeAll(async () => {
      app = await createAPI();
    });

    test(`Posting new comment with missing fields should receive status 400`, async () => {
      for (const key of Object.keys(newComment)) {
        const invalidComment = {...newComment};
        delete invalidComment[key];
        await request(app)
          .post(`/articles/${articleId}/comments`)
          .send(invalidComment)
          .expect(HttpCode.BAD_REQUEST);
      }
    });

    test(`Posting new comment with invalid field types should receive status 400`, async () => {
      const invalidComments = [
        {...newComment, text: true},
        {...newComment, userId: `string`},
        {...newComment, userId: 0},
      ];

      for (const invalidComment of invalidComments) {
        await request(app)
          .post(`/articles/${articleId}/comments`)
          .send(invalidComment)
          .expect(HttpCode.BAD_REQUEST);
      }
    });
  });


  /**
   * Testing API request for deleting an article
   */
  describe(`API deletes an article:`, () => {
    let app;
    let response;
    const requestedArticleId = getRandomMockArticleId(mockArticles);

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .delete(`/articles/${requestedArticleId}`);
    });

    test(`Received status 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

    test(`Number of items should decrease`, async () => {
      response = await request(app)
        .get(`/articles`);

      expect(response.body.total.length).toBe(mockArticles.length - 1);
    });

    test(`Request for the deleted item should receive status 404`, async () => {
      response = await request(app)
        .get(`/articles/${requestedArticleId}`);

      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });


  /**
   * Testing API request for deleting a comment
   */
  describe(`API deletes a comment:`, () => {
    let app;
    let response;
    const requestedCommentId = getRandomNum(1, mockArticles[articleId].comments.length);

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .delete(`/articles/${articleId}/comments/${requestedCommentId}`);
    });

    test(`Received status 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

    test(`Number of comments should decrease`, async () => {
      response = await request(app)
        .get(`/articles/${articleId}`)
        .query({viewMode: true});

      expect(response.body.comments.length).toBe(mockArticles[articleId - 1].comments.length - 1);
    });

    test(`Another request to delete this comment should receive status 404`, async () => {
      response = await request(app)
        .delete(`/articles/${articleId}/comments/${requestedCommentId}`);

      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});
