'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);
const articleValidator = require(`../middlewares/article-validator`);
const articleExists = require(`../middlewares/article-exists`);
const commentValidator = require(`../middlewares/comment-validator`);

const articlesRouter = new Router();

module.exports = (app, articlesService, commentService) => {
  app.use(`/articles`, articlesRouter);

  articlesRouter.get(`/`, (req, res) => {
    const articles = articlesService.findAll();
    if (!articles) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Articles not found!`);
    }
    return res.status(HttpCode.OK)
      .json(articles);
  });

  articlesRouter.get(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const article = articlesService.findOne(articleId);
    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Unable to find article with id:${articleId}`);
    }
    return res.status(HttpCode.OK)
      .json(article);
  });

  articlesRouter.get(`/:articleId/comments`, articleExists(articlesService), (req, res) => {
    const {article} = res.locals;
    commentService.getComments(article);
    const comments = commentService.findAll();
    return res.status(HttpCode.OK)
      .json(comments);
  });

  articlesRouter.post(`/`, articleValidator, (req, res) => {
    const newArticle = articlesService.create(req.body);
    return res.status(HttpCode.CREATED)
      .json(newArticle);
  });

  articlesRouter.post(
      `/:articleId/comments`,
      [articleExists(articlesService), commentValidator],
      (req, res) => {
        const {article} = res.locals;
        commentService.getComments(article);
        const newComment = commentService.create(req.body);
        return res.status(HttpCode.CREATED)
          .json(newComment);
      });

  articlesRouter.put(`/:articleId`, articleValidator, (req, res) => {
    const {articleId} = req.params;
    const updatedArticle = articlesService.update(articleId, req.body);
    if (!updatedArticle) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Unable to find article with id:${articleId}`);
    }
    res.status(HttpCode.OK)
      .send(`Article updated successfully`);
  });

  articlesRouter.delete(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const deletedArticle = articlesService.delete(articleId);
    if (!deletedArticle) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Unable to delete unexisting article!`);
    }
    res.status(HttpCode.OK)
      .json(deletedArticle);
  });

  articlesRouter.delete(`/:articleId/comments/:commentId`, articleExists(articlesService), (req, res) => {
    const {article} = res.locals;
    commentService.getComments(article);
    const {commentId} = req.params;
    const deletedComment = commentService.delete(commentId);
    if (!deletedComment) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Cannot delete unexisting comment`);
    }
    res.status(HttpCode.OK)
      .json(deletedComment);
  });
};
