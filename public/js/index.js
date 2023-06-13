// Import the class
import { Player } from "./player.js";

let username = "";
let privateUser = "";
let onlinePlayers = [];
const socket = io.connect("http://localhost:3000");

/* type chats
  {
    username: string;
    message: string;
  }[]
 */
let chats = [];

let privateChats = { privateUser: [] };

// dom input username
const inputUsername = document.getElementById("username");
// dom online player
const onlinePlayerDom = document.getElementById("online-player");
// dom chit-chat
const chatListDom = document.getElementById("chit-chat");
// send chat input
const chatInput = document.getElementById("chat");
// private chat title
const privateChatTitle = document.getElementById("private-chat-title");
// private chat input
const privateChatInput = document.getElementById("private-chat");
// private chat list
const privateChatList = document.getElementById("private-chat-list");
// popup parent
const popup = document.getElementById("pop-up");
// popup message
const popupMessage = document.getElementById("pop-up-message");

const renderOnlinePlayers = () => {
  // render use list of players
  onlinePlayerDom.innerHTML = "";

  // Iterate over the onlinePlayers array
  onlinePlayers.forEach((player, index) => {
    // Create a new list item element for each player
    const playerItem = document.createElement("li");
    playerItem.textContent = `- ${player}`;

    // add class
    playerItem.classList.add("player-list");

    playerItem.addEventListener("click", () => {
      if (player != username) {
        privateUser = player;
        privateChatTitle.textContent = `Private:  ${player}`;
        renderPrivateChat();
      }
    });

    // Append the player item to the online player list
    onlinePlayerDom.appendChild(playerItem);
  });
};

const renderChatPlayers = () => {
  chatListDom.innerHTML = "";

  chats.forEach((chat) => {
    const chatItem = document.createElement("li");
    chatItem.textContent = `${chat.username}: ${chat.message}`;
    // add class
    chatItem.classList.add("chat-list");
    chatListDom.appendChild(chatItem);
  });
};

const renderPrivateChat = () => {
  // remove child privateChatList
  privateChatList.innerHTML = "";

  const currentNeededList = privateChats.privateUser.filter((item) => {
    return item.from == privateUser || item.to == privateUser;
  });

  currentNeededList.forEach((item) => {
    const privateChatItem = document.createElement("li");
    privateChatItem.textContent = `${item.from} - ${item.message}`;

    privateChatItem.classList.add("chat-list");

    privateChatList.appendChild(privateChatItem);
  });
};

const showPopup = (sender) => {
  popup.classList.remove("hide-popup");
  popup.classList.add("show-popup");
  popupMessage.innerHTML = `Message from ${sender}`;
};

const hidePopup = () => {
  popup.classList.remove("show-popup");
  popup.classList.add("hide-popup");
  popupMessage.innerHTML = "";
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

  // harusnya aman, udah ada game loop
});

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
  socket.emit("join", username);

  // delete join button
  document.getElementById("join-button").remove();
  // make disable input
  inputUsername.setAttribute("disabled", true);
};

window.sendPrivateMessage = (e) => {
  e.preventDefault();
  // console.log(privateChatInput.value);

  if (privateChatInput == "" || username == "" || privateUser == "") {
    return;
  }

  socket.emit("private-chat", {
    from: username,
    to: privateUser,
    message: privateChatInput.value,
  });

  privateChats.privateUser.push({
    from: "me",
    to: privateUser,
    message: privateChatInput.value,
  });

  // console.log(privateChats);
  privateChatInput.value = "";
  renderPrivateChat();
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
socket.on("join", (username) => {
  onlinePlayers = username;
  console.log(username);
  renderOnlinePlayers();
});

socket.on("chat", (chat) => {
  if (username === "") {
    alert("fill username first");
    return;
  }
  chats.push(chat);
  renderChatPlayers();
});

socket.on("private-chat", (data) => {
  if (data.to == username) {
    privateChats.privateUser.push(data);
    showPopup(data.from);
    setTimeout(() => {
      hidePopup();
    }, 1000);
  }
  renderPrivateChat();
});
