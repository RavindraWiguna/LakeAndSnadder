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

// ngimport player class ( no need ) ada workaround
// import  Player  from "./public/js/player.js";
// const Player = require("./public/js/player.js");

// =================== ONE INSTANCE OF GAME DATA ==========

// Players array
let users = [];
let gameIsStarted = false;
let playerIsReady = {}; // semua ready baru start
let gameTurn = 0; // nyimpen game turn ke 1,2,3,4,5,6,7,8... infinity

// pion sprite path
const globalSpritePaths = [
  "./images/Pieces/BluePiece.png",
  "./images/Pieces/RedPiece.png",
  "./images/Pieces/GreenPiece.png",
  "./images/Pieces/YellowPiece.png",
];

// list of snake and ladder for board 1
let teleporters = {};
//init
for(let i = 0;i<101;i++){
  teleporters[i]=i;
}
//now modify
teleporters[3]=24;
teleporters[12]=46;
teleporters[48]=6;
teleporters[21]=42;
teleporters[56]=75;
teleporters[71]=53;
teleporters[72]=93;
teleporters[97]=43;

// =========================================

io.on("connection", (socket) => {
  console.log("Made socket connection", socket.id);

  socket.on("server-join", (data) => {
    const userData = {
      id: socket.id,
      username: data,
    };

    // ok sementara tak blok dulu yaa kalo udah penuh (4 orang) (BIAR NGEROOM)
    if (users.length == 4) {
      io.socket.emit("client-roomIsFull");
      return;
    }

    // ok buat player
    let newPlayer = {
      id: userData.id,
      name: userData.username,
      username: userData.username,
      spritePath: globalSpritePaths[users.length],
      pos: 1,
    };

    console.log(newPlayer, "ane");
    users.push(newPlayer);

    console.log("Joined socket", data);
    io.sockets.emit(
      "client-join",
      users.map((user) => user.username)
    );
  });

  socket.on("chat", (data) => {
    io.sockets.emit("chat", data);
  });

  // socket.on("rollDice", (data) => {
  //   users[data.id].pos = data.pos;
  //   const turn = data.num != 6 ? (data.id + 1) % users.length : data.id;
  //   io.sockets.emit("rollDice", data, turn);
  // });

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

  // bilang ready dulu, kalo udah > 1 meng baru mulai main this also buat ngirim data kek giliran ke berapa ada berapa player dan lain sebagainya
  socket.on("server-test", (username) => {
    // console.log("WEEEE");
    playerIsReady[username] = true; // set flag di map isready ke true

    // cek apa semua player udah ready
    let totalReady = 0;
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      if (playerIsReady[user.name] === true) {
        totalReady++;
      }
    }
    console.log("a total of", totalReady, "player is ready", gameIsStarted);
    if (totalReady == 4 && !gameIsStarted) {
      // ok all ready
      gameIsStarted = true;
      console.log("ok semua ready");
      io.sockets.emit("client-allPlayerReady", users, gameTurn);
    } else {
      console.log("ok belum semua ready");
    }
  });

  socket.on("server-playerGerak", (indexPlayer, diceRoll) => {
    // nanti sini ada ngecek snake ladder
    // console.log(indexPlayer, diceRoll, 'id, dice');
    let tmpos = users[indexPlayer].pos + diceRoll;
    
    // kelebihan mundur
    if(tmpos > 100){
      tmpos = 200 - tmpos;
    }

    let finalPosition = teleporters[tmpos];

    // update pos di server
    users[indexPlayer].pos = finalPosition;

    // game turn tambah
    gameTurn++;

    // kasi tau server ada posisi baru player sama update game turn
    io.sockets.emit(
      "client-updatePlayerPosTurn",
      indexPlayer,
      finalPosition,
      gameTurn
    );
    console.log(
      indexPlayer,
      "gerak dice",
      finalPosition,
      "jadi karang turn ke",
      gameTurn,
      "dari turn",
      gameTurn - 1
    );
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
