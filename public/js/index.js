// Import the class
import { Player } from "./player.js";

let username = "";
let onlinePlayers = ["avin", "rama", "rere"];

/* type chats
  {
    username: string;
    message: string;
  }[]
 */
let chats = [
  {
    username: "rama",
    message: "hello world",
    time: new Date().getTime(),
  },
  {
    username: "avin",
    message: "hello world",
    time: new Date().getTime(),
  },
  {
    username: "rere",
    message: "yeyeye",
    time: new Date().getTime(),
  },
];

// dom input username
const inputUsername = document.getElementById("username");
// dom online player
const onlinePlayerDom = document.getElementById("online-player");
// dom chit-chat
const chatDom = document.getElementById("chit-chat");

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
  chatDom.innerHTML = "";

  chats.forEach((chat) => {
    const chatItem = document.createElement("li");
    chatItem.textContent = `${chat.username}: ${chat.message}`;

    chatDom.appendChild(chatItem);
  });
};

const joinGame = (e) => {
  e.preventDefault();
  if (inputUsername.value === "") {
    return alert("Username tidak boleh kosong");
  }

  username = inputUsername.value;
  // add event here

  // delete join button
  document.getElementById("join-button").remove();
  // make disable input
  inputUsername.setAttribute("disabled", true);
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

// ni nyoba elemen gameplay outside of socket socketan

// dummy buat list player ceritanya
let playerList = [
  new Player(0, "dummy1", "/images/Pieces/BluePiece.png", 1),
  new Player(1, "dummy2", "/images/Pieces/RedPiece.png", 2),
  new Player(2, "dummy3", "/images/Pieces/GreenPiece.png", 3),
];

// GAME MAIN LOOP??

// Set up a timer or animation loop to repeatedly draw the image
function drawImage() {
  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // draw le board
  drawBoard(canvas, context, boardImg);

  // draw le player
  playerList.forEach((player) => {
    // Perform some action for each player
    player.render(canvas, context);
  });

  // Schedule the next frame
  requestAnimationFrame(drawImage);
}

// Start the animation loop
drawImage();

// coba meng main
let rollButton = document.getElementById("roll-btn");
let thisClientIndex = 1; // misal aja
// Add event listener for the "click" event
rollButton.addEventListener("click", function () {
  // Code to be executed when the button is clicked
  let fate = gachaDiceFate();
  playerList[thisClientIndex].pos += fate;

  // add logic ngecek tile ada snake or ladder

  // clear canvas board
  canvas.clear;
  drawBoard(canvas, context, boardImg);

  // render all player
  playerList.forEach((player) => {
    // Perform some action for each player
    player.render(canvas, context);
  });
});
