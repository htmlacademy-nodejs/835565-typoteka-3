'use strict';

const {DataTypes, Model} = require(`sequelize`);

class User extends Model {}

module.exports = (sequelize) => User.init({
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  avatarFullsize: {
    defaultValue: null,
    type: DataTypes.STRING,
    allowNull: true
  },
  avatarSmall: {
    defaultValue: null,
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize,
  modelName: `User`,
  tableName: `users`
});
