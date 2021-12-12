'use strict';

const {Server} = require(`socket.io`);
const {DEFAULT_PORT_FRONT} = require(`../../const`);

module.exports = (server) => {
  return new Server(server, {
    cors: {
      origins: [`localhost:${DEFAULT_PORT_FRONT}`],
      methods: [`GET`]
    }
  });
};
