const processQuotationBolivar = require("../../../../utils/WSBolivar/processQuotationBolivar");
const quotationBolivar = require("../../../../utils/WSBolivar/quotationBolivar");

const postWSBolivarQuotationController = async (data) => {
  try {
    // Validación básica de los datos
      if (!data || Object.keys(data).length === 0) {
        throw new Error("Datos de entrada inválidos o vacíos.");
      }

    // Llamada a la función de procesamiento
    const response = await processQuotationBolivar(data);

    const quotations = await quotationBolivar(response.CUT, response.liquidaciones, response.access_token);

    // Retorna la respuesta obtenida
    return {quotations, plans: response.plans};
  } catch (error) {
    console.error(
      "Error en postWSBolivarQuotationController:",
      error.message || error
    );

    // Lanzar el error para que el Handler lo maneje
    throw new Error(`Error procesando la cotización: ${error.message}`);
  }
};

module.exports = postWSBolivarQuotationController;
