// Import the class
import { Player } from "./player.js";

let username = "";
let onlinePlayers = [];
// in game data player snake and ladder
let playersData = [];
let gameTurn = 0; // game turn 1,2,3,4,5,6, bakal di mod buat nentuin if giliran karang
let myIndex = 0; // index player ini di list player (playersData);
const socket = io.connect("http://localhost:3000");

/* type chats
  {
    username: string;
    message: string;
  }[]
 */
let chats = [];

// dom input username
const inputUsername = document.getElementById("username");
// dom online player
const onlinePlayerDom = document.getElementById("online-player");
// dom chit-chat
const chatListDom = document.getElementById("chit-chat");
// send chat input
const chatInput = document.getElementById("chat");

const renderOnlinePlayers = () => {
  // render use list of players
  onlinePlayerDom.innerHTML = "";

  // Iterate over the onlinePlayers array
  onlinePlayers.forEach((player, index) => {
    // Create a new list item element for each player
    const playerItem = document.createElement("li");
    playerItem.textContent = `${index + 1}. ${player}`;

    // Append the player item to the online player list
    onlinePlayerDom.appendChild(playerItem);
  });
};

const renderChatPlayers = () => {
  chatListDom.innerHTML = "";

  chats.forEach((chat) => {
    const chatItem = document.createElement("li");
    chatItem.textContent = `${chat.username}: ${chat.message}`;

    chatListDom.appendChild(chatItem);
  });
};

function drawBoard(canvas, context, boardImg) {
  // Calculate the scale factor to fit the image within the canvas
  let scale = Math.min(
    canvas.width / boardImg.width,
    canvas.height / boardImg.height
  );

  // Calculate the new dimensions of the image
  let newWidth = boardImg.width * scale;
  let newHeight = boardImg.height * scale;

  // Calculate the position to center the image on the canvas
  let x = (canvas.width - newWidth) / 2;
  let y = (canvas.height - newHeight) / 2;

  // console.log(x, y, canvas.width, newHeight);
  // Draw the resized image on the canvas
  context.drawImage(boardImg, x, y, newWidth, newHeight);
}

// draw the first board (later di game loop)
let canvas = document.getElementById("game-canvas");
canvas.width = document.documentElement.clientHeight * 0.8; // set ukuran canvas
canvas.height = document.documentElement.clientHeight * 0.8;
// the pencil sir :D
let context = canvas.getContext("2d");
let boardImg = new Image();
let boardType = 1;
boardImg.src = `/images/Boards/Board-${boardType}.png`;
renderOnlinePlayers();
renderChatPlayers();

// dummy buat list player ceritanya
// let playerList = [
//   new Player(0, "dummy1", "/images/Pieces/BluePiece.png", 1),
//   new Player(1, "dummy2", "/images/Pieces/RedPiece.png", 2),
//   new Player(2, "dummy3", "/images/Pieces/GreenPiece.png", 3),
// ];

// GAME MAIN LOOP??
// Set up a timer or animation loop to repeatedly draw the image
function drawImage() {
  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // draw le board
  drawBoard(canvas, context, boardImg);

  // draw le player
  playersData.forEach((player) => {
    // Perform some action for each player
    player.render(canvas, context);
  });

  // Schedule the next frame
  requestAnimationFrame(drawImage);
}

// Start the animation loop
drawImage();

// =============== EVENT LISTENER ===============

// ROLL
let rollButton = document.getElementById("roll-btn");
let selfmsg = document.getElementById("self-msg");
// Add event listener for the "click" event
rollButton.addEventListener("click", function () {
  // Code to be executed when the button is clicked

  // cek turn
  if (gameTurn % playersData.length != myIndex) {
    // bukan giliran sir, break
    return;
  }

  // ooh giliran kite, gas
  let fate = gachaDiceFate();
  selfmsg.textContent = "You just rolled " + fate;
  // bilangan ke server, nanti server nentuin final osisi
  socket.emit("server-playerGerak", myIndex, fate);
});

// READY
let readyButton = document.getElementById("ready-btn");
readyButton.addEventListener("click", function () {
  // disable biar gak bisa ready 2 kali
  readyButton.disabled = true;
  // bilang ke server oh kita ready cuy
  socket.emit("server-test", username);
  console.log("bilangan ke seerver aku ready");
});

// ==================================================

// ===============
// logical window
// ===============

window.joinGame = (e) => {
  e.preventDefault();
  if (inputUsername.value === "") {
    return alert("Username tidak boleh kosong");
  }

  username = inputUsername.value;
  // add event here
  console.log("ngemit si", username);
  socket.emit("server-join", username);

  // delete join button
  document.getElementById("join-button").remove();
  // make disable input
  inputUsername.setAttribute("disabled", true);
};

window.sendMessage = (e) => {
  e.preventDefault();
  if (chatInput.value === "") {
    return;
  }
  socket.emit("chat", { username, message: chatInput.value });
  chatInput.value = "";
};

// ===============
// logical socket
// ===============
socket.on("client-join", (username) => {
  onlinePlayers = username;
  console.log(username, "ini");
  renderOnlinePlayers();
});

socket.on("client-allPlayerReady", (playerList, turn) => {
  gameTurn = turn;

  // cari index ni player
  for (let i = 0; i < playerList.length; i++) {
    const player = playerList[i];
    if (player.name == username) {
      myIndex = i;
    }
    playersData.push(
      new Player(player.id, player.name, player.spritePath, player.pos)
    );
  }

  let gamemsg = document.getElementById("game-msg");
  gamemsg.textContent =
    playersData[gameTurn % playersData.length].name + " turn";
  console.log("semua client udah ready", "ini index", myIndex);
});

socket.on("client-roomIsFull", () => {
  alert("room is currently full sir");
});

socket.on("client-updatePlayerPosTurn", (indexPlayer, finalPosition, turn) => {
  playersData[indexPlayer].pos = finalPosition;
  gameTurn = turn;
  let gamemsg = document.getElementById("game-msg");
  gamemsg.textContent =
    playersData[gameTurn % playersData.length].name + " turn";
  console.log("ok ada yang gerak", turn);
});

socket.on("client-gameover", (pemenang) => {
  let gamemsg = document.getElementById("game-msg");
  gamemsg.textContent = pemenang + " won!!";
  let readyButton = document.getElementById("ready-btn");
  readyButton.disabled = false;
});

socket.on("chat", (chat) => {
  if (username === "") {
    alert("fill username first");
    return;
  }
  chats.push(chat);
  renderChatPlayers();
});
