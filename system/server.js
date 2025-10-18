require('dotenv').config();


process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});


const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const https = require('https');
const http = require('http');


const PORThttp = process.env.PORThttp
const PORThttps = process.env.PORThttps
const winacme_key_path = process.env.winacme_key_path
const winacme_cert_path = process.env.winacme_cert_path
const winacme_ca_path = process.env.winacme_ca_path


app.use(express.static(path.join(__dirname, 'web')));
app.use(express.json());


app.get('/', async(req, res) => {
    res.sendFile(path.join(__dirname, "web", "index.html"));
});



// Paths to your Let’s Encrypt PEM files
const options = {
  	key: fs.readFileSync(winacme_key_path),
  	cert: fs.readFileSync(winacme_cert_path),
  	ca: fs.readFileSync(winacme_ca_path)
};


// HTTPS server on port 443
https.createServer(options, app).listen(PORThttps, () => {
  	console.log(`HTTPS server fut a ${PORThttps} porton`);
});


// HTTP server on port 80 → redirect to HTTPS
http.createServer((req, res) => {
  	const host = req.headers.host;
  	res.writeHead(301, { Location: 'https://' + host + req.url });
  	res.end();
}).listen(PORThttp, () => {
  	console.log(`HTTP redirectel a ${PORThttp} porton a httpsre`);
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

app.get('/watch/*', async(req, res) => { //csomót hagyok, hogyha esetleg kellene :D
  	res.sendFile(path.join(__dirname, "web", "watch.html"));
});

app.get('/admin/:section?', async(req, res) => {//ott hagyom a sectiont hátha kell még valamire :D
  	res.sendFile(path.join(__dirname, "web", "admin.html"));
});
//-------------------------------------------------------




module.exports = app

//indítsa el a többit is
require("./db.js")
require("./userManage.js")
require("./sorozatok_filmek.js")



//A végére kell rakni, eddig azért nem működött

app.use((req, res) => {
  	res.status(404).sendFile(path.join(__dirname, 'web', '404.html'));
})
