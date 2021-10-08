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


articlesRouter.get(`/add`, async (req, res) => {
  try {
    const categories = await api.getCategories();
    res.render(`post-new`, {categories, ...utils});
  } catch (error) {
    logger.error(`Internal server error: ${error.message}`);
    res.render(`errors/500`);
  }
});

articlesRouter.post(`/add`, async (req, res) => {
  const categories = await api.getCategories();
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

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  try {
    const [article, categories] = await Promise.all([
      api.getArticle(id),
      api.getCategories(),
    ]);
    res.render(`post-edit`, {categories, article, ...utils});
  } catch (error) {
    logger.error(`Internal server error: ${error.message}`);
    res.render(`errors/404`);
  }
});

articlesRouter.get(`/category/:id`, (req, res) => res.render(`posts-by-category`));

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  try {
    const [article, categories] = await Promise.all([
      await api.getArticle(id, {comments: true}),
      await api.getCategories(true)
    ]);
    res.render(`post`, {article, categories, ...utils});
  } catch (error) {
    logger.error(`Internal server error: ${error.message}`);
    res.render(`errors/404`);
  }
});

module.exports = articlesRouter;
