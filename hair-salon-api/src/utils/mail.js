const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const path = require('path');
const uuid = require('uuid');
const sharp = require('sharp');
const { ensureDir, unlink } = require('fs-extra');
const fs = require('fs');

const { SENDGRID_API_KEY, SENDGRID_FROM, FRONT_HOST } = process.env;

//Asignamos el API Key a Sendgrind.
sgMail.setApiKey(SENDGRID_API_KEY);

/**
 * ##############
 * ## sendMail ##
 * ##############
 */

async function sendMail({ to, subject, body }) {
  try {
    //Preprar el mensaje
    const msg = {
      to,
      from: SENDGRID_FROM,
      subject,
      text: body,
      html: `<html>
                    <body>
                      <div style="text-align: center;">
                        <h1>${subject}</h1>
                        <p>${body}</p>
                      </div>
                    </body>
                  </html>`,
    };

    //enviamos el mensaje.
    await sgMail.send(msg);
  } catch (_) {
    throw new Error('Hubo un problema al enviar el email');
  }
}

/**
 * #################
 * ## verifyEmail ##
 * #################
 */
// ${PUBLIC_HOST}/users/register/${registrationCode}
async function verifyEmail(email, registrationCode) {
  const emailBody = `
  <h2> Te acabas de registrar en EMUVI </h2>
  <p> Pulsa sobre la imagen para verificar tu cuenta: </p>
  <a href=${FRONT_HOST}/validate/${registrationCode}><img src="https://source.unsplash.com/500x800" alt="Bienvenido/a" width="500" border="0"></a>
  `;

  //Enviamos el mensaje al correo del usuario.
  await sendMail({
    to: email,
    subject: 'Activa tu cuenta',
    body: emailBody,
  });
}

module.exports = {
  verifyEmail,
};
