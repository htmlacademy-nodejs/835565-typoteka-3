'use strict';

const {HttpCode} = require(`../../const`);

module.exports = (commentService) => async (req, res, next) => {
  const {commentId} = req.params;
  const comment = await commentService.findOne(commentId);

  if (!comment) {
    return res.status(HttpCode.NOT_FOUND)
      .send(`Comment with id ${commentId} not found!`);
  }

  return next();
};
