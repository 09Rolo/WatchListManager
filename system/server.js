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




//-------------------------------------------------------mutogás :D
app.get('/auth/:section?', async(req, res) => {
  res.sendFile(path.join(__dirname, "web", "auth.html"));
});

app.get('/sorozatok/:section?', async(req, res) => {
  res.sendFile(path.join(__dirname, "web", "sorozatok.html"));
});

app.get('/filmek/:section?', async(req, res) => {
  res.sendFile(path.join(__dirname, "web", "filmek.html"));
});

app.get('/film/:section?/:section?', async(req, res) => {
  res.sendFile(path.join(__dirname, "web", "film.html"));
});

app.get('/sorozat/:section?/:section?', async(req, res) => {
  res.sendFile(path.join(__dirname, "web", "sorozat.html"));
});

app.get('/u/:section?/:section?', async(req, res) => {
  res.sendFile(path.join(__dirname, "web", "user.html"));
});
//-------------------------------------------------------




module.exports = app

//indítsa el a többit is
require("./db.js")
require("./register_login.js")
require("./sorozatok_filmek.js")
