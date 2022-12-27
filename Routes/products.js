const express = require("express");
const Container = require('../class');
const fs = require("fs");
const validateBody = require("../middlewares/validateBody");
const moment=require("moment");
const router = express.Router();

const productFile = new Container('files/products.txt');
const messageFile = new Container('files/messages.txt');

router.use((req, res, next) => {
  console.log("Time: ", Date());
  next();
});

router.get("/products", async (req, res) => {
  let allProducts = await fs.promises.readFile(productFile.fileName, "utf-8");
  allProducts = JSON.parse(allProducts);
  const context = {
    allProducts,
    printProducts: true,
  };

  res.render("index", context);
});

router.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  let products = await fs.promises.readFile(productFile.fileName, "utf-8");
  products = JSON.parse(products);
  if (id > products.length) {
    res.status(404).send({ error: 'producto no encontrado' });
  }
  else {
    res.status(200).send({ product: products.find((product) => product.id == id) });
  }
});

router.post("/products", express.json(), validateBody, async (req, res) => {
  try {
    const { title, price, thumbnail} = req.body;
    let newProduct = {};
    let products = await fs.promises.readFile(productFile.fileName, "utf-8");
    products = JSON.parse(products);
    let id = products.length + 1;
    newProduct = {
      "title": title,
      "price": price,
      "thumbnail": thumbnail,
      "id": id
    }
    products.push(newProduct);
    await fs.promises.writeFile(productFile.fileName, JSON.stringify(products));
    
    res.redirect("/");
  } catch (error) {
    return res.status(404).send({ error: error.message });
  }
});

router.post("/messages", express.json(), validateBody, async (req, res) => {
  try {
    const { email, texto } = req.body;
    let newMessage = {};
    let messages = await fs.promises.readFile(messageFile.fileName, "utf-8");
    messages = JSON.parse(messages);
    const time= moment().format('lll');;
    newMessage = {
      author: email,
      time,
      text: texto
    }
    messages.push(newMessage);
    await fs.promises.writeFile(messageFile.fileName, JSON.stringify(messages));
    res.redirect("/");
  } catch (error) {
    return res.status(404).send({ error: error.message });
  }
})

router.put("/products/:id", validateBody, async (req, res) => {
  try {
    let { id } = req.params;
    id = parseInt(id);
    const { title, price, thumbnail } = req.body;
    let products = await fs.promises.readFile(productFile.fileName, "utf-8");
    products = JSON.parse(products);
    if (id > products.length) {
      res.status(404).send({ error: 'producto no encontrado' });
    }
    else {
      let productoActualizado = {};
      products.find((product) => {
        if (product.id === id) {
          productoActualizado = {
            title: title,
            price: price,
            thumbnail: thumbnail,
            id: id
          }
        }
      });
      products.splice(id - 1, 1)
      products.push(productoActualizado);
      await fs.promises.writeFile(productFile.fileName, JSON.stringify(products));
      res.status(200).send({ product: productoActualizado });
    }
  }
  catch (error) {
    return res.status(404).send({ error: error.message });
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    let { id } = req.params;
    id = parseInt(id);
    let products = await fs.promises.readFile(productFile.fileName, "utf-8");
    products = JSON.parse(products);
    if (id > products.length) {
      res.status(404).send({ error: 'producto no encontrado' });
    }
    else {
      products.splice(id - 1, 1);
      console.log(products);
      await fs.promises.writeFile(productFile.fileName, JSON.stringify(products));
      res.status(200).send(`El producto con id ${id} fue eliminado del inventario`);
    }
  }
  catch (error) {
    return res.status(404).send({ error: error.message });
  }

});


module.exports = router;