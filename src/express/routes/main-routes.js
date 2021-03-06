'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);

const {humanizeDate, validationErrorHandler} = require(`../../utils/utils-common`);
const {
  HumanizedDateFormat,
  TextVisibleLimit,
  LAST_COMMENTS_MAX_NUM,
  HOT_ARTICLES_LIMIT,
  ARTICLES_PER_PAGE,
  PAGINATION_WIDTH,
  COMMENTS_COUNT_KEY_NAME,
} = require(`../../const`);

const csrfProtection = csrf();
const api = require(`../api`).getAPI();
const {getLogger} = require(`../../service/lib/logger`);
const {uploadFile, resizeAvatar} = require(`../middlewares/upload`);
const checkAuth = require(`../middlewares/auth`);
const admin = require(`../middlewares/admin`);

const mainRouter = new Router();
const logger = getLogger({name: `main-routes api`});

const utils = {
  humanizeDate,
  HumanizedDateFormat,
  TextVisibleLimit,
  PAGINATION_WIDTH,
  COMMENTS_COUNT_KEY_NAME,
};

let backURL;


/**
 * MAIN PAGE route
 * (public route)
 */
mainRouter.get(`/`, async (req, res) => {
  const {user} = req.session;
  let {page = 1} = req.query;

  const offset = (page - 1) * ARTICLES_PER_PAGE;

  try {
    const [
      {hot: hotArticles},
      {recent: {count, articles: previewArticles}},
      categories,
      comments
    ] = await Promise.all([
      await api.getArticles({limit: HOT_ARTICLES_LIMIT}),
      await api.getArticles({limit: ARTICLES_PER_PAGE, offset}),
      await api.getCategories({needCount: true}),
      await api.getComments({limit: LAST_COMMENTS_MAX_NUM})
    ]);

    const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

    const options = {
      hotArticles,
      previewArticles,
      comments,
      categories,
      page: +page,
      totalPages,
      user,
      ...utils
    };

    res.render(`main`, {...options});
  } catch (error) {
    logger.error(`Internal server error: ${error.message}`);
    res.render(`errors/500`);
  }
});


/**
 * REGISTRATION routes
 * (public routes)
 */
mainRouter.get(`/register`, (req, res) => {
  const {user} = req.session;
  backURL = req.get(`Referer`);

  if (user) {
    res.redirect(`/`);
    return;
  }

  res.render(`registration`, {user, backURL});
});

mainRouter.post(`/register`, uploadFile, resizeAvatar, async (req, res) => {
  const {body} = req;

  const userData = {
    email: body.email,
    firstName: body.firstName,
    lastName: body.lastName,
    password: body.password,
    passwordRepeated: body[`repeat-password`],
    avatarFullsize: body.avatarImgs?.fullsizeAvatar || ``,
    avatarSmall: body.avatarImgs?.smallAvatar || ``,
    isAdmin: false
  };

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (error) {
    const validationMessages = validationErrorHandler(error);
    res.render(`registration`, {validationMessages, backURL, ...userData});
  }
});


/**
 * LOGIN / LOGOUT routes
 * (public routes)
 */
mainRouter.get(`/login`, (req, res) => {
  const {user} = req.session;
  backURL = req.get(`Referer`);

  if (user) {
    res.redirect(`/`);
    return;
  }

  res.render(`login`, {user, backURL});
});

mainRouter.post(`/login`, async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await api.auth({email, password});
    req.session.user = user;

    req.session.save(() => {
      res.redirect(`/`);
    });
  } catch (error) {
    const validationMessages = validationErrorHandler(error);
    const {user} = req.session;

    res.render(`login`, {user, validationMessages, backURL});
  }
});

mainRouter.get(`/logout`, (req, res) => {
  delete req.session.user;
  req.session.save(() => {
    res.redirect(`/`);
  });
});


/**
 * SEARCH route
 * (public route)
 */
mainRouter.get(`/search`, async (req, res) => {
  const {user} = req.session;
  const {search} = req.query;

  try {
    if (search) {
      const options = {
        user,
        search,
        results: await api.search(search),
        ...utils,
      };
      res.render(`search`, {...options});
    } else {
      res.render(`search`, {user});
    }
  } catch (error) {
    try {
      res.render(`search-empty`, {search, user});
    } catch (err) {
      logger.error(`Internal server error: ${err.message}`);
      res.render(`errors/500`);
    }
  }
});


/**
 * CATEGORIES PAGE routes
 * (admin routes)
 */
mainRouter.get(`/categories`, checkAuth, admin, csrfProtection, async (req, res) => {
  const {user} = req.session;

  try {
    const categories = await api.getCategories({needCount: true});
    res.render(`categories`, {categories, user, csrfToken: req.csrfToken()});
  } catch (error) {
    logger.error(`Internal server error: ${error.message}`);
    res.render(`errors/500`);
  }
});

mainRouter.post(`/categories/add`, checkAuth, admin, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {body} = req;

  const newCategory = {
    name: body[`add-category`]
  };

  try {
    await api.createCategory(newCategory);
    res.redirect(`/categories`);
  } catch (error) {
    const categories = await api.getCategories({needCount: true});
    const validationMessages = validationErrorHandler(error);
    const options = {
      user,
      categories,
      validationMessages,
      csrfToken: req.csrfToken()
    };

    res.render(`categories`, {...options});
  }
});

mainRouter.post(`/categories/edit/:id`, checkAuth, admin, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {body} = req;

  const categoryData = {
    name: body[`category-${id}`]
  };

  try {
    await api.editCategory({id, data: categoryData});
    res.redirect(`/categories`);
  } catch (error) {
    const categories = await api.getCategories({needCount: true});
    const validationMessages = validationErrorHandler(error);
    const options = {
      user,
      categories,
      validationMessages,
      csrfToken: req.csrfToken()
    };

    res.render(`categories`, {...options});
  }
});

mainRouter.post(`/categories/:id/delete`, checkAuth, admin, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;

  try {
    await api.deleteCategory(id);
    res.redirect(`/categories`);
  } catch (error) {
    const categories = await api.getCategories({needCount: true});
    const validationMessages = validationErrorHandler(error);
    const options = {
      user,
      categories,
      validationMessages,
      csrfToken: req.csrfToken()
    };

    res.render(`categories`, {...options});
  }
});

module.exports = mainRouter;
