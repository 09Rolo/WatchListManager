require("dotenv").config();
const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const cron = require('node-cron');
const crypto = require('crypto');
const nodemailer = require("nodemailer");

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
    const usernameRegex = /^[a-zA-Z0-9._áéíóöőúüűÁÉÍÓÖŐÚÜŰ]{3,15}$/;
    if (!usernameRegex.test(username)) {
        return res.status(400).json({ message: "A felhasználónévnek 3 és 15 karakter között kell lennie, space nélkül. Illetve csak . és _ használható", type: "error" });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "A jelszónak legalább 6 karakter hosszúnak kell lennie", type: "error" });
    }


    try {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const userRow = db.getConnection().query("SELECT * FROM users WHERE email = ?", [email], function (err, result) {
            if (!err) {
                if (result.length == 0) {
                    try {
                        const unamecheck = db.getConnection().query("SELECT * FROM users WHERE username = ?", [username], function (err, result) {
                            if (!err) {
                                if (result.length == 0) {
                                    //mehet be
                                    const addUser = db.getConnection().query("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)", [username, email, hashedPassword])

                                    const newUserRow = db.getConnection().query("SELECT * FROM users WHERE email = ?", [email], function (err, result) {
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

        const user = db.getConnection().query("SELECT * FROM users WHERE email = ?", [email], async function (err, result) {
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




//get userid
app.post("/getUserID", async (req, res) => {
    const { username } = req.body;

    try {
        const user = db.getConnection().query("SELECT * FROM users WHERE username = ?", [username], async function (err, result) {
            if (!err) {
                if (result.length == 0) {
                    res.status(401).json({ message: "Hiba", type: "error" })
                } else {
                    res.status(200).json({ message: "siker", type: "success", user_id: result[0].user_id });
                }
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Szerver hiba!", type: "error", error: "Szerver hiba!" });
    }
});




//összes user visszamegy
app.get("/getUsers", async (req, res) => {
    try {
        const users = db.getConnection().query("SELECT * FROM users WHERE user_id IS NOT NULL", async function (err, result) {
            if (!err) {
                if (result.length == 0) {
                    res.status(401).json({ message: "Hiba", type: "error" })
                } else {
                    var users = []

                    for (let u in result) {
                        users.push(result[u])
                    }

                    res.status(200).json({ message: "siker", type: "success", users: users });
                }
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Szerver hiba!", type: "error", error: "Szerver hiba!" });
    }
});





//get group
app.post("/getUserGroup", async (req, res) => {
    const { username } = req.body;

    try {
        const user = db.getConnection().query("SELECT * FROM users WHERE username = ?", [username], async function (err, result) {
            if (!err) {
                if (result.length == 0) {
                    res.status(401).json({ message: "Hiba", type: "error" })
                } else {
                    res.status(200).json({ message: "siker", type: "success", group: result[0].group });
                }
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Szerver hiba!", type: "error", error: "Szerver hiba!" });
    }
});




//elfelejtett jelszó visszaállítás cucc
app.post("/recoverPass", async (req, res) => {
    const { email, url } = req.body;


    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Érvénytelen email formátum", type: "error" });
    }



    try {
        //nem lehet duplikált email ezért töröljük le először, de csak ha lejárt már
        const removeIfAlreadyGivenAndExpired = db.getConnection().query("DELETE FROM password_reset_tokens WHERE email = ? AND expires_at < NOW()", [email], function (err, result) {
            if (!err) {
                if (result.affectedRows > 0) {
                    //oksa
                    console.log(`Törölve lett a lejárt token.`);
                }
            } else {
                console.error("Error a token törlésénél:", err);
            }
        });

    } catch(e) {console.error(e)}



    try {
        const userRow = db.getConnection().query("SELECT * FROM users WHERE email = ?", [email], function (err, result) {
            if (!err) {
                if (result.length != 0) {
                    try {
                        const existscheck = db.getConnection().query("SELECT * FROM password_reset_tokens WHERE email = ?", [email], function (err, result) {
                            if (!err) {
                                if (result.length == 0) {
                                    //mehet be
                                    const resetToken = crypto.randomBytes(32).toString('hex');
                                    var expireTime = new Date(Date.now() + 60 * 60 * 1000) //egy óra mulva, csak ms ben kell megadni neki

                                    const addRecover = db.getConnection().query("INSERT INTO password_reset_tokens (email, token, expires_at) VALUES (?, ?, ?)", [email, resetToken, expireTime])
                                
                                    const newUserRow = db.getConnection().query("SELECT * FROM password_reset_tokens WHERE email = ?", [email], function (err, result) {
                                        if (!err) {
                                            if (result.length == 1) {
                                                //oksa, benne van
                                                res.status(201).json({ message: `Elküldtük a(z) ${email} email címre a linket!`, type: "success" });

                                                sendResetEmail(email, resetToken, url)
                                            } else {
                                                res.status(500).json({ message: "Nemsokára elküldjük a linket!", type: "error", error: "Server speed error?" });

                                                sendResetEmail(email, resetToken, url)
                                            }
                                        }
                                    });
                                } else {
                                    res.status(500).json({ message: "Már kaptál egy linket", type: "error", error: "Már van linkje" });
                                }
                            }
                        })
                    } catch(e) {console.log(e)}
                } else {
                    res.status(500).json({ message: "Még nem regisztráltál", type: "error", error: "Még nem is regisztrált" });
                }
            }
        });
    
    } catch (error) {
        console.error(error);
    }
});




app.post("/doRecover", async (req, res) => {
    const { token, newpass, email } = req.body;

    const salt = await bcrypt.genSalt(10);
    const newlyhashedPassword = await bcrypt.hash(newpass, salt);

    //console.log(token, newpass, email)

    try {
        const userRow = db.getConnection().query("SELECT * FROM password_reset_tokens WHERE email = ? AND token = ? AND expires_at > NOW()", [email, token], function (err, result) {
            if (!err) {
                if (result.length != 0) {
                    try {
                        
                        const updatedUserRow = db.getConnection().query("UPDATE users SET password_hash = ? WHERE email = ?", [newlyhashedPassword, email], function (err, result) {
                            if(err) throw err;
                            
                            if (result.affectedRows > 0) {

                                const deleteFromDB = db.getConnection().query("DELETE FROM password_reset_tokens WHERE email = ? AND token = ?", [email, token], function (err, result) {
                                    if (!err) {
                                        if (result.affectedRows > 0) {
                                            //oksa
                                            res.status(201).json({ message: "Sikeresen megváltoztatva. Mostmár bejelentkezhetsz!", type: "success"});
                                        } else {
                                            res.status(500).json({ message: "Hiba", type: "error"});
                                        }
                                    } else {
                                        res.status(500).json({ message: "Hiba", type: "error"});
                                    }
                                });

                            } else {
                                res.status(500).json({ message: "Hiba!", type: "error"});
                            }
                        });

                    } catch(e) {console.log(e)}
                } else {
                    res.status(500).json({ message: "Már nem érvényes a link vagy rossz email címet adtál meg", type: "error", error: "Már nem érvényes a link vagy rossz email" });
                }
            }
        });
    
    } catch (error) {
        console.error(error);
    }
});



async function sendResetEmail(to, token, url) {
    const transporter = nodemailer.createTransport({
        service: "gmail", // or 'hotmail', etc.
        auth: {
            user: "info.watchlistmanager@gmail.com",
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: '"Watch List Manager" <info.watchlistmanager@gmail.com>',
        to: to,
        subject: "Jelszó visszaállítás",
        html: `<p>Ezen a linken visszaállíthatod a jelszavadat:</p>
            <a href="${url}/auth/recover?token=${token}">Jelszó visszaállítása</a>`
    };

    await transporter.sendMail(mailOptions);
    console.log("Reset email elküldve neki: ", to);
}



cron.schedule('0 0 * * *', async () => {
    console.log("⏰ Token törlések folyamatban...");

    try {
        const deleteFromDB = db.getConnection().query("DELETE FROM password_reset_tokens WHERE expires_at < NOW()", [], function (err, result) {
            if (!err) {
                console.log(`🧹 Törölve lett ${result.affectedRows} lejárt token.`);
            } else {
                console.error("❌ Error a tokenek törlésénél:", err);
            }
        });
    } catch (err) {
        console.error("❌ Error a tokenek törlésénél:", err);
    }
});

