const newUser = require('./users/NewUser');
const loginUser = require('./users/loginUser');
const newGoogleUser = require('./users/newGoogleUser');
const validateUser = require('./users/validateUser');

module.exports = {
  newUser,
  validateUser,
  loginUser,
  newGoogleUser,
};
