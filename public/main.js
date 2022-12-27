
const socket = io.connect();
const render = (data) => {
  const hbs = data.map((element, index) => {
    return `<div>
    <em style=color:blue><strong >${element.author} </strong></em>
    <em style=color:green>${element.text}</em>
    </div> `;
  });
  document.getElementById("messages").innerHTML = hbs;
};


// const addMessage=(e) => {
//     const mensaje = {
//         author: document.getElementById('username').value,
//         text: document.getElementById('texto').value
//     };
//     socket.emit('new-message', mensaje);
//     document.getElementById('username').value = ''
//     document.getElementById('texto').value = ''
//     return false;
// }


socket.on("messages", (data) => render(data));