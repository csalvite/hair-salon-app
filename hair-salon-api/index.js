const morgan = require('morgan');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

const app = express();

const { PORT, GOOGLE_AUTH_CLIENT_ID, GOOGLE_AUTH_CLIENT_SECRET, SECRET } =
  process.env;

app.use(cors());

app.options('*', cors());

// Desserializa body en formato raw
app.use(express.json());

// La morgana para support e info
app.use(morgan('dev'));

// Middleware para leer body en formato form-data
app.use(fileUpload());

// Cargamos las fotos para mails
app.use(express.static('static'));

/*
 * #################
 * ## Middlewares ##
 * #################
 * */
const { isAdmin } = require('./src/middlewares');
/*
 * ###################
 * ## Controladores ##
 * ###################
 * */

const {
  newUser,
  validateUser,
  loginUser,
  newGoogleUser,
  newHairdresser,
} = require('./src/controllers');

// Configuramos Passport con la estrategia de Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_AUTH_CLIENT_ID,
      clientSecret: GOOGLE_AUTH_CLIENT_SECRET,
      callbackURL: 'http://localhost:4000/auth/google/callback',
    },
    newGoogleUser
  )
);

// Configurar express-session
app.use(
  session({
    secret: SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

// Inicializar Passport y establecer sesiones.
app.use(passport.initialize());
app.use(passport.session());

/* 
##########################
### Endpoints  Usuario ###
##########################
*/

// Ruta de inicio de sesión con Google
app.get(
  '/login/google',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login'],
  })
);

// Rutas de autenticación con Google
app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login'],
  })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Redirigir o realizar alguna acción después de la autenticación exitosa.
    res.redirect('/dashboard');
  }
);

// Ruta protegida
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};

app.get('/dashboard', isLoggedIn, (req, res) => {
  // Ruta protegida, solo accesible para usuarios autenticados.
  res.send('Bienvenido al panel de control');
});

app.get('/', (req, res) => {
  res.send({
    status: 'ok',
    message: 'Servidor a la escucha!',
  });
});

// Registrar nuevo usuario de la peluqueria
app.post('/register', newUser);

// Validar registro de usuario
app.post('/validate', validateUser);

// Login usuario
app.post('/login', loginUser);

/*
  #############################
  ### Hairdresser Endpoints ###
  #############################
*/

// solo admin/dueño del establecimiento puede crear nuevos peluquer@s
app.post('/new-hairdresser', isAdmin, newHairdresser);

/*
  #####################################
  ### Middlewares Error y Not Found ###
  #####################################
*/

app.use((error, req, res, _) => {
  console.error(error);
  res.status(error.httpStatus || 500).send({
    status: 'Error',
    message: error.message,
  });
});

app.use((req, res) => {
  res.status(404).send({
    status: 'error',
    message: 'Not Found',
  });
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
