const { default: axios } = require("axios");
const { default: axiosRetry} = require("axios-retry");

axiosRetry(axios, {
    retries: 3,
    retryDelay: (retryCount) => retryCount * 2000, // 1 segundo por intento
    retryCondition: (error) => {
      const isServerError = error.code >= 500;
      const hasSpecificCodes = [504, -1].includes(
        error.status || error.response?.data.dataHeader?.codRespuesta )
  
      if (isServerError) {
        console.log("Reintentando debido a un error de servidor.");
      } else if (hasSpecificCodes) {
        console.log(
          `Reintentando debido al código de respuesta ${error.response?.data?.responseCode}.`
        );
      }
  
      return isServerError || hasSpecificCodes;
    },
  });

const quotationBolivar = async (cut, liquidacion, access_token, plans) => {
  console.log("CUT, Liquidaciones: ", cut, liquidacion);

  // URL PRD
  const url =
    "https://api-conecta.segurosbolivar.com/prod/seguro-vehiculo-individual/v1/cotizar";

  const body = {
    data: {
      CUT: cut,
      numLiquidacion: +liquidacion,
    },
  };

  try {
    console.log(`Procesando liquidación # ${liquidacion}:`, body);

    const response = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      timeout: 60000, // 60 segundos por solicitud
    });
    // console.log(response.data.dataHeader.errores);
    if (response.data.dataHeader?.codRespuesta === 0) {
      console.log("Respuesta exitosa para la liquidación:", liquidacion);
      return response.data; // Agregar cotización exitosa
    } else {
      console.warn(
        `Error en la respuesta para la liquidación ${liquidacion}: ${
          response.data.dataHeader?.codRespuesta || "desconocido"
        }`
      );
      console.log("Error con: ",response.data);

    }
  } catch (error) {
    console.error(
      `Error al procesar la liquidación ${liquidacion}:`,
      error.message
    );
  }
};

module.exports = quotationBolivar;
