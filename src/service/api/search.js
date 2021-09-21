'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);

const searchRouter = new Router();

module.exports = (app, service) => {
  app.use(`/search`, searchRouter);

  searchRouter.get(`/`, async (req, res) => {
    const {query = ``} = req.query;
    if (!query) {
      res.status(HttpCode.BAD_REQUEST)
        .json([]);
      return;
    }

    const searchResults = await service.findAll(query);
    const searchStatus = searchResults.length > 0 ? HttpCode.OK : HttpCode.NOT_FOUND;

    res.status(searchStatus)
      .json(searchResults);
  });
};
