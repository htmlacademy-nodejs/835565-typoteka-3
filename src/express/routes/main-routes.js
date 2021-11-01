'use strict';

const {Router} = require(`express`);

const {humanizeDate, prepareErrors} = require(`../../utils/utils-common`);
const {
  HumanizedDateFormat,
  LAST_COMMENTS_MAX_NUM,
  HOT_ARTICLES_LIMIT,
  ARTICLES_PER_PAGE,
  PAGINATION_WIDTH,
  COMMENTS_COUNT_KEY_NAME,
  TemplateName
} = require(`../../const`);

const api = require(`../api`).getAPI();
const {getLogger} = require(`../../service/lib/logger`);
const upload = require(`../middlewares/upload`);

const mainRouter = new Router();
const logger = getLogger({name: `main-routes api`});

const utils = {
  humanizeDate,
  HumanizedDateFormat,
  PAGINATION_WIDTH,
  COMMENTS_COUNT_KEY_NAME
};


mainRouter.get(`/`, async (req, res) => {
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
      ...utils
    };

    res.render(`main`, {...options});
  } catch (error) {
    logger.error(`Internal server error: ${error.message}`);
    res.render(`errors/500`);
  }
});

mainRouter.get(`/register`, (req, res) => res.render(`registration`));

mainRouter.post(`/register`, upload(logger, TemplateName.REGISTRATION), async (req, res) => {
  const {body, file} = req;

  const userData = {
    email: body.email,
    firstName: body.firstName,
    lastName: body.lastName,
    password: body.password,
    passwordRepeated: body[`repeat-password`],
    avatar: file?.filename || ``
  };

  // ! обработать ошибку 500
  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    res.render(`registration`, {validationMessages, ...userData});
  }
});


/**
 * LOGIN / LOGOUT routes
 */
mainRouter.get(`/login`, (req, res) => {
  const {user} = req.session;

  res.render(`login`, {user});
});

mainRouter.post(`/login`, async (req, res) => {
  const {email, password} = req.body;
  console.log(email, password);

  try {
    const user = await api.auth({email, password});
    req.session.user = user;

    req.session.save(() => {
      res.redirect(`/`);
    });
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    console.log(validationMessages);
    const {user} = req.session;

    res.render(`login`, {user, validationMessages});
  }
});

mainRouter.get(`/logout`, (req, res) => {
  delete req.session.user;
  req.session.save(() => {
    res.redirect(`/`);
  });
});


mainRouter.get(`/search`, async (req, res) => {
  const {search} = req.query;
  try {
    if (search) {
      const options = {
        search,
        results: await api.search(search),
        ...utils,
      };
      res.render(`search`, {...options});
    } else {
      res.render(`search`);
    }
  } catch (error) {
    try {
      res.render(`search-empty`, {search});
    } catch (err) {
      logger.error(`Internal server error: ${err.message}`);
      res.render(`errors/500`);
    }
  }
});

mainRouter.get(`/categories`, async (req, res) => {
  try {
    const categories = await api.getCategories({needCount: false});
    res.render(`categories`, {categories});
  } catch (error) {
    logger.error(`Internal server error: ${error.message}`);
    res.render(`errors/500`);
  }
});

module.exports = mainRouter;
