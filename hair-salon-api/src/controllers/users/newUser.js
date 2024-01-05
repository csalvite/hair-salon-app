const getDB = require('../../database/getDB');
const { generateError, generateRandomString } = require('../../utils/generate');
const bcrypt = require('bcrypt');
const { verifyEmail } = require('../../utils/mail');
require('dotenv').config();
const saltRounds = 10;

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

    if (password !== confirmPassword) {
      throw generateError(400, 'Las contraseñas no coinciden.');
    }

    const [user] = await connection.query(
      `select * from users where email = ?`,
      [email]
    );

    if (user.length > 0) {
      throw generateError(409, 'Email ya en uso.');
    }

    const registrationCode = generateRandomString(40);

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await connection.query(
      `insert into users (name, password, email)
      values (?, ?, ?)`,
      [name, hashedPassword, email]
    );

    // Enviamos un mensaje de verificación al email del usuario.
    await verifyEmail(email, registrationCode);

    res.send({
      status: 'ok',
      message:
        'Usuario registrado con éxito! Comprueba tu email para activar la cuenta.',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = newUser;
