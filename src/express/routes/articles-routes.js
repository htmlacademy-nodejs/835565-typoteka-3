'use strict';

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const {humanizeDate} = require(`../../utils/utils-common`);
const {getLogger} = require(`../../service/lib/logger`);
const {
  HumanizedDateFormat,
  MAX_ID_LENGTH,
  UPLOAD_DIR_PATH,
  MAX_UPLOAD_FILE_SIZE,
  NEW_POST_FILE_INPUT_NAME,
  ErrorMessage
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
    res.render(`post-edit`, {categories, ...utils});
  } catch (error) {
    logger.error(`Internal server error: ${error.message}`);
    res.render(`errors/500`);
  }
});

articlesRouter.post(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  upload(req, res, async (err) => {
    if (err) {
      const errorMessage = err.message;
      if (err instanceof multer.MulterError) {
        logger.error(`Multer error on file upload: ${errorMessage}`);
        res.render(`post-edit`, {errorMessage, categories, ...utils});
      } else {
        logger.error(`Unknown error on file upload: ${errorMessage}`);
        res.render(`post-edit`, {errorMessage, categories, ...utils});
      }
      return;
    }

    const {body, file} = req;
    const newArticle = {
      title: body.title,
      picture: file.filename,
      announce: body.announcement,
      fullText: body[`full-text`],
      createdAt: body[`date`],
      categories: body.categories
    };

    const options = {
      ...newArticle,
      ...utils,
    };

    try {
      await api.createArticle(newArticle);
      res.redirect(`/my`);
    } catch (error) {
      const errorMessage = ErrorMessage.UNKNOWN_ERROR;
      logger.error(`An error occurred while creating new post: ${error.message}`);
      res.render(`post-edit`, {errorMessage, categories, ...options});
    }
  });
});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  try {
    const {id} = req.params;
    const [article, categories] = await Promise.all([
      api.getArticle(id),
      api.getCategories(),
    ]);
    const options = {
      ...article,
      ...utils,
    };
    res.render(`post-edit`, {categories, ...options});
  } catch (error) {
    logger.error(`Internal server error: ${error.message}`);
    res.render(`errors/404`);
  }
});

articlesRouter.get(`/category/:id`, (req, res) => res.render(`posts-by-category`));

articlesRouter.get(`/:id`, async (req, res) => {
  try {
    const {id} = req.params;
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
