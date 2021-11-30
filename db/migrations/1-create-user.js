'use strict';

const {Aliase} = require(`../../src/const`);

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(Aliase.USERS, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      passwordHash: {
        type: Sequelize.STRING,
        allowNull: false
      },
      avatarFullsize: {
        type: Sequelize.STRING
      },
      avatarSmall: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      isAdmin: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.dropTable(Aliase.USERS);
  }
};
