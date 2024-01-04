const getDB = require('../../database/getDB');
const { generateError } = require('../../utils/generateError');

const newUser = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { name, email, password, confirmPassword } = req.body;

    if (!(email && name && password && confirmPassword)) {
      throw generateError(
        400,
        'Debes indicar todos los datos para registrar al usuario!'
      );
    }

    res.send({
      status: 'ok',
      message: 'usuario registrado',
      datos: {
        email,
        name,
        password,
        confirmPassword,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = newUser;
