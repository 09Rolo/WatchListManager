require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();


const PORT = process.env.PORT


app.use(express.static(path.join(__dirname, 'web')));

app.use(express.json());

app.get('/', async(req, res) => {
    res.sendFile(path.join(__dirname, "web", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Fut, port: ${PORT}`);
});



module.exports = app

//indítsa el a többit is
require("./db.js")
require("./register_login.js")
