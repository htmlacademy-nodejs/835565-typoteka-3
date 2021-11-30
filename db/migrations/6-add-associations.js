'use strict';

const {Aliase} = require(`../../src/const`);

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
        Aliase.COMMENTS, // name of Source model
        `articleId`, // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: Aliase.ARTICLES, // name of Target model
            key: `id`, // key in Target model that we're referencing
          },
          onUpdate: `CASCADE`,
          onDelete: `CASCADE`,
        }
    )
    .then(() => {
      return queryInterface.addColumn(
          Aliase.COMMENTS, // name of Source model
          `userId`, // name of the key we're adding
          {
            type: Sequelize.INTEGER,
            references: {
              model: Aliase.USERS, // name of Target model
              key: `id`, // key in Target model that we're referencing
            },
            onUpdate: `CASCADE`,
            onDelete: `SET NULL`,
          }
      );
    })
    .then(() => {
      return queryInterface.addColumn(
          Aliase.ARTICLES, // name of Source model
          `userId`, // name of the key we're adding
          {
            type: Sequelize.INTEGER,
            references: {
              model: Aliase.USERS, // name of Target model
              key: `id`, // key in Target model that we're referencing
            },
            onUpdate: `CASCADE`,
            onDelete: `SET NULL`,
          }
      );
    })
    .then(() => {
      return queryInterface.addColumn(
          Aliase.ARTICLES_CATEGORIES, // name of Source model
          `articleId`, // name of the key we're adding
          {
            type: Sequelize.INTEGER,
            references: {
              model: Aliase.ARTICLES, // name of Target model
              key: `id`, // key in Target model that we're referencing
            },
            onUpdate: `CASCADE`,
            onDelete: `CASCADE`,
          }
      );
    })
    .then(() => {
      return queryInterface.addColumn(
          Aliase.ARTICLES_CATEGORIES, // name of Source model
          `categoryId`, // name of the key we're adding
          {
            type: Sequelize.INTEGER,
            references: {
              model: Aliase.CATEGORIES, // name of Target model
              key: `id`, // key in Target model that we're referencing
            },
            onUpdate: `CASCADE`,
            onDelete: `CASCADE`,
          }
      );
    });
  },

  down: async (queryInterface, _Sequelize) => {
    return queryInterface.removeColumn(
        Aliase.COMMENTS, // name of Source model
        `articleId` // key we want to remove
    )
    .then(() => {
      return queryInterface.removeColumn(
          Aliase.COMMENTS, // name of Source model
          `userId` // key we want to remove
      );
    })
    .then(() => {
      return queryInterface.removeColumn(
          Aliase.ARTICLES_CATEGORIES, // name of Source model
          `articleId` // key we want to remove
      );
    })
    .then(() => {
      return queryInterface.removeColumn(
          Aliase.ARTICLES_CATEGORIES, // name of Source model
          `categoryId` // key we want to remove
      );
    })
    .then(() => {
      return queryInterface.removeColumn(
          Aliase.ARTICLES, // name of Source model
          `userId` // key we want to remove
      );
    });
  }
};
