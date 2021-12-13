'use strict';

const {Aliase, COMMENT_CHAR_LENGTH} = require(`../../src/const`);

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(Aliase.COMMENTS, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      text: {
        allowNull: false,
        // eslint-disable-next-line new-cap
        type: Sequelize.STRING(COMMENT_CHAR_LENGTH)
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
    await queryInterface.dropTable(Aliase.COMMENTS);
  }
};
