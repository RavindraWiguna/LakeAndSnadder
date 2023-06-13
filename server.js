const express = require("express");
const path = require("path");
const socket = require("socket.io");
const http = require("http");

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// Set static folder
app.use(express.static("public"));

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
