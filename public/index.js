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

renderOnlinePlayers();
renderChatPlayers();
