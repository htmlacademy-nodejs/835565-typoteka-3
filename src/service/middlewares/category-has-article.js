'use strict';

const {HttpCode} = require(`../../const`);

const categoryErrorMessage = `Нельзя удалить категорию, связанную с одной или несколькими публикациями`;

module.exports = (service) => async (req, res, next) => {
  const {categoryId} = req.params;

  const category = await service.findOne({id: categoryId, needCount: true});

  if (category.count > 0) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(categoryErrorMessage);
  }

  return next();
};

