'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);
const articleValidator = require(`../middlewares/article-validator`);
const articleExists = require(`../middlewares/article-exists`);
const commentValidator = require(`../middlewares/comment-validator`);

const articlesRouter = new Router();

module.exports = (app, articlesService, commentService) => {
  app.use(`/articles`, articlesRouter);

  articlesRouter.get(`/`, async (req, res) => {
    const {user, limit, offset, needComments} = req.query;

    let articles = {};

    if (user) {
      articles.current = await articlesService.findAll({needComments});
      return res.status(HttpCode.OK).json(articles);
    }

    if (offset) {
      articles.recent = await articlesService.findPage({limit, offset});
      return res.status(HttpCode.OK).json(articles);
    } else {
      articles.hot = await articlesService.findLimit({limit});
    }

    return res.status(HttpCode.OK).json(articles);
  });

  articlesRouter.get(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const {comments} = req.query;
    const article = await articlesService.findOne(articleId, comments);
    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Unable to find article with id:${articleId}`);
    }
    return res.status(HttpCode.OK)
      .json(article);
  });

  articlesRouter.get(`/:articleId/comments`, articleExists(articlesService), async (req, res) => {
    const {articleId} = req.params;
    const comments = await commentService.findAllByArticleId(articleId);
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

  articlesRouter.put(`/:articleId`, [articleExists(articlesService), articleValidator], (req, res) => {
    const {articleId} = req.params;
    const updatedArticle = articlesService.update(articleId, req.body);
    if (!updatedArticle) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Unable to find article with id:${articleId}`);
    }
    return res.status(HttpCode.OK)
      .json(updatedArticle);
  });

  articlesRouter.delete(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const deletedArticle = articlesService.delete(articleId);
    if (!deletedArticle) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Unable to delete unexisting article!`);
    }
    return res.status(HttpCode.OK)
      .json(deletedArticle);
  });

  articlesRouter.delete(`/:articleId/comments/:commentId`, articleExists(articlesService), (req, res) => {
    const {article} = res.locals;
    commentService.getComments(article);
    const {commentId} = req.params;
    const deletedComment = commentService.delete(commentId);
    if (!deletedComment) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Cannot delete unexisting comment`);
    }
    return res.status(HttpCode.OK)
      .json(deletedComment);
  });
};
