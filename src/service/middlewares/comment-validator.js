'use strict';

const {HttpCode, defaultCommentKeys} = require(`../../const`);

module.exports = (req, res, next) => {
  const comment = req.body;
  const currentCommentKeys = Object.keys(comment);
  const keysMatches = defaultCommentKeys.every((key) => currentCommentKeys.includes(key));

  if (!keysMatches) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(`Comment structure is invalid`);
  }

  return next();
};
