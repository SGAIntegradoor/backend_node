const { default: axios } = require("axios");
const { default: axiosRetry } = require("axios-retry");

// axiosRetry(axios, {
//     retries: 3,
//     retryDelay: (retryCount) => retryCount * 2000, // 1 segundo por intento
//     retryCondition: (error) => {
//       const isServerError = error.status >= 500;
//       const hasSpecificCodes = [504, -1].includes(
//         error?.status ?? error?.response?.data?.responseCode
//       );

//       if (isServerError) {
//         console.log("Reintentando debido a un error de servidor.");
//       } else if (hasSpecificCodes) {
//         console.log(
//           `Reintentando debido al código de respuesta ${error.response?.data?.responseCode}.`
//         );
//       }

//       return isServerError || hasSpecificCodes;
//     },
//   });

const settleBolivar = async (cut, access_token) => {
  const url =
    "https://api-conecta.segurosbolivar.com/prod/seguro-vehiculo-individual/v1/liquidar";

  const apiKey = "gORCkHJxHQQ9HtUYZNIG1WxtvMkCEuZ38SBJmBD8";

  const body = {
    periodoFacturacion: 12,
    opcionCobertura: "0",
    responsabilidadCivil: "18",
    deducibleCobertura: "0",
    deducibleParcial: "145",
    deducibleTotal: "3",
    deducibleHurto: "3",
    valorRentaDiaria: "0",
    opcionPa: "S",
    opcionAsis: "1",
    valorRentaInmovi: "0",
    CUT: `${cut}`,
  };
  let codigoRespuesta = 0;
  let cont = 0;
  while (codigoRespuesta != 200 && cont < 3) {
    const response = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
        "x-api-key": apiKey,
      },
      timeout: 40000,
    });

    codigoRespuesta = response.status;

    if (
      response.data.dataHeader.codRespuesta == 0 &&
      response.data.dataHeader.codRespuesta != null
    ) {
      console.log(response.data);
      codigoRespuesta = 200;
      cont = 4;
      return response.data;
    } else if (codigoRespuesta == 200) {
      cont = 4;
      return response.data;
    } else {
      console.log("Error en la liquidación: ");
    }
  }
};

module.exports = settleBolivar;
