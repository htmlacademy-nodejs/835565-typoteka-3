'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);

const {uploadFile, resizePicture} = require(`../middlewares/upload`);
const checkAuth = require(`../middlewares/auth`);
const {getLogger} = require(`../../service/lib/logger`);

const {humanizeDate, validationErrorHandler, adaptArticleToClient} = require(`../../utils/utils-common`);
const {
  HumanizedDateFormat,
  ARTICLES_PER_PAGE,
  PAGINATION_WIDTH
} = require(`../../const`);

const csrfProtection = csrf();
const api = require(`../api`).getAPI();
const articlesRouter = new Router();
const logger = getLogger({name: `article-routes api`});

const utils = {
  humanizeDate,
  HumanizedDateFormat,
  PAGINATION_WIDTH
};

const routePostMiddlewareSet = [checkAuth, uploadFile, resizePicture, csrfProtection];


/**
 * EXPRESS ROUTES
 *
 * Adding single article
 */
articlesRouter.get(`/add`, checkAuth, csrfProtection, async (req, res) => {
  const {user} = req.session;

  try {
    const categories = await api.getCategories({needCount: false});
    res.render(`post-edit`, {categories, user, csrfToken: req.csrfToken(), ...utils});
  } catch (error) {
    logger.error(`Error on 'articles/add' route: ${error.message}`);
    res.render(`errors/500`);
  }
});

articlesRouter.post(`/add`, [...routePostMiddlewareSet], async (req, res) => {
  const {user} = req.session;
  const {body} = req;

  const {uploadError} = body;

  const newArticle = {
    title: body.title,
    fullsizePicture: body.images?.fullsizePicture || ``,
    previewPicture: body.images?.previewPicture || ``,
    announce: body.announcement,
    fullText: body[`full-text`],
    createdAt: humanizeDate(``, body[`date`]),
    categories: body.categories,
    userId: user.id,
  };

  try {
    if (uploadError) {
      throw uploadError;
    }

    await api.createArticle(newArticle);
    res.redirect(`/my`);
  } catch (error) {
    const categories = await api.getCategories({needCount: false});

    const options = {
      user,
      article: adaptArticleToClient(newArticle),
      categories,
      validationMessages: validationErrorHandler(error),
      csrfToken: req.csrfToken(),
      ...utils
    };

    res.render(`post-edit`, {...options});
  }
});


/**
 * Editing single article
 */
articlesRouter.get(`/edit/:id`, checkAuth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;

  try {
    const [article, categories] = await Promise.all([
      api.getArticle({id, viewMode: false}),
      api.getCategories({needCount: false}),
    ]);
    res.render(`post-edit`, {categories, article, user, id, csrfToken: req.csrfToken(), ...utils});
  } catch (error) {
    logger.error(`Error on 'articles/edit/${id}' route: ${error.message}`);
    res.render(`errors/404`);
  }
});

articlesRouter.post(`/edit/:id`, [...routePostMiddlewareSet], async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {body} = req;

  const {uploadError} = body;

  const articleData = {
    title: body.title,
    fullsizePicture: body.images?.fullsizePicture || ``,
    previewPicture: body.images?.previewPicture || ``,
    announce: body.announcement,
    fullText: body[`full-text`],
    createdAt: humanizeDate(``, body[`date`]),
    categories: body.categories,
    userId: user.id
  };

  try {
    if (uploadError) {
      throw uploadError;
    }

    await api.editArticle({id, data: articleData});
    res.redirect(`/my`);
  } catch (errors) {
    const categories = await api.getCategories({needCount: false});

    const options = {
      id,
      user,
      article: adaptArticleToClient(articleData),
      categories,
      validationMessages: validationErrorHandler(errors),
      csrfToken: req.csrfToken(),
      ...utils
    };

    res.render(`post-edit`, {...options});
  }
});


/**
 * Viewing single article
 */
articlesRouter.get(`/:id`, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;

  try {
    const article = await api.getArticle({id, viewMode: true});
    res.render(`post`, {article, id, user, csrfToken: req.csrfToken(), ...utils});
  } catch (error) {
    logger.error(`Error on 'articles/${id}' route: ${error.message}`);
    res.render(`errors/404`);
  }
});


/**
 * Deleting single article
 */
articlesRouter.get(`/:id/delete`, checkAuth, async (req, res) => {
  const {id} = req.params;

  try {
    await api.deleteArticle(id);
    res.redirect(`/my`);
  } catch (error) {
    res.status(error.response.status).send(error.response.statusText);
  }
});


/**
 * Adding/deleting comments
 * of a single article
 */
articlesRouter.post(`/:id/comments`, checkAuth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {message} = req.body;

  const commentData = {
    userId: user.id,
    text: message
  };

  try {
    await api.createComment({id, data: commentData});
    res.redirect(`/articles/${id}`);
  } catch (errors) {
    const article = await api.getArticle({id, viewMode: true});

    const options = {
      id,
      user,
      article,
      validationMessages: validationErrorHandler(errors),
      csrfToken: req.csrfToken(),
      ...utils
    };
    res.render(`post`, {...options});
  }
});

articlesRouter.get(`/:id/comments/:commentId/delete`, checkAuth, async (req, res) => {
  const {id, commentId} = req.params;

  try {
    await api.deleteComment({id, commentId});
    res.redirect(`/my/comments`);
  } catch (error) {
    res.status(error.response.status).send(error.response.statusText);
  }
});


/**
 * Get articles
 * with a sertain category
 */
articlesRouter.get(`/category/:categoryId`, async (req, res) => {
  const {user} = req.session;
  const {categoryId} = req.params;
  let {page = 1} = req.query;

  const offset = (page - 1) * ARTICLES_PER_PAGE;

  try {
    const [categories, {category, count, articlesByCategory}] = await Promise.all([
      api.getCategories({needCount: true}),
      api.getCategory({limit: ARTICLES_PER_PAGE, categoryId, offset})
    ]);

    const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

    const options = {
      user,
      count,
      page: +page,
      totalPages,
      categories,
      category,
      previewArticles: articlesByCategory,
      ...utils
    };

    res.render(`posts-by-category`, {...options});
  } catch (error) {
    logger.error(`Error on 'articles/category/${categoryId}' route: ${error.message}`);
    res.render(`errors/500`);
  }
});

module.exports = articlesRouter;
