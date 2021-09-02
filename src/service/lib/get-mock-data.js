'use strict';

const fs = require(`fs`).promises;
const path = require(`path`);
const {FILE_PATH} = require(`../../const`);

let data = null;

const getMockData = async () => {
  if (!data === null) {
    return Promise.resolve(data);
  }
  try {
    const fileContent = await fs.readFile(path.resolve(__dirname, FILE_PATH));
    data = JSON.parse(fileContent);
  } catch (error) {
    return Promise.reject(error);
  }
  return Promise.resolve(data);
};

module.exports = getMockData;
