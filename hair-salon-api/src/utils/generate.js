const crypto = require('crypto');

const generateError = (code, message) => {
  const error = new Error(message);
  error.httpStatus = code;
  return error;
};

const generateRandomString = (leght) => {
  return crypto.randomBytes(leght).toString('hex');
};

module.exports = {
  generateError,
  generateRandomString,
};
