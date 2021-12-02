'use strict';

const fs = require(`fs`);
const path = require(`path`);
const Sequelize = require(`sequelize`);

module.exports = (sequelize) => {
  const db = {};
  const modelsDir = path.join(path.resolve(__dirname, `../../../db/models`));
  fs.readdirSync(modelsDir).forEach((file) => {
    const model = require(path.join(modelsDir, file))(
        sequelize,
        Sequelize.DataTypes
    );
    db[model.name] = model;
  });

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  return db;
};
