'use strict';

const {HttpCode, defaultArticleKeys} = require(`../../const`);

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const currentArticleKeys = Object.keys(newArticle);
  const keysMayches = defaultArticleKeys.every((key) => currentArticleKeys.includes(key));

  if (!keysMayches) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(`Article structure is invalid!`);
  }

  return next();
};
