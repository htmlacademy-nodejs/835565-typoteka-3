'use strict';

const {ANNOUNCE_CHAR_LENGTH, Aliase} = require(`../../src/const`);

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(Aliase.ARTICLES, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      announce: {
        // eslint-disable-next-line new-cap
        type: Sequelize.STRING(ANNOUNCE_CHAR_LENGTH),
        allowNull: false
      },
      fullText: {
        type: Sequelize.TEXT
      },
      fullsizePicture: {
        type: Sequelize.STRING
      },
      previewPicture: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.dropTable(Aliase.ARTICLES);
  }
};
