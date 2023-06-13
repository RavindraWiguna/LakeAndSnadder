const express = require("express");
const socket = require("socket.io");
const http = require("http");
// cors middleware
const cors = require("cors");

const app = express();
const PORT = 3000 || process.env.PORT;
const server = http.createServer(app);

// Set static folder
app.use(express.static("public"));
app.use(cors());

// Socket setup
const io = socket(server);

// Players array
let users = [];

io.on("connection", (socket) => {
  console.log("Made socket connection", socket.id);

  socket.on("join", (data) => {
    const userData = {
      id: socket.id,
      username: data,
    };
    users.push(userData);
    console.log("Joined socket", data);
    io.sockets.emit(
      "join",
      users.map((user) => user.username)
    );
  });

  socket.on("chat", (data) => {
    io.sockets.emit("chat", data);
  });

  socket.on("rollDice", (data) => {
    users[data.id].pos = data.pos;
    const turn = data.num != 6 ? (data.id + 1) % users.length : data.id;
    io.sockets.emit("rollDice", data, turn);
  });

  socket.on("restart", () => {
    users = [];
    io.sockets.emit("restart");
  });

  socket.on("disconnect", () => {
    // find user
    const user = users.find((user) => user.id == socket.id);
    if (user) {
      console.log("disconnect ", user.username);
      socket.broadcast.emit("leave", user.username);
    }
    // delete user
    users = users.filter((user) => user.id != socket.id);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
