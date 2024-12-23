  const { default: axios } = require("axios");
  const { default: axiosRetry } = require("axios-retry");

  const quotationBolivar = async (cut, liquidaciones, access_token) => {
    console.log("CUT, Liquidaciones: ", cut, liquidaciones);

    // URL PRD
    const url =
      "https://api-conecta.segurosbolivar.com/prod/seguro-vehiculo-individual/v1/cotizar";

    // API KEY PRD
    const apiKey = "gORCkHJxHQQ9HtUYZNIG1WxtvMkCEuZ38SBJmBD8";

    let numsLiq = liquidaciones.map((element) => {
      return {
        data: {
          CUT: cut, // 111111
          numLiquidacion: element, // 111111
        },
      };
    });

    //   let codigoRespuesta = 0;
    let cont = 0;

    const cotizaciones = await Promise.all(
      numsLiq.map(async (element) => {
        try {
          cont++;
          console.log(
            "Intento #" + cont + "de la liquidacion: " + element.numLiquidacion
          );
          const response = await axios.post(url, element, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
            timeout: 100000,
          });

          if (response.data.dataHeader?.codRespuesta === 0) {
            console.log("Respuesta exitosa para la liquidación: ", element);
            return response.data;
          } else {
            console.log(
              `Error en la respuesta: codRespuesta=${
                response.data.dataHeader?.codRespuesta ||
                response.status ||
                "desconocido"
              }.`
            );
            return null;
          }
        } catch (error) {
          console.error("Error al procesar liquidación: ", error.message);
          return null;
        }
      })
    );
    // } catch (error) {
    //   cont++;
    //   const status = error.response?.status || "Desconocido";
    //   if (error.code === "ECONNABORTED") {
    //     console.log(
    //       `Timeout en el intento #${cont} para la liquidación: ${element}`
    //     );
    //     cotizaciones.push(null);
    //   } else {
    //     console.log(
    //       `Error HTTP ${status} en el intento #${cont} para la liquidación: ${element}`
    //     );
    //     cotizaciones.push(null);
    //   }
    // }

    return cotizaciones; // Devuelve solo las cotizaciones exitosas
  };

  module.exports = quotationBolivar;