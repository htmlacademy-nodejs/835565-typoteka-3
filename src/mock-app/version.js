'use strict';

const packageJSONFile = require(`../../package.json`);

module.exports = {
  name: `--version`,
  run: () => {
    console.info(packageJSONFile.version);
  },
};
