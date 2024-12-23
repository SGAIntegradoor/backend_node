const getToken = require("../../../../utils/WSBolivar/tokenBolivar")

const getTokenBolivarController = async () => {
    const token = await getToken();
    return token; 
}

module.exports = { getTokenBolivarController };