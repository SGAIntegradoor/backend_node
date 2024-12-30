const { throws } = require("assert");
const processQuotationBolivar = require("../../../../utils/WSBolivar/processQuotationBolivar");

const postWSBolivarQuotationController = async (data) => {
  try {
    // Validación básica de los datos
    if (!data || Object.keys(data).length === 0) {
      throw new Error("Datos de entrada inválidos o vacíos.");
    }

    let opcionAutos = [1, 2, 4, 5];
    let productoActual = "";

    // const result = await processQuotationBolivar(data, 1);
    // return result;

    // Llamada a la función de procesamiento
    let cotizaciones = await Promise.all(
      opcionAutos.map(async (element) => {
        try {
          console.log(`Iniciando proceso para opciónAutos: ${element}`);
          const result = await processQuotationBolivar(data, element);
          console.log(`Finalizó proceso para opciónAutos: ${element}`);
          switch (element) {
            case 1:
              productoActual = "Premium";
              break;
            case 2:
              productoActual = "Standard";
              break;
            case 4:
              productoActual = "Clásica";
              break;
            case 5:
              productoActual = "Autos Ligeros";
              break;
            default:
              break;
          }

          // Responsabilidad Civil

          let RCE = 0;

          if (element == 1) {
            RCE = 4000000000;
          } else if (element == 2) {
            RCE = 2200000000;
          } else if (element == 4) {
            RCE = 1500000000;
          } else {
            RCE = 600000000;
          }

          // console.log(result.response.data)
          // return;
          // Cubirmiento PTD y PTH

          let perdidaTotalDano = "";
          let perdidaParcialDano = "";
          let perdidaTotalesParcialesHurto = "";

          result.plans?.data?.alternativasDeducibles?.map((cobertura) => {
            if (element == cobertura?.codigoOpcion) {
              cobertura?.tiposCobertura?.map((tipo) => {
                if (tipo?.codigoCobertura == 371) {
                  perdidaTotalDano = tipo?.descripcionDeducible;
                } else if (tipo?.codigoCobertura == 372) {
                  perdidaParcialDano = tipo?.descripcionDeducible;
                } else if (tipo?.codigoCobertura == 374) {
                  perdidaTotalesParcialesHurto = tipo?.descripcionDeducible;
                }
              });
            } else {
              return "Codigo de opción no encontrada";
            }
          });

          // Conductores Elegidos

          let conductorElegido = "Si ampara";

          // Servicio de Grua

          let servicioGrua = "Si ampara";

          // Formatear la respuesta
          
          const prodFormatted = {
            entidad: "Seguros Bolivar",
            numero_cotizacion: result?.response.data[0].responseData.numCotizacion,
            imagen: "bolivar.png",
            producto: productoActual,
            precio: result?.response.data[0].responseData.totalPrima.toLocaleString("es-ES"),
            responsabilidad_civil: RCE.toLocaleString("es-ES"),
            cubrimiento: `PTD: ${perdidaTotalDano} - PTH: ${perdidaTotalesParcialesHurto}`,
            deducible: `PPD: ${element !== 5 ? perdidaParcialDano : "No cubre"} - PPH: ${perdidaTotalesParcialesHurto}`,
            conductores_eledigos: conductorElegido,
            servicio_grua: servicioGrua,
          };
          // 'entidad' => 'Seguros Bolivar',
          // 'numero_cotizacion' => $Producto->numCotizacion,
          // 'imagen' => 'bolivar.png',
          // 'producto' => $nomProduct,
          // 'precio' => number_format($Producto->totalPrima, 0, ',', '.'),
          //   'responsabilidad_civil' => $nomProduct == "Verde" ? "4.000.000.000" : number_format($RCE, 0, ',', '.'),
          //   'cubrimiento' => $datoPTD != $datoPTH ? 'Cubrimiento PTD al ' . $datoPTD . ' y Cubrimiento PTH al ' . $datoPTH :  $datoPTD,
          //   'deducible' => $deducible,
          //   'conductores_elegidos' => $conductorElegido,
          //   'servicio_grua' => 'Si ampara'
          // );

          // if (result.response.data.length === 0) {
          //   throw new Error("No se cotizo ninguna oferta, intente nuevamente.");
          // }

          return prodFormatted;
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
