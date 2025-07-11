require("dotenv").config();
const express = require("express")

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

            const watchedbeUser = db.getConnection().query("SELECT * FROM user_watched_movies WHERE user_id = ? AND movie_id = ?", [user_id, media_id], function (err, result) {
                if (!err) {
                    if (result.length == 0) {
                        //oksa, nincs benne a watchedben
                        try {
                            const wishlistbeUser = db.getConnection().query("SELECT * FROM user_wishlist WHERE user_id = ? AND movie_id = ?", [user_id, media_id], function (err, result) {
                                if (!err) {
                                    if (result.length == 0) {
                                        //oksa, nincs benne már alapból, szóval most mehet bele
    
                                        try {
                                            const addUser = db.getConnection().query("INSERT INTO user_wishlist (user_id, movie_id) VALUES (?, ?)", [user_id, media_id])
                        
                                            const newUserRow = db.getConnection().query("SELECT * FROM user_wishlist WHERE user_id = ? AND movie_id = ?", [user_id, media_id], function (err, result) {
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

            const watchedbeUser = db.getConnection().query("SELECT * FROM user_watched_episodes WHERE user_id = ? AND series_id = ?", [user_id, media_id], function (err, result) {
                if (!err) {
                    if (result.length == 0) {
                        //oksa, nincs benne a watchedben
                        try {
                            const wishlistbeUser = db.getConnection().query("SELECT * FROM user_wishlist WHERE user_id = ? AND series_id = ?", [user_id, media_id], function (err, result) {
                                if (!err) {
                                    if (result.length == 0) {
                                        //oksa, nincs benne már alapból, szóval most mehet bele
    
                                        try {
                                            const addUser = db.getConnection().query("INSERT INTO user_wishlist (user_id, series_id) VALUES (?, ?)", [user_id, media_id])
                        
                                            const newUserRow = db.getConnection().query("SELECT * FROM user_wishlist WHERE user_id = ? AND series_id = ?", [user_id, media_id], function (err, result) {
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
            const wishlistbeUser = db.getConnection().query("SELECT * FROM user_wishlist WHERE user_id = ? AND movie_id = ?", [user_id, media_id], function (err, result) {
                if (!err) {
                    if (result.length != 0) {
                        //oksa, benne van
                        
                        try {
                            const deleteFromWishlist = db.getConnection().query("DELETE FROM user_wishlist WHERE user_id = ? AND movie_id = ?", [user_id, media_id], function (err, result) {
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
            const wishlistbeUser = db.getConnection().query("SELECT * FROM user_wishlist WHERE user_id = ? AND series_id = ?", [user_id, media_id], function (err, result) {
                if (!err) {
                    if (result.length != 0) {
                        //oksa, benne van
                        
                        try {
                            const deleteFromWishlist = db.getConnection().query("DELETE FROM user_wishlist WHERE user_id = ? AND series_id = ?", [user_id, media_id], function (err, result) {
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
            const wishlistbeUser = db.getConnection().query("SELECT * FROM user_wishlist WHERE user_id = ? AND movie_id IS NOT NULL", [user_id], function (err, result) {
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
            const wishlistbeUser = db.getConnection().query("SELECT * FROM user_wishlist WHERE user_id = ? AND series_id IS NOT NULL", [user_id], function (err, result) {
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

            const wishlistbeUser = db.getConnection().query("SELECT * FROM user_wishlist WHERE user_id = ? AND movie_id = ?", [user_id, media_id], function (err, result) {
                if (!err) {
                    if (result.length == 0) {
                        //oksa, nincs benne a wishlistben
                        try {
                            const watchlistbeUser = db.getConnection().query("SELECT * FROM user_watched_movies WHERE user_id = ? AND movie_id = ?", [user_id, media_id], function (err, result) {
                                if (!err) {
                                    if (result.length == 0) {
                                        //oksa, nincs benne már alapból, szóval most mehet bele
    
                                        try {
                                            const addUser = db.getConnection().query("INSERT INTO user_watched_movies (user_id, movie_id) VALUES (?, ?)", [user_id, media_id])
                        
                                            const newUserRow = db.getConnection().query("SELECT * FROM user_watched_movies WHERE user_id = ? AND movie_id = ?", [user_id, media_id], function (err, result) {
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
                            const deleteFromWishlist = db.getConnection().query("DELETE FROM user_wishlist WHERE user_id = ? AND movie_id = ?", [user_id, media_id], function (err, result) {
                                if (!err) {
                                    if (result.affectedRows > 0) {
                                        //oksa
                                        try {
                                            const addUser = db.getConnection().query("INSERT INTO user_watched_movies (user_id, movie_id) VALUES (?, ?)", [user_id, media_id])
                        
                                            const newUserRow = db.getConnection().query("SELECT * FROM user_watched_movies WHERE user_id = ? AND movie_id = ?", [user_id, media_id], function (err, result) {
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

            const wishlistbeUser = db.getConnection().query("SELECT * FROM user_wishlist WHERE user_id = ? AND series_id = ?", [user_id, media_id], function (err, result) {
                if (!err) {
                    if (result.length == 0) {
                        //oksa, nincs benne a wishlistben
                        try {
                            const watchlistbeUser = db.getConnection().query("SELECT * FROM user_watched_episodes WHERE user_id = ? AND episode_id = ?", [user_id, ep_id], function (err, result) {
                                if (!err) {
                                    if (result.length == 0) {
                                        //oksa, nincs benne már alapból, szóval most mehet bele
    
                                        try {
                                            const addUser = db.getConnection().query("INSERT INTO user_watched_episodes (user_id, series_id, episode_id) VALUES (?, ?, ?)", [user_id, media_id, ep_id])
                        
                                            const newUserRow = db.getConnection().query("SELECT * FROM user_watched_episodes WHERE user_id = ? AND episode_id = ?", [user_id, ep_id], function (err, result) {
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
                            const deleteFromWishlist = db.getConnection().query("DELETE FROM user_wishlist WHERE user_id = ? AND series_id = ?", [user_id, media_id], function (err, result) {
                                if (!err) {
                                    if (result.affectedRows > 0) {
                                        //oksa
                                        try {
                                            const addUser = db.getConnection().query("INSERT INTO user_watched_episodes (user_id, series_id, episode_id) VALUES (?, ?, ?)", [user_id, media_id, ep_id])
                        
                                            const newUserRow = db.getConnection().query("SELECT * FROM user_watched_episodes WHERE user_id = ? AND episode_id = ?", [user_id, ep_id], function (err, result) {
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
            const wachedbeUser = db.getConnection().query("SELECT * FROM user_watched_movies WHERE user_id = ? AND movie_id = ?", [user_id, media_id], function (err, result) {
                if (!err) {
                    if (result.length != 0) {
                        //oksa, benne van
                        
                        try {
                            const deleteFromWatched = db.getConnection().query("DELETE FROM user_watched_movies WHERE user_id = ? AND movie_id = ?", [user_id, media_id], function (err, result) {
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
            const wachedbeUser = db.getConnection().query("SELECT * FROM user_watched_episodes WHERE user_id = ? AND episode_id = ?", [user_id, ep_id], function (err, result) {
                if (!err) {
                    if (result.length != 0) {
                        //oksa, benne van
                        
                        try {
                            const deleteFromWatched = db.getConnection().query("DELETE FROM user_watched_episodes WHERE user_id = ? AND episode_id = ?", [user_id, ep_id], function (err, result) {
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
            const watchedbeUser = db.getConnection().query("SELECT * FROM user_watched_movies WHERE user_id = ? AND movie_id IS NOT NULL", [user_id], function (err, result) {
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
            const watchedbeUser = db.getConnection().query("SELECT * FROM user_watched_episodes WHERE user_id = ? AND series_id IS NOT NULL", [user_id], function (err, result) {
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

            const linkekbeUser = db.getConnection().query("SELECT * FROM user_links WHERE user_id = ? AND movie_id = ?", [user_id, media_id], function (err, result) {
                if (!err) {
                    if (result.length == 0) {
                        //oksa, nincs benne a linkekbe, mehet bele
    
                        try {
                            const addUser = db.getConnection().query("INSERT INTO user_links (user_id, movie_id, link_url) VALUES (?, ?, ?)", [user_id, media_id, link_url])
        
                            const newUserRow = db.getConnection().query("SELECT * FROM user_links WHERE user_id = ? AND movie_id = ?", [user_id, media_id], function (err, result) {
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

                            const updatedUserRow = db.getConnection().query("UPDATE user_links SET link_url = ? WHERE movie_id = ?", [link_url, media_id], function (err, result) {
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
    }



    if (media_type == "tv") {
        try {

            const linkekbeUser = db.getConnection().query("SELECT * FROM user_links WHERE user_id = ? AND series_id = ?", [user_id, media_id], function (err, result) {
                if (!err) {
                    if (result.length == 0) {
                        //oksa, nincs benne a linkekbe, mehet bele
    
                        try {
                            const addUser = db.getConnection().query("INSERT INTO user_links (user_id, series_id, link_url) VALUES (?, ?, ?)", [user_id, media_id, link_url])
        
                            const newUserRow = db.getConnection().query("SELECT * FROM user_links WHERE user_id = ? AND series_id = ?", [user_id, media_id], function (err, result) {
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

                            const updatedUserRow = db.getConnection().query("UPDATE user_links SET link_url = ? WHERE series_id = ?", [link_url, media_id], function (err, result) {
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
    }

});




app.post("/getLinks", async (req, res) => {
    const {user_id, tipus} = req.body

    if(tipus == "movie") {
        try {
            const linkekbeUser = db.getConnection().query("SELECT * FROM user_links WHERE user_id = ? AND movie_id IS NOT NULL", [user_id], function (err, result) {
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
            const linkekbeUser = db.getConnection().query("SELECT * FROM user_links WHERE user_id = ? AND series_id IS NOT NULL", [user_id], function (err, result) {
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

            const noteokbaUser = db.getConnection().query("SELECT * FROM user_notes WHERE user_id = ? AND movie_id = ?", [user_id, media_id], function (err, result) {
                if (!err) {
                    if (result.length == 0) {
                        //oksa, nincs benne a noteokba, mehet bele
    
                        try {
                            const addUser = db.getConnection().query("INSERT INTO user_notes (user_id, movie_id, note) VALUES (?, ?, ?)", [user_id, media_id, note])
        
                            const newUserRow = db.getConnection().query("SELECT * FROM user_notes WHERE user_id = ? AND movie_id = ?", [user_id, media_id], function (err, result) {
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

                            const updatedUserRow = db.getConnection().query("UPDATE user_notes SET note = ? WHERE movie_id = ?", [note, media_id], function (err, result) {
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
    }



    if (media_type == "tv") {
        try {

            const noteokbaUser = db.getConnection().query("SELECT * FROM user_notes WHERE user_id = ? AND series_id = ?", [user_id, media_id], function (err, result) {
                if (!err) {
                    if (result.length == 0) {
                        //oksa, nincs benne a noteokba, mehet bele
    
                        try {
                            const addUser = db.getConnection().query("INSERT INTO user_notes (user_id, series_id, note) VALUES (?, ?, ?)", [user_id, media_id, note])
        
                            const newUserRow = db.getConnection().query("SELECT * FROM user_notes WHERE user_id = ? AND series_id = ?", [user_id, media_id], function (err, result) {
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

                            const updatedUserRow = db.getConnection().query("UPDATE user_notes SET note = ? WHERE series_id = ?", [note, media_id], function (err, result) {
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
    }

});




app.post("/getNotes", async (req, res) => {
    const {user_id, tipus} = req.body

    if(tipus == "movie") {
        try {
            const noteokbaUser = db.getConnection().query("SELECT * FROM user_notes WHERE user_id = ? AND movie_id IS NOT NULL", [user_id], function (err, result) {
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
            const noteokbaUser = db.getConnection().query("SELECT * FROM user_notes WHERE user_id = ? AND series_id IS NOT NULL", [user_id], function (err, result) {
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

                const linkekbenne = db.getConnection().query("SELECT * FROM server_links WHERE movie_id = ?", [media_id], function (err, result) {
                    if (!err) {
                        if (result.length == 0) {
                            //oksa, nincs benne a linkekbe, mehet bele
                        
                            try {
                                const addLink = db.getConnection().query("INSERT INTO server_links (movie_id, link) VALUES (?, ?)", [media_id, link])
                            
                                const newLinkRow = db.getConnection().query("SELECT * FROM server_links WHERE movie_id = ?", [media_id], function (err, result) {
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

                                const updatedLinkRow = db.getConnection().query("UPDATE server_links SET link = ? WHERE movie_id = ?", [link, media_id], function (err, result) {
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
                const deleteFromServerLinks = db.getConnection().query("DELETE FROM server_links WHERE movie_id = ?", [media_id], function (err, result) {
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

                const linkekbenne = db.getConnection().query("SELECT * FROM server_links WHERE series_id = ?", [media_id], function (err, result) {
                    if (!err) {
                        if (result.length == 0) {
                            //oksa, nincs benne a linkekbe, mehet bele
                        
                            try {
                                const addLink = db.getConnection().query("INSERT INTO server_links (series_id, link) VALUES (?, ?)", [media_id, link])
                            
                                const newLinkRow = db.getConnection().query("SELECT * FROM server_links WHERE series_id = ?", [media_id], function (err, result) {
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

                                const updatedLinkRow = db.getConnection().query("UPDATE server_links SET link = ? WHERE series_id = ?", [link, media_id], function (err, result) {
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
                const deleteFromServerLinks = db.getConnection().query("DELETE FROM server_links WHERE series_id = ?", [media_id], function (err, result) {
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




app.post("/getServerLink", async (req, res) => {
    const {tipus} = req.body

    if(tipus == "movie") {
        try {
            const linkekbenne = db.getConnection().query("SELECT * FROM server_links WHERE movie_id IS NOT NULL", function (err, result) {
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
            const linkekbenne = db.getConnection().query("SELECT * FROM server_links WHERE series_id IS NOT NULL", function (err, result) {
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

