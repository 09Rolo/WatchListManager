require("dotenv").config();
const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");

const db = require("./db.js")
const app = require("./server.js")



//regisztráció
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;


    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Érvénytelen email formátum", type: "error" });
    }

    // Username and password length validation
    if (username.length < 3 || username.length > 20) {
        return res.status(400).json({ message: "A felhasználónévnek 3 és 20 karakter között kell lennie", type: "error" });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "A jelszónak legalább 6 karakter hosszúnak kell lennie", type: "error" });
    }


    try {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const userRow = await db.query("SELECT * FROM users WHERE email = ?", [email], function (err, result) {
            if (!err) {
                if (result.length == 0) {
                    try {
                        const unamecheck = db.query("SELECT * FROM users WHERE username = ?", [username], function (err, result) {
                            if (!err) {
                                if (result.length == 0) {
                                    //mehet be
                                    const addUser = db.query("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)", [username, email, hashedPassword])

                                    const newUserRow = db.query("SELECT * FROM users WHERE email = ?", [email], function (err, result) {
                                        if (!err) {
                                            if (result.length == 1) {
                                                //oksa, benne van
                                                res.status(201).json({ message: "Sikeres regisztráció!", type: "success", user: result[0] });

                                            } else {
                                                res.status(500).json({ message: "Jelentkezz be!", type: "error", error: "Server speed error?" });
                                            }
                                        }
                                    });
                                } else {
                                    res.status(500).json({ message: "Már létezik ilyen ember", type: "error", error: "Már létezik ilyen ember" });
                                }
                            }
                        })
                    } catch(e) {console.log(e)}
                } else {
                    res.status(500).json({ message: "Már létezik ilyen ember", type: "error", error: "Már létezik ilyen ember" });
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


    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Érvénytelen email formátum", type: "error" });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: "A jelszónak legalább 6 karakter hosszúnak kell lennie", type: "error" });
    }


    try {
        //Check if user exists

        const user = db.query("SELECT * FROM users WHERE email = ?", [email], async function (err, result) {
            if (!err) {
                if (result.length == 0) {
                    res.status(401).json({ message: "Helytelen adatok", type: "error" })
                } else {

                    try {
                        const validPassword = await bcrypt.compare(password, result[0].password_hash);
                        if (!validPassword) {
                            return res.status(401).json({ message: "Helytelen jelszó", type: "error" });
                        }

                        const token = jwt.sign({ user_id: result[0].user_id, username: result[0].username, email: result[0].email }, process.env.SECRET_KEY, { expiresIn: "100h" });
                        res.status(200).json({ message: "Sikeres bejelentkezés", type: "success", token, user_id: result[0].user_id, username: result[0].username, email: result[0].email });
                    } catch(e) {}

                }
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Szerver hiba!", type: "error", error: "Szerver hiba!" });
    }
});



// biztonságosság
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(403).json({ message: "Engedély megtagadva", type: "error" });
    } 

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        req.user = verified;
        next();
    } catch (error) {
        res.status(401).json({ message: "Helytelen token", type: "error" });
    }
};




//verify
app.get("/verify", verifyToken, (req, res) => { //ez viszont kell ez a get
    res.json({ message: `${req.user.username}`, type: "info" });  //ez csak van ha kellene később
});
