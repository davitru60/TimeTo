const fetch = require("node-fetch");
const { Dropbox } = require("dropbox");

const DROPBOX_TOKEN_URL = "https://api.dropboxapi.com/oauth2/token";
const CLIENT_ID = process.env.DROPBOX_APP_KEY;
const CLIENT_SECRET = process.env.DROPBOX_APP_SECRET; 
const REFRESH_TOKEN = process.env.DROPBOX_REFRESH_TOKEN;

// Variables para mantener el Access Token y su expiración
let dropboxAccessToken = null;
let tokenExpiresAt = 0;

// Función para obtener un nuevo Access Token
const getNewAccessToken = async () => {
  const response = await fetch(DROPBOX_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=refresh_token&refresh_token=${REFRESH_TOKEN}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
  });

  if (!response.ok) {
    throw new Error("Error obteniendo Access Token");
  }

  const data = await response.json();
  
  const accessToken = data.access_token;
 
  const expiresIn = data.expires_in; 

  // Actualizar el Access Token y el tiempo de expiración
  dropboxAccessToken = accessToken;
  tokenExpiresAt = Date.now() + (expiresIn * 1000); // Convertir a milisegundos

  return accessToken;
};

// Middleware para asegurar un Access Token válido
const ensureDropboxToken = async (req, res, next) => {
  try {
    // Comprobar si el token actual ha caducado o está ausente
    if (!dropboxAccessToken || Date.now() >= tokenExpiresAt) {
      await getNewAccessToken(); // Obtener un nuevo Access Token si es necesario
    }

    // Configurar el cliente de Dropbox con el token existente
    const dbx = new Dropbox({ accessToken: dropboxAccessToken });

    req.dbx = dbx; // Pasar el cliente de Dropbox a la solicitud

    next(); // Continuar con el siguiente middleware o controlador
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el Access Token" });
  }
};

module.exports = { ensureDropboxToken };