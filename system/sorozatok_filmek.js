require("dotenv").config();
const express = require("express")

const db = require("./db.js")
const app = require("./server.js")



app.get("/getAPIinfo", async (req, res) => {
    try {
        const API_KEY = process.env.API_KEY

        res.status(200).json({ message: "API adatok sikeresen lekérve", type: "success", apiKey: API_KEY});
    } catch(e) {
        res.status(401).json({ message: `Hiba: ${e}`, type: "error"})
    }
});
