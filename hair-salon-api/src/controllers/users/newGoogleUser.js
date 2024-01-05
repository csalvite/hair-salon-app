const getDB = require('../../database/getDB');

const newGoogleUser = async (
  accessToken,
  refreshToken,
  profile,
  done,
  req,
  res,
  next
) => {
  console.log('accessToken', accessToken);
  console.log('refreshToken', refreshToken);
  console.log('profile', profile);
  console.log('done', done);
  // Aquí puedes guardar o buscar el usuario en tu base de datos.
  // Luego, puedes llamar a done(null, usuario) para indicar que la autenticación fue exitosa.

  let connection;
  try {
    connection = await getDB();

    await connection.query(
      `insert into users (name, avatar, active)
        values (?, ?, ?)`,
      [profile.name.givenName, profile.photos[0].value, 1]
    );
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = newGoogleUser;
