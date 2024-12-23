const { default: axios } = require("axios");
const { default: axiosRetry } = require("axios-retry");

// axiosRetry(axios, { retries: 3 });

const preSettleBolivar = async (data, access_token) => {
  const url =
    "https://api-conecta.segurosbolivar.com/prod/seguro-vehiculo-individual/v1/preliquidar";
  // $url = "https://stg-api-conecta.segurosbolivar.com/stage/seguro-vehiculo-individual/v1/preliquidar";

  //API KEY PRD
  const apiKey = "gORCkHJxHQQ9HtUYZNIG1WxtvMkCEuZ38SBJmBD8";

  //API KEY STG
  // $apiKey = "AXhW6za0Ge4wot1CZITLq2iuM1Efvn8A9hh8CxAM";

  const body = {
    dataHeader: {
      subProducto: data.codigoSubProd,
      codUrs: data.codUrs,
      info2: data.info2Aliado,
      info5: data.info5CodPro,
    },
    data: {
      claveAsesor: data.claveAsesor,
      autos: [
        {
          placa: data.placa,
          marca: data.codigoFasecolda,
          modelo: data.modelo,
          asegurado: {
            tipoDocumento: data.tipoIdentificacion,
            numeroDocumento: data.numeroIdentificacion,
            nombres: data.nombre,
            apellidos: data.apellido,
            email: "",
            telefono: data.numeroTelefono,
            celular: data.numeroTelefono,
            fechaNacimiento: `${data.fechaNacimiento}-00:00`,
            ciudad: data.ciudadBolivar,
          },
          conductor: {
            nombres: data.nombre,
            sexo: data.genero,
            fechaNacimiento: `${data.fechaNacimiento}-00:00`,
            estadoCivil: "Soltero",
          },
          sumaAccesorios: 0,
          localidadMovilizacion: data.ciudadBolivar,
          uso: data.uso,
          beneficiario: {
            oneroso: false,
          },
          emailEnvio: "",
          calculaBonifiReprLegal: false,
        },
      ],
    },
  };

  try {
    const response = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
        "x-api-key": apiKey,
      },
    });
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error(
      "Error en preSettleBolivar:",
      error.response?.data || error.message
    );
    throw error;
  }
};

module.exports = preSettleBolivar;
