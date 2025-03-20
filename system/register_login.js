require("dotenv").config();
const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");

const db = require("./db.js")
const app = require("./server.js")



//regisztráció
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const userRow = await db.query("SELECT * FROM users WHERE email = ?", [email], function (err, result) {
            if (!err) {
                if (result.length == 0) {
                    //mehet be
                    const addUser = db.query("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)", [username, email, hashedPassword])
                    
                    const newUserRow = db.query("SELECT * FROM users WHERE email = ?", [email], function (err, result) {
                        if (!err) {
                            if (result.length == 1) {
                                //oksa, benne van
                                res.status(201).json({ message: "Sikeres regisztráció!", user: result[0] });
                                
                            } else {
                                res.status(500).json({ message: "Jelentkezz be!", error: "Server speed error?" });
                            }
                        }
                    });
                } else {
                    res.status(500).json({ message: "Már létezik ilyen ember", error: "Már létezik ilyen ember" });
                }
            }
        });

    } catch (error) {
        console.error(error);
    }
});




//bejelentkezés
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        //Check if user exists

        const user = db.query("SELECT * FROM users WHERE email = ?", [email], async function (err, result) {
            if (!err) {
                if (result.length == 0) {
                    res.status(401).json({ message: "Helytelen adatok" })
                } else {

                    try {
                        const validPassword = await bcrypt.compare(password, result[0].password_hash);
                        if (!validPassword) {
                            return res.status(401).json({ message: "Helytelen jelszó" });
                        }

                        const token = jwt.sign({ userId: result[0].id }, process.env.SECRET_KEY, { expiresIn: "100h" });
                        res.status(200).json({ message: "Sikeres bejelentkezés", token });
                    } catch(e) {}

                }
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Szerver hiba!", error: "Szerver hiba!" });
    }
});



// biztonságosság
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(403).json({ error: "Engedély megtagadva" });

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        req.user = verified;
        next();
    } catch (error) {
        res.status(401).json({ error: "Helytelen token" });
    }
};



//homepage
app.get("/home", verifyToken, (req, res) => {
    res.json({ message: `Üdvözlet ${req.user.userId}!` });
});
