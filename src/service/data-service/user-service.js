'use strict';

class UserService {
  constructor(sequelize) {
    this._sequelize = sequelize;
    this._User = sequelize.models.user;
  }

  async create(userData) {
    const newUser = await this._User.create(userData);
    return newUser.get();
  }

  async findByEmail(email) {
    const user = await this._User.findOne({
      where: {email}
    });
    return user && user.get();
  }

}

module.exports = UserService;
