require("dotenv").config();
const express = require("express")
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const db = require("./db.js")
const app = require("./server.js")



app.get("/getAPIinfo", async (req, res) => {
    try {
        const API_KEY = process.env.API_KEY
        const GOOGLE_API = process.env.GOOGLE_API

        res.status(200).json({ message: "API adatok sikeresen lekérve", type: "success", apiKey: API_KEY, googleAPI: GOOGLE_API});
    } catch(e) {
        res.status(401).json({ message: `Hiba: ${e}`, type: "error"})
    }
});




//Wishlist
app.post("/addWishlist", async (req, res) => {
    const { user_id, media_id, media_type } = req.body;

    if (media_type == "movie") {
        try {

            const watchedbeUser = db.query("SELECT * FROM user_watched_movies WHERE user_id = ? AND movie_id = ?", [user_id, media_id], function (err, result) {
                if (!err) {
                    if (result.length == 0) {
                        //oksa, nincs benne a watchedben
                        try {
                            const wishlistbeUser = db.query("SELECT * FROM user_wishlist WHERE user_id = ? AND movie_id = ?", [user_id, media_id], function (err, result) {
                                if (!err) {
                                    if (result.length == 0) {
                                        //oksa, nincs benne már alapból, szóval most mehet bele
    
                                        try {
                                            const addUser = db.query("INSERT INTO user_wishlist (user_id, movie_id) VALUES (?, ?)", [user_id, media_id])
                        
                                            const newUserRow = db.query("SELECT * FROM user_wishlist WHERE user_id = ? AND movie_id = ?", [user_id, media_id], function (err, result) {
                                                if (!err) {
                                                    if (result.length == 1) {
                                                        //oksa, benne van
                                                        res.status(201).json({ message: "Sikeresen hozzáadva", type: "success"});
                                                    } else {
                                                        res.status(500).json({ message: "Hiba", type: "error"});
                                                    }
                                                } else {
                                                    res.status(500).json({ message: "Hiba", type: "error"});
                                                }
                                            });
                                        } catch(e) {console.log(e)}
                                    } else {
                                        res.status(500).json({ message: "Már benne van a kívánságlistádban", type: "error"});
                                    }
                                } else {
                                    res.status(500).json({ message: "Hiba", type: "error"});
                                }
                            });
                        } catch(e) {console.log(e)}
                        
                    } else {
                        res.status(500).json({ message: "Már láttad ezt a filmet", type: "error"});
                    }
                }
            });

        } catch (error) {
            console.error(error);
        }
    }

    
    if (media_type == "tv") {
        try {

            const watchedbeUser = db.query("SELECT * FROM user_watched_episodes WHERE user_id = ? AND series_id = ?", [user_id, media_id], function (err, result) {
                if (!err) {
                    if (result.length == 0) {
                        //oksa, nincs benne a watchedben
                        try {
                            const wishlistbeUser = db.query("SELECT * FROM user_wishlist WHERE user_id = ? AND series_id = ?", [user_id, media_id], function (err, result) {
                                if (!err) {
                                    if (result.length == 0) {
                                        //oksa, nincs benne már alapból, szóval most mehet bele
    
                                        try {
                                            const addUser = db.query("INSERT INTO user_wishlist (user_id, series_id) VALUES (?, ?)", [user_id, media_id])
                        
                                            const newUserRow = db.query("SELECT * FROM user_wishlist WHERE user_id = ? AND series_id = ?", [user_id, media_id], function (err, result) {
                                                if (!err) {
                                                    if (result.length == 1) {
                                                        //oksa, benne van
                                                        res.status(201).json({ message: "Sikeresen hozzáadva", type: "success"});
                                                    } else {
                                                        res.status(500).json({ message: "Hiba", type: "error"});
                                                    }
                                                } else {
                                                    res.status(500).json({ message: "Hiba", type: "error"});
                                                }
                                            });
                                        } catch(e) {console.log(e)}
                                    } else {
                                        res.status(500).json({ message: "Már benne van a kívánságlistádban", type: "error"});
                                    }
                                } else {
                                    res.status(500).json({ message: "Hiba", type: "error"});
                                }
                            });
                        } catch(e) {console.log(e)}
                        
                    } else {
                        res.status(500).json({ message: "Már elkezdted nézni ezt a sorozatot", type: "error"});
                    }
                }
            });

        } catch (error) {
            console.error(error);
        }
    }

});




app.post("/removeWishlist", async (req, res) => {
    const { user_id, media_id, media_type } = req.body;

    if (media_type == "movie") {
        try {
            const wishlistbeUser = db.query("SELECT * FROM user_wishlist WHERE user_id = ? AND movie_id = ?", [user_id, media_id], function (err, result) {
                if (!err) {
                    if (result.length != 0) {
                        //oksa, benne van
                        
                        try {
                            const deleteFromWishlist = db.query("DELETE FROM user_wishlist WHERE user_id = ? AND movie_id = ?", [user_id, media_id], function (err, result) {
                                if (!err) {
                                    if (result.affectedRows > 0) {
                                        //oksa
                                        res.status(201).json({ message: "Sikeresen törölve", type: "success"});
                                    } else {
                                        res.status(500).json({ message: "Sikertelen törlés", type: "error"});
                                    }
                                } else {
                                    res.status(500).json({ message: "Hiba", type: "error"});
                                }
                            });
                        } catch(e) {console.log(e)}
                    } else {
                        res.status(500).json({ message: "Nincs benne a kívánságlistában", type: "error"});
                    }
                } else {
                    res.status(500).json({ message: "Hiba", type: "error"});
                }
            });              
        } catch (error) {
            console.error(error);
        }
    }


    if (media_type == "tv") {
        try {
            const wishlistbeUser = db.query("SELECT * FROM user_wishlist WHERE user_id = ? AND series_id = ?", [user_id, media_id], function (err, result) {
                if (!err) {
                    if (result.length != 0) {
                        //oksa, benne van
                        
                        try {
                            const deleteFromWishlist = db.query("DELETE FROM user_wishlist WHERE user_id = ? AND series_id = ?", [user_id, media_id], function (err, result) {
                                if (!err) {
                                    if (result.affectedRows > 0) {
                                        //oksa
                                        res.status(201).json({ message: "Sikeresen törölve", type: "success"});
                                    } else {
                                        res.status(500).json({ message: "Sikertelen törlés", type: "error"});
                                    }
                                } else {
                                    res.status(500).json({ message: "Hiba", type: "error"});
                                }
                            });
                        } catch(e) {console.log(e)}
                    } else {
                        res.status(500).json({ message: "Nincs benne a kívánságlistában", type: "error"});
                    }
                } else {
                    res.status(500).json({ message: "Hiba", type: "error"});
                }
            });              
        } catch (error) {
            console.error(error);
        }
    }

});




app.post("/getWishlist", async (req, res) => {
    const {user_id, tipus} = req.body

    if(tipus == "movie") {
        try {
            const wishlistbeUser = db.query("SELECT * FROM user_wishlist WHERE user_id = ? AND movie_id IS NOT NULL", [user_id], function (err, result) {
                if (!err) {
                    if (result.length != 0) {
                        //oksa benne van legalább 1

                        var dataVissza = []

                        for(i in result) {
                            dataVissza.push({
                                media_id: result[i].movie_id,
                                added_at: result[i].added_at
                            })
                        }

                        res.status(200).json({ dataVissza });
                    } else {
                        res.status(401).json({ message: "Nincs a kívánságlistán semmi", type: "error"})
                    }
                } else {
                    res.status(401).json({ message: "Hiba", type: "error"})
                }
            });
        } catch(e) {
            res.status(401).json({ message: `Hiba: ${e}`, type: "error"})
        }
    }


    if(tipus == "tv") {
        try {
            const wishlistbeUser = db.query("SELECT * FROM user_wishlist WHERE user_id = ? AND series_id IS NOT NULL", [user_id], function (err, result) {
                if (!err) {
                    if (result.length != 0) {
                        //oksa benne van legalább 1

                        var dataVissza = []

                        for(i in result) {
                            dataVissza.push({
                                media_id: result[i].series_id,
                                added_at: result[i].added_at
                            })
                        }

                        res.status(200).json({ dataVissza });
                    } else {
                        res.status(401).json({ message: "Nincs a kívánságlistán semmi", type: "error"})
                    }
                } else {
                    res.status(401).json({ message: "Hiba", type: "error"})
                }
            });
        } catch(e) {
            res.status(401).json({ message: `Hiba: ${e}`, type: "error"})
        }
    }
});










//Watched
app.post("/addWatched", async (req, res) => {
    const { user_id, media_id, media_type, ep_id } = req.body;

    if (media_type == "movie") {
        try {

            const wishlistbeUser = db.query("SELECT * FROM user_wishlist WHERE user_id = ? AND movie_id = ?", [user_id, media_id], function (err, result) {
                if (!err) {
                    if (result.length == 0) {
                        //oksa, nincs benne a wishlistben
                        try {
                            const watchlistbeUser = db.query("SELECT * FROM user_watched_movies WHERE user_id = ? AND movie_id = ?", [user_id, media_id], function (err, result) {
                                if (!err) {
                                    if (result.length == 0) {
                                        //oksa, nincs benne már alapból, szóval most mehet bele
    
                                        try {
                                            const addUser = db.query("INSERT INTO user_watched_movies (user_id, movie_id) VALUES (?, ?)", [user_id, media_id])
                        
                                            const newUserRow = db.query("SELECT * FROM user_watched_movies WHERE user_id = ? AND movie_id = ?", [user_id, media_id], function (err, result) {
                                                if (!err) {
                                                    if (result.length == 1) {
                                                        //oksa, benne van
                                                        res.status(201).json({ message: "Sikeresen hozzáadva", type: "success"});
                                                    } else {
                                                        res.status(500).json({ message: "Hiba", type: "error"});
                                                    }
                                                } else {
                                                    res.status(500).json({ message: "Hiba", type: "error"});
                                                }
                                            });
                                        } catch(e) {console.log(e)}
                                    } else {
                                        res.status(500).json({ message: "Már benne van a megnézett listában", type: "error"});
                                    }
                                } else {
                                    res.status(500).json({ message: "Hiba", type: "error"});
                                }
                            });
                        } catch(e) {console.log(e)}
                        
                    } else {
                        
                        try {
                            const deleteFromWishlist = db.query("DELETE FROM user_wishlist WHERE user_id = ? AND movie_id = ?", [user_id, media_id], function (err, result) {
                                if (!err) {
                                    if (result.affectedRows > 0) {
                                        //oksa
                                        try {
                                            const addUser = db.query("INSERT INTO user_watched_movies (user_id, movie_id) VALUES (?, ?)", [user_id, media_id])
                        
                                            const newUserRow = db.query("SELECT * FROM user_watched_movies WHERE user_id = ? AND movie_id = ?", [user_id, media_id], function (err, result) {
                                                if (!err) {
                                                    if (result.length == 1) {
                                                        //oksa, benne van
                                                        res.status(201).json({ message: "Sikeresen hozzáadva", type: "success"});
                                                    } else {
                                                        res.status(500).json({ message: "Hiba", type: "error"});
                                                    }
                                                } else {
                                                    res.status(500).json({ message: "Hiba", type: "error"});
                                                }
                                            });
                                        } catch(e) {console.log(e)}
                                    } else {
                                        res.status(500).json({ message: "Sikertelen törlés a kívánságlistából", type: "error"});
                                    }
                                } else {
                                    res.status(500).json({ message: "Hiba", type: "error"});
                                }
                            });
                        } catch(e) {console.log(e)}

                    }
                }
            });

        } catch (error) {
            console.error(error);
        }
    }



    if (media_type == "tv") {
        try {

            const wishlistbeUser = db.query("SELECT * FROM user_wishlist WHERE user_id = ? AND series_id = ?", [user_id, media_id], function (err, result) {
                if (!err) {
                    if (result.length == 0) {
                        //oksa, nincs benne a wishlistben
                        try {
                            const watchlistbeUser = db.query("SELECT * FROM user_watched_episodes WHERE user_id = ? AND episode_id = ?", [user_id, ep_id], function (err, result) {
                                if (!err) {
                                    if (result.length == 0) {
                                        //oksa, nincs benne már alapból, szóval most mehet bele
    
                                        try {
                                            const addUser = db.query("INSERT INTO user_watched_episodes (user_id, series_id, episode_id) VALUES (?, ?, ?)", [user_id, media_id, ep_id])
                        
                                            const newUserRow = db.query("SELECT * FROM user_watched_episodes WHERE user_id = ? AND episode_id = ?", [user_id, ep_id], function (err, result) {
                                                if (!err) {
                                                    if (result.length == 1) {
                                                        //oksa, benne van
                                                        res.status(201).json({ message: "Sikeresen hozzáadva", type: "success"});
                                                    } else {
                                                        res.status(500).json({ message: "Hiba", type: "error"});
                                                    }
                                                } else {
                                                    res.status(500).json({ message: "Hiba", type: "error"});
                                                }
                                            });
                                        } catch(e) {console.log(e)}
                                    } else {
                                        res.status(500).json({ message: "Már benne van a megnézett listában", type: "error"});
                                    }
                                } else {
                                    res.status(500).json({ message: "Hiba", type: "error"});
                                }
                            });
                        } catch(e) {console.log(e)}
                        
                    } else {
                        
                        try {
                            const deleteFromWishlist = db.query("DELETE FROM user_wishlist WHERE user_id = ? AND series_id = ?", [user_id, media_id], function (err, result) {
                                if (!err) {
                                    if (result.affectedRows > 0) {
                                        //oksa
                                        try {
                                            const addUser = db.query("INSERT INTO user_watched_episodes (user_id, series_id, episode_id) VALUES (?, ?, ?)", [user_id, media_id, ep_id])
                        
                                            const newUserRow = db.query("SELECT * FROM user_watched_episodes WHERE user_id = ? AND episode_id = ?", [user_id, ep_id], function (err, result) {
                                                if (!err) {
                                                    if (result.length == 1) {
                                                        //oksa, benne van
                                                        res.status(201).json({ message: "Sikeresen hozzáadva", type: "success"});
                                                    } else {
                                                        res.status(500).json({ message: "Hiba", type: "error"});
                                                    }
                                                } else {
                                                    res.status(500).json({ message: "Hiba", type: "error"});
                                                }
                                            });
                                        } catch(e) {console.log(e)}
                                    } else {
                                        res.status(500).json({ message: "Sikertelen törlés a kívánságlistából", type: "error"});
                                    }
                                } else {
                                    res.status(500).json({ message: "Hiba", type: "error"});
                                }
                            });
                        } catch(e) {console.log(e)}

                    }
                }
            });

        } catch (error) {
            console.error(error);
        }
    }

});




app.post("/removeWatched", async (req, res) => {
    const { user_id, media_id, media_type, ep_id } = req.body;

    if (media_type == "movie") {
        try {
            const wachedbeUser = db.query("SELECT * FROM user_watched_movies WHERE user_id = ? AND movie_id = ?", [user_id, media_id], function (err, result) {
                if (!err) {
                    if (result.length != 0) {
                        //oksa, benne van
                        
                        try {
                            const deleteFromWatched = db.query("DELETE FROM user_watched_movies WHERE user_id = ? AND movie_id = ?", [user_id, media_id], function (err, result) {
                                if (!err) {
                                    if (result.affectedRows > 0) {
                                        //oksa
                                        res.status(201).json({ message: "Sikeresen törölve", type: "success"});
                                    } else {
                                        res.status(500).json({ message: "Sikertelen törlés", type: "error"});
                                    }
                                } else {
                                    res.status(500).json({ message: "Hiba", type: "error"});
                                }
                            });
                        } catch(e) {console.log(e)}
                    } else {
                        res.status(500).json({ message: "Nincs benne a megnézett listában", type: "error"});
                    }
                } else {
                    res.status(500).json({ message: "Hiba", type: "error"});
                }
            });              
        } catch (error) {
            console.error(error);
        }
    }



    if (media_type == "tv") {
        try {
            const wachedbeUser = db.query("SELECT * FROM user_watched_episodes WHERE user_id = ? AND episode_id = ?", [user_id, ep_id], function (err, result) {
                if (!err) {
                    if (result.length != 0) {
                        //oksa, benne van
                        
                        try {
                            const deleteFromWatched = db.query("DELETE FROM user_watched_episodes WHERE user_id = ? AND episode_id = ?", [user_id, ep_id], function (err, result) {
                                if (!err) {
                                    if (result.affectedRows > 0) {
                                        //oksa
                                        res.status(201).json({ message: "Sikeresen törölve", type: "success"});
                                    } else {
                                        res.status(500).json({ message: "Sikertelen törlés", type: "error"});
                                    }
                                } else {
                                    res.status(500).json({ message: "Hiba", type: "error"});
                                }
                            });
                        } catch(e) {console.log(e)}
                    } else {
                        res.status(500).json({ message: "Nincs benne a megnézett listában", type: "error"});
                    }
                } else {
                    res.status(500).json({ message: "Hiba", type: "error"});
                }
            });              
        } catch (error) {
            console.error(error);
        }
    }

});




app.post("/getWatched", async (req, res) => {
    const {user_id, tipus} = req.body

    if(tipus == "movie") {
        try {
            const watchedbeUser = db.query("SELECT * FROM user_watched_movies WHERE user_id = ? AND movie_id IS NOT NULL", [user_id], function (err, result) {
                if (!err) {
                    if (result.length != 0) {
                        //oksa benne van legalább 1

                        var dataVissza = []

                        for(i in result) {
                            dataVissza.push({
                                media_id: result[i].movie_id,
                                added_at: result[i].watched_at
                            })
                        }

                        res.status(200).json({ dataVissza });
                    } else {
                        res.status(401).json({ message: "Nincs a megnézettek között semmi", type: "error"})
                    }
                } else {
                    res.status(401).json({ message: "Hiba", type: "error"})
                }
            });
        } catch(e) {
            res.status(401).json({ message: `Hiba: ${e}`, type: "error"})
        }
    }


    if(tipus == "tv") {
        try {
            const watchedbeUser = db.query("SELECT * FROM user_watched_episodes WHERE user_id = ? AND series_id IS NOT NULL", [user_id], function (err, result) {
                if (!err) {
                    if (result.length != 0) {
                        //oksa benne van legalább 1

                        var dataVissza = []

                        for(i in result) {
                            dataVissza.push({
                                media_id: result[i].series_id,
                                episode_id: result[i].episode_id,
                                added_at: result[i].watched_at
                            })
                        }

                        res.status(200).json({ dataVissza });
                    } else {
                        res.status(401).json({ message: "Nincs a megnézettek között semmi", type: "error"})
                    }
                } else {
                    res.status(401).json({ message: "Hiba", type: "error"})
                }
            });
        } catch(e) {
            res.status(401).json({ message: `Hiba: ${e}`, type: "error"})
        }
    }
});






//---------------------------------------------------------------------------Linkek------------------------------

app.post("/changeLink", async (req, res) => {
    const { user_id, media_id, media_type, link_url } = req.body;

    if (media_type == "movie") {
        try {

            const linkekbeUser = db.query("SELECT * FROM user_links WHERE user_id = ? AND movie_id = ?", [user_id, media_id], function (err, result) {
                if (!err) {
                    if (result.length == 0) {
                        if (link_url.length > 0) {//írt valamit egyáltalán
                            //oksa, nincs benne a linkekbe, mehet bele
    
                            try {
                                const addUser = db.query("INSERT INTO user_links (user_id, movie_id, link_url) VALUES (?, ?, ?)", [user_id, media_id, link_url])
                            
                                const newUserRow = db.query("SELECT * FROM user_links WHERE user_id = ? AND movie_id = ?", [user_id, media_id], function (err, result) {
                                    if (!err) {
                                        if (result.length == 1) {
                                            //oksa, benne van
                                            res.status(201).json({ message: "Sikeresen hozzáadva", type: "success"});
                                        } else {
                                            res.status(500).json({ message: "Hiba", type: "error"});
                                        }
                                    } else {
                                        res.status(500).json({ message: "Hiba", type: "error"});
                                    }
                                });
                            } catch(e) {console.log(e)}
                        }
                    } else {
                        //UPDATE vagy DELETE ha már van

                        if (link_url.length > 0) { //UPDATE
                            try {

                                const updatedUserRow = db.query("UPDATE user_links SET link_url = ? WHERE user_id = ? AND movie_id = ?", [link_url, user_id, media_id], function (err, result) {
                                    if(err) throw err;

                                    if (result.affectedRows > 0) {
                                        res.status(201).json({ message: "Sikeresen megváltoztatva", type: "success"});
                                    } else {
                                        res.status(500).json({ message: "Hiba", type: "error"});
                                    }
                                });

                            } catch(e) {console.log(e)}

                        } else { //DELETE
                            try {
                                const deleteFromLinks = db.query("DELETE FROM user_links WHERE user_id = ? AND movie_id = ?", [user_id, media_id], function (err, result) {
                                    if (!err) {
                                        if (result.affectedRows > 0) {
                                            //oksa
                                            res.status(201).json({ message: "Sikeresen törölve", type: "success"});
                                        } else {
                                            res.status(500).json({ message: "Sikertelen törlés", type: "error"});
                                        }
                                    } else {
                                        res.status(500).json({ message: "Hiba", type: "error"});
                                    }
                                });
                            } catch(e) {console.log(e)}
                        }
                    }
                }
            });

        } catch (error) {
            console.error(error);
        }
    }



    if (media_type == "tv") {
        try {

            const linkekbeUser = db.query("SELECT * FROM user_links WHERE user_id = ? AND series_id = ?", [user_id, media_id], function (err, result) {
                if (!err) {
                    if (result.length == 0) {
                        //oksa, nincs benne a linkekbe, mehet bele

                        if (link_url.length > 0) {
                            try {
                                const addUser = db.query("INSERT INTO user_links (user_id, series_id, link_url) VALUES (?, ?, ?)", [user_id, media_id, link_url])
                            
                                const newUserRow = db.query("SELECT * FROM user_links WHERE user_id = ? AND series_id = ?", [user_id, media_id], function (err, result) {
                                    if (!err) {
                                        if (result.length == 1) {
                                            //oksa, benne van
                                            res.status(201).json({ message: "Sikeresen hozzáadva", type: "success"});
                                        } else {
                                            res.status(500).json({ message: "Hiba", type: "error"});
                                        }
                                    } else {
                                        res.status(500).json({ message: "Hiba", type: "error"});
                                    }
                                });
                            } catch(e) {console.log(e)}
                        }
                    } else {
                        //UPDATE vagy DELETE ha már van

                        if (link_url.length > 0) { //UPDATE
                            try {

                                const updatedUserRow = db.query("UPDATE user_links SET link_url = ? WHERE user_id = ? AND series_id = ?", [link_url, user_id, media_id], function (err, result) {
                                    if(err) throw err;

                                    if (result.affectedRows > 0) {
                                        res.status(201).json({ message: "Sikeresen megváltoztatva", type: "success"});
                                    } else {
                                        res.status(500).json({ message: "Hiba", type: "error"});
                                    }
                                });

                            } catch(e) {console.log(e)}

                        } else { //Delete
                            try {
                                const deleteFromLinks = db.query("DELETE FROM user_links WHERE user_id = ? AND series_id = ?", [user_id, media_id], function (err, result) {
                                    if (!err) {
                                        if (result.affectedRows > 0) {
                                            //oksa
                                            res.status(201).json({ message: "Sikeresen törölve", type: "success"});
                                        } else {
                                            res.status(500).json({ message: "Sikertelen törlés", type: "error"});
                                        }
                                    } else {
                                        res.status(500).json({ message: "Hiba", type: "error"});
                                    }
                                });
                            } catch(e) {console.log(e)}
                        }
                    }
                }
            });

        } catch (error) {
            console.error(error);
        }
    }

});




app.post("/getLinks", async (req, res) => {
    const {user_id, tipus} = req.body

    if(tipus == "movie") {
        try {
            const linkekbeUser = db.query("SELECT * FROM user_links WHERE user_id = ? AND movie_id IS NOT NULL", [user_id], function (err, result) {
                if (!err) {
                    if (result.length != 0) {
                        //oksa benne van legalább 1

                        var dataVissza = []

                        for(i in result) {
                            dataVissza.push({
                                media_id: result[i].movie_id,
                                added_at: result[i].added_at,
                                link_url: result[i].link_url
                            })
                        }

                        res.status(200).json({ dataVissza });
                    } else {
                        res.status(401).json({ message: "Nincs a linkek között semmi", type: "error"})
                    }
                } else {
                    res.status(401).json({ message: "Hiba", type: "error"})
                }
            });
        } catch(e) {
            res.status(401).json({ message: `Hiba: ${e}`, type: "error"})
        }
    }



    if(tipus == "tv") {
        try {
            const linkekbeUser = db.query("SELECT * FROM user_links WHERE user_id = ? AND series_id IS NOT NULL", [user_id], function (err, result) {
                if (!err) {
                    if (result.length != 0) {
                        //oksa benne van legalább 1

                        var dataVissza = []

                        for(i in result) {
                            dataVissza.push({
                                media_id: result[i].series_id,
                                added_at: result[i].added_at,
                                link_url: result[i].link_url
                            })
                        }

                        res.status(200).json({ dataVissza });
                    } else {
                        res.status(401).json({ message: "Nincs a linkek között semmi", type: "error"})
                    }
                } else {
                    res.status(401).json({ message: "Hiba", type: "error"})
                }
            });
        } catch(e) {
            res.status(401).json({ message: `Hiba: ${e}`, type: "error"})
        }
    }
});






//---------------------------------------------------------------------------Noteok------------------------------

app.post("/changeNote", async (req, res) => {
    const { user_id, media_id, media_type, note } = req.body;

    if (media_type == "movie") {
        try {

            const noteokbaUser = db.query("SELECT * FROM user_notes WHERE user_id = ? AND movie_id = ?", [user_id, media_id], function (err, result) {
                if (!err) {
                    if (result.length == 0) {
                        //oksa, nincs benne a noteokba, mehet bele
    
                        if(note.length > 0) {//írt egyáltalán valamit
                            try {
                                const addUser = db.query("INSERT INTO user_notes (user_id, movie_id, note) VALUES (?, ?, ?)", [user_id, media_id, note])
                                
                                const newUserRow = db.query("SELECT * FROM user_notes WHERE user_id = ? AND movie_id = ?", [user_id, media_id], function (err, result) {
                                    if (!err) {
                                        if (result.length == 1) {
                                            //oksa, benne van
                                            res.status(201).json({ message: "Sikeresen hozzáadva", type: "success"});
                                        } else {
                                            res.status(500).json({ message: "Hiba", type: "error"});
                                        }
                                    } else {
                                        res.status(500).json({ message: "Hiba", type: "error"});
                                    }
                                });
                            } catch(e) {console.log(e)}
                        }
                    } else {
                        //UPDATE vagy DELETE ha már van

                        if(note.length > 0) { //UPDATE
                            try {

                                const updatedUserRow = db.query("UPDATE user_notes SET note = ? WHERE user_id = ? AND movie_id = ?", [note, user_id, media_id], function (err, result) {
                                    if(err) throw err;

                                    if (result.affectedRows > 0) {
                                        res.status(201).json({ message: "Sikeresen megváltoztatva", type: "success"});
                                    } else {
                                        res.status(500).json({ message: "Hiba", type: "error"});
                                    }
                                });

                            } catch(e) {console.log(e)}

                        } else { //DELETE
                            try {
                                const deleteFromUserNotes = db.query("DELETE FROM user_notes WHERE user_id = ? AND movie_id = ?", [user_id, media_id], function (err, result) {
                                    if (!err) {
                                        if (result.affectedRows > 0) {
                                            //oksa
                                            res.status(201).json({ message: "Sikeresen törölve", type: "success"});
                                        } else {
                                            res.status(500).json({ message: "Sikertelen törlés", type: "error"});
                                        }
                                    } else {
                                        res.status(500).json({ message: "Hiba", type: "error"});
                                    }
                                });
                            } catch(e) {console.log(e)}
                        }
                    }
                }
            });

        } catch (error) {
            console.error(error);
        }
    }



    if (media_type == "tv") {
        try {

            const noteokbaUser = db.query("SELECT * FROM user_notes WHERE user_id = ? AND series_id = ?", [user_id, media_id], function (err, result) {
                if (!err) {
                    if (result.length == 0) {
                        //oksa, nincs benne a noteokba, mehet bele
                        if(note.length > 0) {
                            try {
                                const addUser = db.query("INSERT INTO user_notes (user_id, series_id, note) VALUES (?, ?, ?)", [user_id, media_id, note])
                            
                                const newUserRow = db.query("SELECT * FROM user_notes WHERE user_id = ? AND series_id = ?", [user_id, media_id], function (err, result) {
                                    if (!err) {
                                        if (result.length == 1) {
                                            //oksa, benne van
                                            res.status(201).json({ message: "Sikeresen hozzáadva", type: "success"});
                                        } else {
                                            res.status(500).json({ message: "Hiba", type: "error"});
                                        }
                                    } else {
                                        res.status(500).json({ message: "Hiba", type: "error"});
                                    }
                                });
                            } catch(e) {console.log(e)}
                        }
                    } else {
                        //UPDATE vagy DELETE ha már van

                        if(note.length > 0) { //UPDATE
                            try {

                                const updatedUserRow = db.query("UPDATE user_notes SET note = ? WHERE user_id = ? AND series_id = ?", [note, user_id, media_id], function (err, result) {
                                    if(err) throw err;

                                    if (result.affectedRows > 0) {
                                        res.status(201).json({ message: "Sikeresen megváltoztatva", type: "success"});
                                    } else {
                                        res.status(500).json({ message: "Hiba", type: "error"});
                                    }
                                });

                            } catch(e) {console.log(e)}
                        } else { //DELETE
                            try {
                                const deleteFromNotes = db.query("DELETE FROM user_notes WHERE user_id = ? AND series_id = ?", [user_id, media_id], function (err, result) {
                                    if (!err) {
                                        if (result.affectedRows > 0) {
                                            //oksa
                                            res.status(201).json({ message: "Sikeresen törölve", type: "success"});
                                        } else {
                                            res.status(500).json({ message: "Sikertelen törlés", type: "error"});
                                        }
                                    } else {
                                        res.status(500).json({ message: "Hiba", type: "error"});
                                    }
                                });
                            } catch(e) {console.log(e)}
                        }
                    }
                }
            });

        } catch (error) {
            console.error(error);
        }
    }

});




app.post("/getNotes", async (req, res) => {
    const {user_id, tipus} = req.body

    if(tipus == "movie") {
        try {
            const noteokbaUser = db.query("SELECT * FROM user_notes WHERE user_id = ? AND movie_id IS NOT NULL", [user_id], function (err, result) {
                if (!err) {
                    if (result.length != 0) {
                        //oksa benne van legalább 1

                        var dataVissza = []

                        for(i in result) {
                            dataVissza.push({
                                media_id: result[i].movie_id,
                                added_at: result[i].updated_at,
                                note: result[i].note
                            })
                        }

                        res.status(200).json({ dataVissza });
                    } else {
                        res.status(401).json({ message: "Nincs a jegyzetek között semmi", type: "error"})
                    }
                } else {
                    res.status(401).json({ message: "Hiba", type: "error"})
                }
            });
        } catch(e) {
            res.status(401).json({ message: `Hiba: ${e}`, type: "error"})
        }
    }



    if(tipus == "tv") {
        try {
            const noteokbaUser = db.query("SELECT * FROM user_notes WHERE user_id = ? AND series_id IS NOT NULL", [user_id], function (err, result) {
                if (!err) {
                    if (result.length != 0) {
                        //oksa benne van legalább 1

                        var dataVissza = []

                        for(i in result) {
                            dataVissza.push({
                                media_id: result[i].series_id,
                                added_at: result[i].updated_at,
                                note: result[i].note
                            })
                        }

                        res.status(200).json({ dataVissza });
                    } else {
                        res.status(401).json({ message: "Nincs a jegyzetek között semmi", type: "error"})
                    }
                } else {
                    res.status(401).json({ message: "Hiba", type: "error"})
                }
            });
        } catch(e) {
            res.status(401).json({ message: `Hiba: ${e}`, type: "error"})
        }
    }
});







//---------------------------------------------------------------------------ServerLinkek------------------------------

app.post("/changeServerLink", async (req, res) => {
    const { media_id, media_type, link } = req.body;

    if (media_type == "movie") {
        if (link.length > 0) {
            try {

                const linkekbenne = db.query("SELECT * FROM server_links WHERE movie_id = ?", [media_id], function (err, result) {
                    if (!err) {
                        if (result.length == 0) {
                            //oksa, nincs benne a linkekbe, mehet bele
                        
                            try {
                                const addLink = db.query("INSERT INTO server_links (movie_id, link) VALUES (?, ?)", [media_id, link])
                            
                                const newLinkRow = db.query("SELECT * FROM server_links WHERE movie_id = ?", [media_id], function (err, result) {
                                    if (!err) {
                                        if (result.length == 1) {
                                            //oksa, benne van
                                            res.status(201).json({ message: "Sikeresen hozzáadva", type: "success"});
                                        } else {
                                            res.status(500).json({ message: "Hiba", type: "error"});
                                        }
                                    } else {
                                        res.status(500).json({ message: "Hiba", type: "error"});
                                    }
                                });
                            } catch(e) {console.log(e)}
                        } else {
                            //UPDATE ha már van
                            try {

                                const updatedLinkRow = db.query("UPDATE server_links SET link = ? WHERE movie_id = ?", [link, media_id], function (err, result) {
                                    if(err) throw err;

                                    if (result.affectedRows > 0) {
                                        res.status(201).json({ message: "Sikeresen megváltoztatva", type: "success"});
                                    } else {
                                        res.status(500).json({ message: "Hiba", type: "error"});
                                    }
                                });

                            } catch(e) {console.log(e)}
                        }
                    }
                });

            } catch (error) {
                console.error(error);
            }
        } else {
            //törlés
            try {
                const deleteFromServerLinks = db.query("DELETE FROM server_links WHERE movie_id = ?", [media_id], function (err, result) {
                    if (!err) {
                        if (result.affectedRows > 0) {
                            //oksa
                            res.status(201).json({ message: "Sikeresen törölve", type: "success"});
                        } else {
                            res.status(500).json({ message: "Sikertelen törlés", type: "error"});
                        }
                    } else {
                        res.status(500).json({ message: "Hiba", type: "error"});
                    }
                });
            } catch(e) {console.log(e)}

        }
    }



    if (media_type == "tv") {
        if (link.length > 0) {

            try {

                const linkekbenne = db.query("SELECT * FROM server_links WHERE series_id = ?", [media_id], function (err, result) {
                    if (!err) {
                        if (result.length == 0) {
                            //oksa, nincs benne a linkekbe, mehet bele
                        
                            try {
                                const addLink = db.query("INSERT INTO server_links (series_id, link) VALUES (?, ?)", [media_id, link])
                            
                                const newLinkRow = db.query("SELECT * FROM server_links WHERE series_id = ?", [media_id], function (err, result) {
                                    if (!err) {
                                        if (result.length == 1) {
                                            //oksa, benne van
                                            res.status(201).json({ message: "Sikeresen hozzáadva", type: "success"});
                                        } else {
                                            res.status(500).json({ message: "Hiba", type: "error"});
                                        }
                                    } else {
                                        res.status(500).json({ message: "Hiba", type: "error"});
                                    }
                                });
                            } catch(e) {console.log(e)}
                        } else {
                            //UPDATE ha már van
                            try {

                                const updatedLinkRow = db.query("UPDATE server_links SET link = ? WHERE series_id = ?", [link, media_id], function (err, result) {
                                    if(err) throw err;

                                    if (result.affectedRows > 0) {
                                        res.status(201).json({ message: "Sikeresen megváltoztatva", type: "success"});
                                    } else {
                                        res.status(500).json({ message: "Hiba", type: "error"});
                                    }
                                });

                            } catch(e) {console.log(e)}
                        }
                    }
                });

            } catch (error) {
                console.error(error);
            }

        } else {
            //törlés
            try {
                const deleteFromServerLinks = db.query("DELETE FROM server_links WHERE series_id = ?", [media_id], function (err, result) {
                    if (!err) {
                        if (result.affectedRows > 0) {
                            //oksa
                            res.status(201).json({ message: "Sikeresen törölve", type: "success"});
                        } else {
                            res.status(500).json({ message: "Sikertelen törlés", type: "error"});
                        }
                    } else {
                        res.status(500).json({ message: "Hiba", type: "error"});
                    }
                });
            } catch(e) {console.log(e)}

        }
    }

});




app.post("/getServerLinks", async (req, res) => {
    const {tipus} = req.body

    if(tipus == "movie") {
        try {
            const linkekbenne = db.query("SELECT * FROM server_links WHERE movie_id IS NOT NULL", function (err, result) {
                if (!err) {
                    if (result.length != 0) {
                        //oksa benne van legalább 1

                        var dataVissza = []

                        for(i in result) {
                            dataVissza.push({
                                media_id: result[i].movie_id,
                                link: result[i].link
                            })
                        }

                        res.status(200).json({ dataVissza });
                    } else {
                        res.status(401).json({ message: "Nincs a linkek között semmi", type: "error"})
                    }
                } else {
                    res.status(401).json({ message: "Hiba", type: "error"})
                }
            });
        } catch(e) {
            res.status(401).json({ message: `Hiba: ${e}`, type: "error"})
        }
    }



    if(tipus == "tv") {
        try {
            const linkekbenne = db.query("SELECT * FROM server_links WHERE series_id IS NOT NULL", function (err, result) {
                if (!err) {
                    if (result.length != 0) {
                        //oksa benne van legalább 1

                        var dataVissza = []

                        for(i in result) {
                            dataVissza.push({
                                media_id: result[i].series_id,
                                link: result[i].link
                            })
                        }

                        res.status(200).json({ dataVissza });
                    } else {
                        res.status(401).json({ message: "Nincs a linkek között semmi", type: "error"})
                    }
                } else {
                    res.status(401).json({ message: "Hiba", type: "error"})
                }
            });
        } catch(e) {
            res.status(401).json({ message: `Hiba: ${e}`, type: "error"})
        }
    }
});




//Kilistázáshoz kell

const BASE_DIR = process.env.SERVER_DOWNLOADS_BASE_DIR.replace(/\\/g, '/').replace(/\\\\/g, '\\')

app.post("/listDIR", async (req, res) => {
    const relativePath = decodeURIComponent(req.body.path || '')
    const absolutePath = decodeURIComponent(path.join(BASE_DIR, relativePath).replace(/\\/g, '/').replace(/\\\\/g, '\\'))

    //console.log(BASE_DIR, absolutePath)
    
    // Prevent path traversal
    if (!absolutePath.startsWith(BASE_DIR)) {
        return res.status(403).json({ message: 'Engedély megtagadva!', type: "error" })
    }


    fs.readdir(absolutePath, { withFileTypes: true }, (err, items) => {
        if (err) {
            return res.status(500).json({ message: 'Hiba történt a mappa beolvasásánál', type: "error", hibaok: "esetleg file" })
        }

        const result = {
            folders: [],
            files: [],
        }


        for (const item of items) {
            if (item.isDirectory()) {
                result.folders.push(item.name)
            } else if (item.isFile()) {
                result.files.push(item.name)
            }
        }

        res.status(200).json(result);
    });
});





//Media hozzáférés clientről

const activeConversions = new Set(); //ez kell, hogy ne konvertálódjon egyszerre több dolog


app.post("/videoKezeles", async (req, res) => {
    const { vidPath } = req.body

    const relativeFilePath = decodeURIComponent(vidPath.replace(/\\/g, '/').replace(/\\\\/g, '\\'))
    const absoluteFilePath = decodeURIComponent(path.join(BASE_DIR, relativeFilePath).replace(/\\/g, '/').replace(/\\\\/g, '\\'))

    // Prevent path traversal
    if (!absoluteFilePath.startsWith(BASE_DIR)) {
        return res.status(403).json({ message: 'Engedély megtagadva!', type: "error" });
    }



    //Convert
    var isFileMP4 = absoluteFilePath.split(".")[absoluteFilePath.split(".").length - 1]
    
    if ((isFileMP4 && isFileMP4 != "mp4") || !isFileMP4) {

        /* //Esetleg később jól jöhet? Converter

        var outputDirSplitted = absoluteFilePath.split("/")
        var outputDirPopped = outputDirSplitted.pop()
        var outputDir = ""

        for (let i in outputDirSplitted) {
            outputDir += outputDirSplitted[i] + "/"
        }


        var outputFileNameSplitted = (absoluteFilePath.split("/")[absoluteFilePath.split("/").length - 1]).split(".")
        var outputFileNamePopped = outputFileNameSplitted.pop()
        var outputFileName = ""

        for (let i in outputFileNameSplitted) {
            outputFileName += outputFileNameSplitted[i] + "."
        }
        outputFileName += "mp4"
        const outputFile = path.join(outputDir, outputFileName);



        var ujRelativeSplitted = relativeFilePath.split(".")
        var ujRelativePopped = ujRelativeSplitted.pop()
        var ujRelativeLoc = ""
        
        for (let i in ujRelativeSplitted) {
            ujRelativeLoc += ujRelativeSplitted[i] + "."
        }
    
        ujRelativeLoc = ujRelativeLoc + "mp4"



        if (activeConversions.has(absoluteFilePath)) {
            return res.status(429).json({ message: 'Már elkezdődött ennek a filenak a konvertálása. Kérlek gyere vissza egy pár percen belül.', type: "info" });
        }


        activeConversions.add(absoluteFilePath);

        
        const command = `ffmpeg -i "${absoluteFilePath}" -map 0 -c:v copy -c:a aac -b:a 192k -c:s mov_text -movflags +faststart "${outputFile}"`;

        exec(command, (err, stdout, stderr) => {
            activeConversions.delete(absoluteFilePath); // Clear lock

            if (err) {
                return res.status(502).json({ message: 'A file nem található.', type: "lepjenvissza" });
            }

            
            fs.unlink(absoluteFilePath, (err) => {
                if (err) console.warn('[!] Nem lehet törlöni az eredeti MKV filet: ', err.message);
                else console.log(`[-] Eredeti file törölve: ${absoluteFilePath}`);
            });


            return res.status(200).json({ message: ujRelativeLoc, type: "vidlink" });
        });
        */


        return res.status(200).json({ message: relativeFilePath, type: "playlistbe" });


    } else {
        return res.status(200).json({ message: relativeFilePath, type: "oksa" });
    }
});




app.get('/media/*', (req, res) => {
    const relativeFilePath = decodeURIComponent(req.params[0].replace(/\\/g, '/').replace(/\\\\/g, '\\'))
    const absoluteFilePath = decodeURIComponent(path.join(BASE_DIR, relativeFilePath).replace(/\\/g, '/').replace(/\\\\/g, '\\'))

    
    res.sendFile(absoluteFilePath, err => {
        if (err) {
            if (!res.headersSent) {
                return res.status(404).json({ message: 'A file nem található :(', type: "error" });
            }
        }
    });
});



// vlc-vel meg lehet nyitni ezt az m3u filet, szóval ha letölti akkor tudja nézni

app.get("/playlist/*", (req, res) => {
    fullParams = decodeURIComponent(req.params[0].replace(/\\/g, '/').replace(/\\\\/g, '\\'))

    const url = fullParams.split("|")[0]
    const videoName = fullParams.split("|")[1]
    const videoURL = `${url}/media/${videoName}`;

    const playlist = `#EXTM3U\n${videoURL}`;

    res.setHeader("Content-Disposition", `attachment; filename="${videoName}.m3u"`);
    res.setHeader("Content-Type", "audio/x-mpegurl");
    res.send(playlist);
});





//Admin panelhez kell

app.post("/getSQLElozmenyek", async (req, res) => {
    const { sql_table } = req.body


    if(sql_table) {
        try {
            const linkekbenne = db.query("SELECT * FROM `" + sql_table + "`", function (err, result) {
                if (!err) {
                    if (result.length > 0) {
                        res.status(200).json({ message: "Előzmények sikeresen lekérve", type: "success", sql_table: sql_table, tartalom: result});
                    }
                }
            });

        } catch(e) {
            res.status(401).json({ message: `Hiba: ${e}`, type: "error"})
        }
    }
});
