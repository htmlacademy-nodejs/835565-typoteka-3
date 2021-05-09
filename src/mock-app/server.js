'use strict';

const chalk = require(`chalk`);
const http = require(`http`);
const fs = require(`fs`).promises;

const {
  DEFAULT_PORT,
  FILE_PATH,
  NOT_FOUND_MESSAGE,
  url,
  HttpCode,
} = require(`./const`);
const {sendResponse} = require(`./utils`);

const onClientConnect = async (request, response) => {
  switch (request.url) {
    case url.ROOT:
      try {
        const fileContent = await fs.readFile(FILE_PATH);
        const mockData = JSON.parse(fileContent);
        const message = mockData.map((item) => `<li>${item.title}</li>`).join(``);
        sendResponse(response, HttpCode.OK, `<ul>${message}</ul>`);
      } catch (error) {
        console.info(error);
        sendResponse(response, HttpCode.NOT_FOUND, NOT_FOUND_MESSAGE);
      }
      break;
    default:
      sendResponse(response, HttpCode.NOT_FOUND, NOT_FOUND_MESSAGE);
      break;
  }
};

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    http.createServer(onClientConnect)
      .listen(port)
      .on(`listening`, (error) => {
        if (error) {
          return console.error(chalk.red(`Ошибка при создании сервера`, error));
        }
        return console.info(chalk.green(`Ожидаю соединений на ${port}`));
      });
  }
};
