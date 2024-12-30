const express = require('express');
const PORT = process.env.PORT || 3001; 
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const bolivarRoutes = require('./routes/WSBolivarRoutes/wsBolivarRoutes');
const fs = require('fs');
const path = require('path');
const cors = require("cors");

// Crear un archivo para guardar los logs
const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// Usar morgan para registrar las solicitudes

const server = express();
server.use(cors());
// server.use(express.json());

server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));
server.use(morgan('combined', { stream: logStream }));
server.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Credentials", "true");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
	next();
});

server.use("/WSBolivar/", bolivarRoutes)
server.get('/', (req, res) => {
    res.send('Hello Daniel');
})

server.use((err, req, res, next) => {
	const status = err.status || 500;
	const message = err.message || err;
	console.error(err);
	res.status(status).send(message);
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});