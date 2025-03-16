const PORT = 999


const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname)));

app.get('/', async(req, res) => {
    res.sendFile(path.join(__dirname, "/web/index.html"));
});

app.listen(PORT, () => {
  console.log(`Fut, port: ${PORT}`);
});


const db = require('./db.js');