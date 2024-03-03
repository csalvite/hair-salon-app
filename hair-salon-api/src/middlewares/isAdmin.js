const getDB = require('../database/getDB');

const isAdmin = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    console.log('isAdmin');

    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = isAdmin;
