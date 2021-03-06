'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);

const {uploadFile, resizePicture} = require(`../middlewares/upload`);
const checkAuth = require(`../middlewares/auth`);
const {getLogger} = require(`../../service/lib/logger`);

const {
  humanizeDate,
  validationErrorHandler,
  adaptFormDataToClient
} = require(`../../utils/utils-common`);

const {
  HumanizedDateFormat,
  ARTICLES_PER_PAGE,
  PAGINATION_WIDTH
} = require(`../../const`);

const admin = require(`../middlewares/admin`);

const csrfProtection = csrf();
const api = require(`../api`).getAPI();
const articlesRouter = new Router();
const logger = getLogger({name: `article-routes api`});

const utils = {
  humanizeDate,
  HumanizedDateFormat,
  PAGINATION_WIDTH
};

const routePostMiddlewareSet = [
  checkAuth,
  admin,
  uploadFile,
  resizePicture,
  csrfProtection
];
let backURL;

/**
 * EXPRESS ROUTES
 *
 * Adding single article
 */
articlesRouter.get(`/add`, [checkAuth, admin, csrfProtection], async (req, res) => {
  const {user} = req.session;
  backURL = req.get(`Referer`);

  try {
    const categories = await api.getCategories({needCount: false});
    const options = {
      user,
      categories,
      csrfToken: req.csrfToken(),
      backURL,
      ...utils
    };

    res.render(`post-edit`, {...options});
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
      article: adaptFormDataToClient(newArticle),
      categories,
      validationMessages: validationErrorHandler(error),
      csrfToken: req.csrfToken(),
      backURL,
      ...utils
    };

    res.render(`post-edit`, {...options});
  }
});


/**
 * Editing single article
 */
articlesRouter.get(`/edit/:id`, [checkAuth, admin, csrfProtection], async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  backURL = req.get(`Referer`);

  try {
    const [article, categories] = await Promise.all([
      api.getArticle({id, viewMode: false}),
      api.getCategories({needCount: false}),
    ]);
    const options = {
      id,
      user,
      article,
      categories,
      csrfToken: req.csrfToken(),
      backURL,
      ...utils
    };

    res.render(`post-edit`, {...options});
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
      article: adaptFormDataToClient(articleData),
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

  backURL = req.get(`Referer`);

  try {
    const article = await api.getArticle({id, viewMode: true});
    const options = {
      id,
      user,
      article,
      csrfToken: req.csrfToken(),
      backURL,
      ...utils
    };

    res.render(`post`, {...options});
  } catch (error) {
    logger.error(`Error on 'articles/${id}' route: ${error.message}`);
    res.render(`errors/404`);
  }
});


/**
 * Deleting single article
 */
articlesRouter.get(`/:id/delete`, [checkAuth, admin], async (req, res) => {
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
articlesRouter.post(`/:id/comments`, [checkAuth, csrfProtection], async (req, res) => {
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
      text: commentData.text,
      focus: true,
      validationMessages: validationErrorHandler(errors),
      csrfToken: req.csrfToken(),
      ...utils
    };
    res.render(`post`, {...options});
  }
});

articlesRouter.get(`/:id/comments/:commentId/delete`, [checkAuth, admin], async (req, res) => {
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
