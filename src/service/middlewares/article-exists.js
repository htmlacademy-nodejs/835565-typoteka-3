'use strict';

const {HttpCode} = require(`../../const`);

module.exports = (articlesService) => async (req, res, next) => {
  const {articleId} = req.params;
  const article = await articlesService.findOne({articleId});

  if (!article) {
    return res.status(HttpCode.NOT_FOUND)
      .send(`Article with id ${articleId} not found!`);
  }

  return next();
};
