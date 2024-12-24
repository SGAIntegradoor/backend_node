const { default: axios } = require("axios");
const { default: axiosRetry } = require("axios-retry");

axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 2000, // 1 segundo por intento
  retryCondition: (error) => {
    const isServerError = error.code >= 500;
    const hasSpecificCodes = [504, -1].includes(
      error.code || error.response?.data?.responseCode
    );

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

const recoverySettle = async (access_token, cut) => {
  const apiKey = "gORCkHJxHQQ9HtUYZNIG1WxtvMkCEuZ38SBJmBD8";
  const url =
    "https://api-conecta.segurosbolivar.com/prod/seguro-vehiculo-individual/v1/transaccion/recupera";

  try {
    console.log(`Iniciando recuperación para CUT: ${cut}`);

    const response = await axios.get(`${url}?CUT=${cut}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
        "x-api-key": apiKey,
      },
      timeout: 120000, // Tiempo de espera optimizado
    });

    const { status, data } = response;
    if (status === 200 && data?.dataHeader?.responseCode === 0) {
      console.log("Recuperación exitosa.");
      return data;
    } else {
      throw new Error(
        `Error en la respuesta: codRespuesta = ${
          response.data?.dataHeader?.codRespuesta || response.status || "error"
        }, Mensaje: ${
          typeof response.data === "string"
            ? response.data
            : JSON.stringify(response.data) // Convierte el objeto a una cadena legible
        }`
      );
    }
  } catch (error) {
    if (error.response) {
      console.error(
        `Error HTTP ${error.response.status}: ${
          error.response.data?.message || "Sin mensaje"
        }`
      );
    } else {
      console.error(`Error de red o inesperado: ${error.message}`);
    }

    throw new Error(`Error en recoverySettle: ${error.message}`);
  }
};

module.exports = recoverySettle;
