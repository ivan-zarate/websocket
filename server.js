const express = require("express");
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const exphbs = require("express-handlebars");

const path=require("path");

const router = require("./Routes/products");
app.use(express.json());
app.use(express.urlencoded({extended:true}));


const port = 8080;

app.use(express.static("public"));
app.use('/api', router)

//Handlebars
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine({
  layoutsDir: app.get('views')+ '/layouts',
  partialsDir: app.get('views')+ '/partials',
  extname: '.hbs'
}))


app.set('view engine', 'hbs');

let allProducts=[{}];

app.get("/", (req, res) => {
  const context={
    title: "Producto",
    price: "Precio",
    thumbnail:"imagen",
    allProducts,
    printProducts:false
}
 
res.render("index", context);
});

const messages = [
  {
    author: "Juan",
    text: "Hola que tal?",
  },
  {
    author: "Pedro",
    text: "Muy bien y vos?",
  },
  {
    author: "Ana",
    text: "Genial!!!",
  },
];

io.on("connection", (socket) => {
  console.log("usuario conectado " + socket.id);
  socket.emit("messages", messages);
  socket.on("new-message", (data) => {
    messages.push(data);
    io.emit("messages", messages);
  });
});

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    console.log(socket.id);
    console.warn("chat message", msg);
    io.emit("chat message", msg);
  });
});

const server = http.listen(port, () => {
  console.log(`Escuchando app en el puerto ${server.address().port}`);
});

module.exports = io;