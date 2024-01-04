const generateError = (code, message) => {
  const error = new Error(message);
  error.httpStatus = code;
  return error;
};

module.exports = {
  generateError,
};
