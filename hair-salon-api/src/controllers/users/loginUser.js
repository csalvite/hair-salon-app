const getDB = require('../../database/getDB');
const { generateError } = require('../../utils/generate');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const loginUser = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { email, password } = req.body;

    if (!(email && password)) {
      throw generateError(
        400,
        'Debes indicar todos los datos para iniciar sesion.'
      );
    }

    const [user] = await connection.query(
      `select * from users where email = ?`,
      [email]
    );

    // Variable que almacenará un valor booleano: contraseña correcta o incorrecta.
    let validPassword = false;

    // Sino hay un  usuario con ese email comprobamos que la contraseña sea
    // correcta.
    if (user.length > 0) {
      // Comprobamos que la contraseña sea correcta.
      validPassword = await bcrypt.compare(password, user[0].password);
    }

    // Si no existe ningún usuario con ese email o si la contraseña es incorrecta.
    if (user.length < 1 || !validPassword) {
      throw generateError(401, 'Email o contraseña incorrectos');
    }

    // Si el usuario existe pero NO está activo lanzamos un error.
    if (!user[0].active) {
      throw generateError(
        401,
        'Usuario pendiente de activar, comprueba tu correo para activarlo'
      );
    }

    // Objeto con la información que le vamos a pasar al token.
    const tokenInfo = {
      id: user[0].id,
    };

    // Creamos el token.
    const token = jwt.sign(tokenInfo, process.env.SECRET, {
      expiresIn: '10d',
    });

    res.send({
      status: 'ok',
      token: token,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = loginUser;
