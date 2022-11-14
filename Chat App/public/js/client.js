const socket = io();

var username;
var chats = document.querySelector(".chats");
var users_list = document.querySelector(".users-list");
var users_count = document.querySelector(".user-count");
var msg_send = document.querySelector("#user-send");
var user_msg = document.querySelector("#user-msg");

do {
  username = prompt("enter your name: ");
} while (!username);
/* it will be called user is joined*/
socket.emit("new-user-joined", username);

/* notifying that user is joined*/
socket.on("user-connected", (socket_name) => {
  userJoinLeft(socket_name, "joined");
});
/* function to create joined/left status div*/
function userJoinLeft(name, status) {
  let div = document.createElement("div");
  div.classList.add("user-join");
  let content = `<p><b>${name}</b> ${status} the chat</p>`;
  div.innerHTML = content;
  chats.appendChild(div);
  chats.scrollTop = chats.scrollHeight;
}

/*notify that user has left*/
socket.on("user-disconnected", (user) => {
  userJoinLeft(user, "left");
});
/*for upadting users list and count */
socket.on("user-list", (users) => {
  users_list.innerHTML = "";

  users_arr = Object.values(users);

  for (i = 0; i < users_arr.length; i++) {
    let p = document.createElement("p");
    p.innerText = users_arr[i];
    users_list.appendChild(p);
  }

  //   users_count.innerHTML = users_arr.length;
  //   console.log(users_count);
});
/* for sending messages*/
msg_send.addEventListener("click", () => {
  let data = {
    user: username,
    msg: user_msg.value,
  };
  if (user_msg.value != "") {
    data, "outgoing";
    socket.emit("message", data);

    user_msg.value = "";
  }
});

function appendMessage(data, status) {
  let divo = document.createElement("div");
  divo.classList.add("message", status);
  let content = `
                <h5>${data.user}</h5>
                <p>${data.msg}</p>`;
  divo.innerHTML = content;
  chats.appendChild(divo);

  chats.scrollTop = chats.scrollHeight;
}
socket.on("message", (data) => {
  appendMessage(data, "incoming");
});
