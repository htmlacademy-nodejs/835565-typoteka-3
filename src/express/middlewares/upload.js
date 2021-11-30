'use strict';

const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const sharp = require(`sharp`);
const {getLogger} = require(`../../service/lib/logger`);

const {
  UPLOAD_DIR_PATH,
  MAX_ID_LENGTH,
  FILE_TYPES,
  MAX_UPLOAD_FILE_SIZE,
  UPLOADED_FILE_INPUT_NAME,
  ARTICLE_PICTURE_JPEG_QUALITY,
  UPLOADED_IMG_OUTPUT_FROMAT,
  ArticlePictureSize,
  AvatarImgSize,
  HttpCode} = require(`../../const`);

const logger = getLogger({name: `upload middleware`});
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR_PATH);
const storage = multer.memoryStorage();

const getRandomFileName = () => `${nanoid(MAX_ID_LENGTH)}.${UPLOADED_IMG_OUTPUT_FROMAT}`;

const fileFilter = (req, file, cb) => {
  if (FILE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    req.body.uploadError = `Неподдерживаемый формат файла, только .jpeg или .png`;
    cb(null, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {fileSize: MAX_UPLOAD_FILE_SIZE}
}).single(UPLOADED_FILE_INPUT_NAME);

const uploadFile = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        req.body.uploadError = err.message;
        logger.error(`Multer error on file upload: ${err.message}`);

        return next();
      }

      logger.error(`Unknown error on file upload: ${err.message}`);

      return res.status(HttpCode.BAD_REQUEST)
        .send(err.message);
    }

    return next();
  });
};

const resizeAvatar = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  req.body.avatarImgs = {};

  const {buffer} = req.file;

  const fullsizeAvatarFilename = getRandomFileName();
  const smallsizeAvatarFilename = getRandomFileName();

  await sharp(buffer)
    .resize(
        AvatarImgSize.FULL_SIZE.WIDTH,
        AvatarImgSize.FULL_SIZE.HEIGHT
    )
    .toFormat(`jpeg`)
    .toFile(`${uploadDirAbsolute}/${fullsizeAvatarFilename}`);

  req.body.avatarImgs.fullsizeAvatar = fullsizeAvatarFilename;

  await sharp(buffer)
    .resize(
        AvatarImgSize.SMALL.WIDTH,
        AvatarImgSize.SMALL.HEIGHT
    )
    .toFormat(`jpeg`)
    .toFile(`${uploadDirAbsolute}/${smallsizeAvatarFilename}`);

  req.body.avatarImgs.smallAvatar = smallsizeAvatarFilename;

  return next();
};

const resizePicture = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  req.body.images = {};

  const {buffer} = req.file;

  const fullsizeImgFilename = getRandomFileName();
  const previewImgFilename = getRandomFileName();

  await sharp(buffer)
    .resize(
        ArticlePictureSize.FULL_SIZE.WIDTH,
        ArticlePictureSize.FULL_SIZE.HEIGHT
    )
    .toFormat(`jpeg`)
    .jpeg({quality: ARTICLE_PICTURE_JPEG_QUALITY})
    .toFile(`${uploadDirAbsolute}/${fullsizeImgFilename}`);

  req.body.images.fullsizePicture = `${fullsizeImgFilename}`;

  await sharp(buffer)
    .resize(
        ArticlePictureSize.PREVIEW.WIDTH,
        ArticlePictureSize.PREVIEW.HEIGHT
    )
    .toFormat(`jpeg`)
    .toFile(`${uploadDirAbsolute}/${previewImgFilename}`);

  req.body.images.previewPicture = `${previewImgFilename}`;

  return next();
};

module.exports = {
  uploadFile,
  resizeAvatar,
  resizePicture
};
