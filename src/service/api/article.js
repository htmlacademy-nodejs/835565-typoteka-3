'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);
const articleValidator = require(`../middlewares/article-validator`);
const articleExists = require(`../middlewares/article-exists`);
const commentValidator = require(`../middlewares/comment-validator`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);
const commentExists = require(`../middlewares/comment-exists`);

const articlesRouter = new Router();

module.exports = (app, articlesService, commentService) => {
  app.use(`/articles`, articlesRouter);
  const requestValidationMiddlewareSet = [routeParamsValidator, articleExists(articlesService)];

  /**
   * Main route to get articles
   * according to query option
   */
  articlesRouter.get(`/`, async (req, res) => {
    const {limit, offset} = req.query;
    let articles = {};

    if (offset) {
      articles.recent = await articlesService.findPage({limit, offset});
      return res.status(HttpCode.OK).json(articles);
    }

    if (limit) {
      articles.hot = await articlesService.findLimit({limit});
      return res.status(HttpCode.OK).json(articles);
    }

    articles.total = await articlesService.findAll();

    return res.status(HttpCode.OK).json(articles);
  });


  /**
   * Current single ARTICLE routes
   * to handle CRUD operations
   */
  articlesRouter.get(`/:articleId`, routeParamsValidator, async (req, res) => {
    const {articleId} = req.params;
    const {viewMode} = req.query;

    const article = await articlesService.findOne({articleId, viewMode});

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Unable to find article with id:${articleId}`);
    }

    return res.status(HttpCode.OK)
      .json(article);
  });

  articlesRouter.post(`/`, articleValidator, async (req, res) => {
    const newArticle = await articlesService.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(newArticle);
  });

  articlesRouter.put(`/:articleId`, [articleValidator, ...requestValidationMiddlewareSet], async (req, res) => {
    const {articleId} = req.params;

    await articlesService.update({id: articleId, update: req.body});

    return res.status(HttpCode.OK)
      .send(`Updated`);
  });

  articlesRouter.delete(`/:articleId`, [...requestValidationMiddlewareSet], async (req, res) => {
    const {articleId} = req.params;

    const article = await articlesService.findOne({articleId});

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
      .send(`Unable to delete unexisting article!`);
    }

    await articlesService.drop(articleId);

    return res.status(HttpCode.OK)
      .send(`Deleted`);
  });


  /**
   * Current article's COMMENTS routes
   * to handle CRUD operations
   */
  articlesRouter.post(`/:articleId/comments`, [commentValidator, ...requestValidationMiddlewareSet], async (req, res) => {
    const {articleId} = req.params;

    const newComment = await commentService.create(articleId, req.body);

    return res.status(HttpCode.CREATED)
      .json(newComment);
  });

  articlesRouter.delete(`/:articleId/comments/:commentId`, [commentExists(commentService), ...requestValidationMiddlewareSet], async (req, res) => {
    const {commentId} = req.params;

    await commentService.drop(commentId);

    return res.status(HttpCode.OK)
      .send(`Deleted`);
  });
};
