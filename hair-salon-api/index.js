const morgan = require('morgan');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const app = express();

const { PORT } = process.env;

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

/*
 * ###################
 * ## Controladores ##
 * ###################
 * */

const { newUser } = require('./src/controllers');

/* 
##########################
### Endpoints  Usuario ###
##########################
*/

app.get('/', (req, res) => {
  res.send({
    status: 'ok',
    message: 'Servidor a la escucha!',
  });
});

// Registrar nuevo usuario de la peluqueria
app.post('/register', newUser);

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
