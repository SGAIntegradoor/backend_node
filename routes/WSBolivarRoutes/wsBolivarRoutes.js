
    const { Router } = require("express");
    const { getTokenBolivarHandler, postQuotationBolivarHandler } = require("../../handlers/WSBolivarRestHandlers/WSBolivarRestHandlers");
    const bolivarRoutes = Router();

    bolivarRoutes.get("/getTokenBolivar", getTokenBolivarHandler);
    bolivarRoutes.post("/postQuotationBolivar", postQuotationBolivarHandler);

    module.exports = bolivarRoutes;