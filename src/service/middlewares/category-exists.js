'use strict';

const {HttpCode} = require(`../../const`);

module.exports = (service) => async (req, res, next) => {
  const {categoryId} = req.params;

  const category = await service.findOne({id: categoryId});

  if (!category) {
    return res.status(HttpCode.NOT_FOUND)
      .send(`Unable to delete unexisting category!`);
  }

  return next();
};
