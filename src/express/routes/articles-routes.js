'use strict';

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const {humanizeDate, ensureArray} = require(`../../utils/utils-common`);
const {getLogger} = require(`../../service/lib/logger`);
const {
  HumanizedDateFormat,
  MAX_ID_LENGTH,
  UPLOAD_PATH,
  MAX_UPLOAD_FILE_SIZE,
  NEW_POST_FILE_INPUT_NAME,
  ErrorMessage
} = require(`../../const`);

const api = require(`../api`).getAPI();
const articlesRouter = new Router();
const logger = getLogger({name: `front-api`});
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_PATH);

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


articlesRouter.get(`/add`, (req, res) => {
  try {
    res.render(`post-edit`, {...utils});
  } catch (error) {
    logger.error(`Internal server error: ${error.message}`);
    res.render(`errors/500`);
  }
});

articlesRouter.post(`/add`, async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      const errorMessage = err.message;
      if (err instanceof multer.MulterError) {
        logger.error(`Multer error on file upload: ${errorMessage}`);
        res.render(`post-edit`, {errorMessage, ...utils});
        return;
      } else {
        logger.error(`Unknown error on file upload: ${errorMessage}`);
        res.render(`post-edit`, {errorMessage, ...utils});
        return;
      }
    }

    const {body, file} = req;
    const newArticle = {
      title: body.title,
      picture: file.filename,
      announce: body.announcement,
      fullText: body[`full-text`],
      date: body[`date`],
      сategories: ensureArray(body.сategories),
    };

    const options = {
      ...newArticle,
      ...utils,
    };

    try {
      await api.createArticle(newArticle);
      res.redirect(`/my`);
    } catch (error) {
      const errorMessage = ErrorMessage.SERVER_ERROR;
      logger.error(`An error occurred while creating new post: ${error.message}`);
      res.render(`post-edit`, {errorMessage, ...options});
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
      ...categories,
      ...utils,
    };
    res.render(`post-edit`, {...options});
  } catch (error) {
    logger.error(`Internal server error: ${error.message}`);
    res.render(`errors/500`);
  }
});

articlesRouter.get(`/category/:id`, (req, res) => res.render(`posts-by-category`));

articlesRouter.get(`/:id`, (req, res) => res.render(`post`));

module.exports = articlesRouter;
