'use strict';

const express = require(`express`);
const session = require(`express-session`);
const path = require(`path`);
const helmet = require(`helmet`);

const mainRoutes = require(`./routes/main-routes`);
const myRoutes = require(`./routes/my-routes`);
const articlesRoutes = require(`./routes/articles-routes`);
const sequelize = require(`../service/lib/sequelize`);
const SequelizeStore = require(`connect-session-sequelize`)(session.Store);

const {TEMPLATES_DIR_NAME, PUBLIC_DIR_NAME, DEFAULT_PORT_FRONT, Env, EXPIRY_PERIOD, HttpCode} = require(`../const`);

const {SESSION_SECRET} = process.env;

if (process.env.NODE_ENV === Env.DEVELOPMENT) {
  if (!SESSION_SECRET) {
    throw new Error(`SESSION_SECRET environment variable is not defined`);
  }
}

const app = express();

const mySessionStore = new SequelizeStore({
  db: sequelize,
  expiration: EXPIRY_PERIOD, // 10 minutes
  checkExpirationInterval: 60 * 1000, // 1 minute
  logging: false
});

sequelize.sync({force: false});

app.set(`views`, path.resolve(__dirname, TEMPLATES_DIR_NAME));
app.set(`view engine`, `pug`);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR_NAME)));
app.use(express.urlencoded({extended: false}));

app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "script-src": [`'unsafe-eval'`, `http://localhost:${DEFAULT_PORT_FRONT}`],
        }
      },
      referrerPolicy: {
        policy: `same-origin`
      }
    })
);
app.disable(`x-powered-by`);

app.use(session({
  name: `session_id`,
  secret: SESSION_SECRET,
  store: mySessionStore,
  resave: false,
  proxy: true,
  saveUninitialized: false,
}));

app.use((_err, _req, res, _next) => {
  return res.status(HttpCode.NOT_FOUND).render(`errors/404`);
});
app.use((_err, _req, res, _next) => {
  return res.status(HttpCode.NOT_FOUND).render(`errors/500`);
});

app.use(`/articles`, articlesRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, mainRoutes);

app.listen(DEFAULT_PORT_FRONT, (error) => {
  if (error) {
    return console.error(`Error while hosting front server: ${error.message}`);
  }
  return console.info(`Listening to port: ${DEFAULT_PORT_FRONT}`);
});
