const {
  getTokenBolivarController,
} = require("../../controllers/WSBolivarRestControllers/getControllers/Tokens/getWSBolivarRestTokenControllers");
const postWSBolivarQuotationController = require("../../controllers/WSBolivarRestControllers/postControllers/Quotation/postWSBolivarRestQuotationControllers");

const getTokenBolivarHandler = async (req, res) => {
  try {
    const token = await getTokenBolivarController();
    return res.status(200).json({
      success: true,
      message: "Token obtenido correctamente.",
      data: token,
    });
  } catch (error) {
    console.error("Error en getTokenBolivarHandler:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Error obteniendo el token.",
      error: error.message || "Error desconocido.",
    });
  }
};


const postQuotationBolivarHandler = async (req, res) => {
  try {
    // Validación básica de entradas
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "El cuerpo de la solicitud está vacío o es inválido.",
      });
    }

    // Llamar al controlador con los datos validados
    const data = await postWSBolivarQuotationController(req.body);

    // Enviar respuesta exitosa
    return res.status(200).json({
      success: true,
      message: "Cotización procesada correctamente.",
      data: data,
    });
  } catch (error) {
    console.error("Error en postQuotationBolivarHandler:", error.message || error);

    // Enviar respuesta de error
    return res.status(500).json({
      success: false,
      message: "Error procesando la cotización.",
      error: error.message || "Error desconocido.",
    });
  }
};

module.exports = { getTokenBolivarHandler, postQuotationBolivarHandler };
