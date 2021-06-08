'use strict';

const chalk = require(`chalk`);
const express = require(`express`);
const routes = require(`../service/api`);

const {
  DEFAULT_PORT,
  FILE_PATH,
  NOT_FOUND_MESSAGE,
  API_PREFIX,
  HttpCode,
} = require(`../const`);

const app = express();
app.use(express.json());

app.use(API_PREFIX, routes);
app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND)
    .send(NOT_FOUND_MESSAGE);
});

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.listen(port, (error) => {
      if (error) {
        return console.error(chalk.red(`Ошибка при создании сервера`, error));
      }
      return console.info(chalk.green(`Ожидаю соединений на ${port}`));
    });
  }
};
