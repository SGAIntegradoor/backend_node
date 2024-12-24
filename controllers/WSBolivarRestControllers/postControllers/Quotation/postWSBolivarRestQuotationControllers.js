const { throws } = require("assert");
const processQuotationBolivar = require("../../../../utils/WSBolivar/processQuotationBolivar");

const postWSBolivarQuotationController = async (data) => {
  try {
    // Validación básica de los datos
    if (!data || Object.keys(data).length === 0) {
      throw new Error("Datos de entrada inválidos o vacíos.");
    }

    let opcionAutos = [1, 2, 4, 5];

    // Llamada a la función de procesamiento
    let cotizaciones = await Promise.all(
      opcionAutos.map(async (element) => {
        try {
          console.log(`Iniciando proceso para opciónAutos: ${element}`);
          const result = await processQuotationBolivar(data, element);
          console.log(`Finalizó proceso para opciónAutos: ${element}`);
          switch (element) {
            case 1:
              result.producto = "Premium";
              break;
            case 2:
              result.producto = "Standard";
              break;
            case 4:
              result.producto = "Clásica";
              break;
            case 5:
              result.producto = "Autos Ligeros";
              break;
            default:
              break;
          }

          if(result.data.length === 0){
            throw new Error("No se cotizo ninguna oferta, intente nuevamente.")
          }

          return result;
        } catch (error) {
          console.error(
            `Error en el proceso de opciónAutos ${element}:`,
            error.message || error
          );
          // Opcional: Retornar null o lanzar un error según el caso
          return null; // Esto permite continuar con las demás promesas
        }
      })
    );

    // Filtrar cotizaciones exitosas (si deseas manejar errores de manera explícita)
    cotizaciones = cotizaciones.filter((coti) => coti !== null);

    return cotizaciones;
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
