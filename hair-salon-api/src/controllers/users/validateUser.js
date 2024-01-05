const getDB = require('../../database/getDB');
const { generateError } = require('../../utils/generate');
require('dotenv').config();

const validateUser = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { registrationCode } = req.query;

    const [user] = await connection.query(
      `select * from users where registrationCode = ?`,
      [registrationCode]
    );

    if (user.length < 1) {
      throw generateError(
        404,
        'Cuenta ya activada o email no registrado correctamente.'
      );
    }

    // Si el usuario está pendiente de validar
    await connection.query(
      `update users set active = 1, registrationCode = '' where registrationCode = ?`,
      [registrationCode]
    );

    res.send({
      status: 'ok',
      message:
        'Usuario validado con éxito! Ya puedes empezar a usar la aplicación.',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = validateUser;
