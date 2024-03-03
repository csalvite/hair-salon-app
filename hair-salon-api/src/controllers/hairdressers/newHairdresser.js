const getDB = require('../../database/getDB');
const { generateError } = require('../../utils/generate');

const newHairdresser = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const {
      username,
      password,
      repeatPassword,
      avatar,
      name,
      lastname,
      services,
    } = req.body;

    if (!(password && repeatPassword && name && lastname)) {
      throw generateError(400, 'Debes inidicar todos los campos obligatorios.');
    }

    if (password !== repeatPassword) {
      throw generateError(400, 'Las contraseñas no coinciden.');
    }

    const hairdresser = {
      username,
      password,
      repeatPassword,
      avatar,
      name,
      lastname,
      services,
    };

    if (!services || services?.length < 1) {
      const [bbddServices] = await connection.query(`select * from services`);

      hairdresser.services = bbddServices;
    }

    res.send({
      status: 'ok',
      message: 'jeje todo ok!',
      data: hairdresser,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = newHairdresser;
