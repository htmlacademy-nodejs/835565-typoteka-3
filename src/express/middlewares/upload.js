'use strict';

const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);

const {
  UPLOAD_DIR_PATH,
  MAX_ID_LENGTH,
  FILE_TYPES,
  MAX_UPLOAD_FILE_SIZE,
  UPLOADED_FILE_INPUT_NAME} = require(`../../const`);

const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR_PATH);

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(MAX_ID_LENGTH);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const fileFilter = (req, file, cb) => {
  console.log(file);
  if (FILE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {fileSize: MAX_UPLOAD_FILE_SIZE}
}).single(UPLOADED_FILE_INPUT_NAME);

module.exports = (logger, templateName) => async (req, res, next) => {

  upload(req, res, async (err) => {
    if (err) {
      const validationMessages = [err.message];
      if (err instanceof multer.MulterError) {
        logger.error(`Multer error on file upload: ${err.message}`);
        res.render(templateName, {validationMessages});
      } else {
        logger.error(`Unknown error on file upload: ${err.message}`);
        res.render(templateName, {validationMessages});
      }
      return;
    }
    next();
  });
};
