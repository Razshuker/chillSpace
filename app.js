const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const upload = require("express-fileupload");


const { routesInit } = require("./routes/configRoutes");
require("./db/mongoConnect");

const app = express();
app.use(cors());
app.use(upload({
    limits: { fileSize: 1024 * 1024 * 5 }
}))
app.use(express.json({ limit: '5mb' }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

routesInit(app);


const server = http.createServer(app);
let port = process.env.PORT || 3001;
server.listen(port);
