'use strict';

module.exports = (req, res, next) => {
  const {user} = req.session;
  console.log(`admin!!!!!!!!!`);

  if (!user.isAdmin) {
    return res.status(401).send(`Данная функция доступна только администратору блога`);
  }
  return next();
};
