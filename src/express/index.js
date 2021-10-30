'use strict';

const express = require(`express`);
const path = require(`path`);

const mainRoutes = require(`./routes/main-routes`);
const myRoutes = require(`./routes/my-routes`);
const articlesRoutes = require(`./routes/articles-routes`);
const {TEMPLATES_DIR_NAME, PUBLIC_DIR_NAME, DEFAULT_PORT_FRONT} = require(`../const`);

const app = express();
app.use(express.urlencoded({extended: true}));

app.use(`/articles`, articlesRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, mainRoutes);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR_NAME)));
app.set(`views`, path.resolve(__dirname, TEMPLATES_DIR_NAME));
app.set(`view engine`, `pug`);

app.listen(DEFAULT_PORT_FRONT, (error) => {
  if (error) {
    return console.error(`Error while hosting front server: ${error.message}`);
  }
  return console.info(`Listening to port: ${DEFAULT_PORT_FRONT}`);
});
