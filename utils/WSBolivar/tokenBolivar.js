const { default: axios } = require('axios');
  
  // Credenciales del cliente PRD
  const clientId = '7h7a2q9aaotn539579s8o5uf4t';
  const clientSecret = 'm50hrvl3gvkhq8kpovsq24tn5drmpo68cj8lgok3d34nhqkb2at';
  const scope = 'SrcServerCognitoConecta/ConectaApiScope';

  // URL PRD TOKEN
  const tokenUrl = 'https://conecta-prod-portal-auth.auth.us-east-1.amazoncognito.com/oauth2/token';


  async function getTokenBolivar() {
    try {
      // Configuración de la solicitud
      const response = await axios.post(
        tokenUrl,
        new URLSearchParams({
          grant_type: 'client_credentials',
          scope: scope,
        }),
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          // httpsAgent: new (require('https').Agent)({
          //   rejectUnauthorized: false, // Deshabilitar la validación SSL (equivalente a CURLOPT_SSL_VERIFYPEER y CURLOPT_SSL_VERIFYHOST)
          // }),
        }
      );
  
      // console.log('Respuesta:', response.data);
      return response.data; // Devuelve el token o la respuesta completa
    } catch (error) {
      console.error('Error obteniendo el token:', error.response?.data || error.message);
      throw error;
    }
  }

  module.exports = getTokenBolivar;