const crypto = require('crypto');

// como futura mejora implementar aqui una llamada a archivo log y escribir el fallo
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
