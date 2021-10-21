'use strict';

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const {humanizeDate, prepareErrors} = require(`../../utils/utils-common`);
const {getLogger} = require(`../../service/lib/logger`);
const {
  HumanizedDateFormat,
  MAX_ID_LENGTH,
  UPLOAD_DIR_PATH,
  MAX_UPLOAD_FILE_SIZE,
  NEW_POST_FILE_INPUT_NAME,
  HttpCode,
} = require(`../../const`);

const api = require(`../api`).getAPI();
const articlesRouter = new Router();
const logger = getLogger({name: `article-routes api`});
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR_PATH);

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(MAX_ID_LENGTH);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({
  storage,
  limits: {fileSize: MAX_UPLOAD_FILE_SIZE}
}).single(NEW_POST_FILE_INPUT_NAME);

const utils = {
  humanizeDate,
  HumanizedDateFormat,
  NEW_POST_FILE_INPUT_NAME,
};


/**
 * EXPRESS ROUTES
 *
 * Adding single article
 */
articlesRouter.get(`/add`, async (req, res) => {
  try {
    const categories = await api.getCategories({needCount: false});
    res.render(`post-new`, {categories, ...utils});
  } catch (error) {
    logger.error(`Error on 'articles/add' route: ${error.message}`);
    res.render(`errors/500`);
  }
});

articlesRouter.post(`/add`, async (req, res) => {
  const categories = await api.getCategories({needCount: false})
    .catch(() => res.render(`errors/500`));

  upload(req, res, async (err) => {
    if (err) {
      const validationMessages = [err.message];
      if (err instanceof multer.MulterError) {
        logger.error(`Multer error on file upload: ${err.message}`);
        res.render(`post-edit`, {validationMessages, categories, ...utils});
      } else {
        logger.error(`Unknown error on file upload: ${err.message}`);
        res.render(`post-edit`, {validationMessages, categories, ...utils});
      }
      return;
    }

    const {body, file} = req;
    const newArticle = {
      title: body.title,
      picture: file?.filename || ``,
      announce: body.announcement,
      fullText: body[`full-text`],
      createdAt: humanizeDate(``, body[`date`]),
      categories: body.categories
    };

    try {
      try {
        await api.createArticle(newArticle);
        res.redirect(`/my`);
      } catch (errors) {
        const validationMessages = prepareErrors(errors);
        res.render(`post-edit`, {validationMessages, categories, article: newArticle, ...utils});
      }
    } catch (error) {
      logger.error(`An error occurred while creating new post: ${error.message}`);
      res.render(`errors/500`);
    }
  });
});


/**
 * Editing single article
 */
articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;

  try {
    const [article, categories] = await Promise.all([
      api.getArticle({id, viewMode: false}),
      api.getCategories({needCount: false}),
    ]);
    res.render(`post-edit`, {categories, article, id, ...utils});
  } catch (error) {
    logger.error(`Error on 'articles/edit/${id}' route: ${error.message}`);
    res.render(`errors/404`);
  }
});

articlesRouter.post(`/edit/:id`, async (req, res) => {
  const {id} = req.params;

  const categories = await api.getCategories({needCount: false})
    .catch(() => res.render(`errors/500`));

  upload(req, res, async (err) => {
    if (err) {
      const validationMessages = [err.message];
      if (err instanceof multer.MulterError) {
        logger.error(`Multer error on file upload: ${err.message}`);
        res.render(`post-edit`, {validationMessages, categories, ...utils});
      } else {
        logger.error(`Unknown error on file upload: ${err.message}`);
        res.render(`post-edit`, {validationMessages, categories, ...utils});
      }
      return;
    }

    const {body, file} = req;
    const articleData = {
      title: body.title,
      picture: file?.filename || ``,
      announce: body.announcement,
      fullText: body[`full-text`],
      createdAt: humanizeDate(``, body[`date`]),
      categories: body.categories
    };

    try {
      try {
        await api.editArticle({id, data: articleData});
        res.redirect(`/my`);
      } catch (errors) {
        const validationMessages = prepareErrors(errors);
        res.render(`post-edit`, {validationMessages, categories, article: articleData, id, ...utils});
      }
    } catch (error) {
      logger.error(`An error occurred while editing article #${id}: ${error.message}`);
      res.render(`errors/500`);
    }
  });
});


/**
 * Viewing single article
 */
articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;

  try {
    const article = await api.getArticle({id, viewMode: true});
    res.render(`post`, {article, id, ...utils});
  } catch (error) {
    logger.error(`Error on 'articles/${id}' route: ${error.message}`);
    res.render(`errors/404`);
  }
});


/**
 * Deleting single article
 */
articlesRouter.delete(`/:id`, async (req, res) => {
  const {id} = req.params;

  try {
    const article = await api.deleteArticle(id);
    res.status(HttpCode.OK).send(article);
  } catch (error) {
    res.status(error.response.status).send(error.response.statusText);
  }
});


/**
 * Adding/deleting comments
 * of a single article
 */
articlesRouter.post(`/:id/comments`, async (req, res) => {
  const {id} = req.params;
  const {message} = req.body;

  const commentData = {
    text: message
  };

  try {
    try {
      await api.createComment({id, data: commentData});
      res.redirect(`/articles/${id}`);
    } catch (errors) {
      const article = await api.getArticle({id, viewMode: true});
      const validationMessages = prepareErrors(errors);
      res.render(`post`, {validationMessages, article, id, ...utils});
    }
  } catch (error) {
    logger.error(`An error occurred while creating new comment at article #${id}: ${error.message}`);
    res.render(`errors/500`);
  }
});

articlesRouter.get(`/category/:id`, (req, res) => res.render(`posts-by-category`));

module.exports = articlesRouter;
