var API_KEY = ""
var isLoggedin = false
var userGroup


window.onload = async () => {
    const token = localStorage.getItem("token")
    isLoggedin = await checkLogin(token)

    if (isLoggedin) {
        loggedIn()
    } else {
        window.location.pathname = "/404"
    }
}




async function loggedIn() {
    try {
        const response = await fetch(`${location.origin}/getUserGroup`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json', "Authorization": localStorage.token },
            body: JSON.stringify({username: JSON.parse(localStorage.getItem("user")).username})
        })
    
        const result = await response.json()
    
        if (response.ok) {
            userGroup = result.group

            manageUserByGroup()

            if (userGroup && userGroup != "user") {
                try {
                    const response = await fetch(`${location.origin}/getAPIinfo`, {
                        method: "GET",
                        headers: { 'Content-Type': 'application/json', "Authorization": localStorage.token }
                    })
                    
                    const result = await response.json()
                    
                    if (response.ok) {
                        API_KEY = result.apiKey
                    
                    } else {
                        notify("Hiba történt az API-al", "error")
                    }
                } catch(e) {
                    console.error(e)
                }
            }
        }

    } catch(e) {
        console.error(e)
    }
}





function manageUserByGroup() {
    if(userGroup && userGroup == "user") {
        window.location.pathname = "/404"
    }


    if(userGroup && userGroup == "owner") {
        
        //ide kellene betenni a dolgokat amik elérhetők a group számára

        var mediaKezelo = document.createElement("div")
        mediaKezelo.id = "mediaKezelo"
        mediaKezelo.classList = "box"

        document.getElementById("content").appendChild(mediaKezelo)

        mediaKezeloSetup()


        //aztán a többi

        var userKezelo = document.createElement("div")
        userKezelo.id = "userKezelo"
        userKezelo.classList = "box"

        document.getElementById("content").appendChild(userKezelo)

        userKezeloSetup()



        var sqlElozmenyWatchedEps = document.createElement("div")
        sqlElozmenyWatchedEps.id = "sqlElozmenyWatchedEps"
        sqlElozmenyWatchedEps.classList = "box"

        document.getElementById("content").appendChild(sqlElozmenyWatchedEps)

        sqlElozmenyWatchedEpsFill()

    }


    if(userGroup && userGroup == "admin") {

        var userKezelo = document.createElement("div")
        userKezelo.id = "userKezelo"
        userKezelo.classList = "box"

        document.getElementById("content").appendChild(userKezelo)

        userKezeloSetup()



        var sqlElozmenyWatchedEps = document.createElement("div")
        sqlElozmenyWatchedEps.id = "sqlElozmenyWatchedEps"
        sqlElozmenyWatchedEps.classList = "box"

        document.getElementById("content").appendChild(sqlElozmenyWatchedEps)

        sqlElozmenyWatchedEpsFill()

    }
}



var letezoSorozatLinkek = []
var letezoFilmLinkek = []


async function mediaKezeloSetup() {
    if (userGroup && userGroup == "owner") {
        var mediaKezelo = document.getElementById("mediaKezelo")

        mediaKezelo.innerHTML = `
            <div id="marLetezoLinkek"></div>
            <br>
            <form class="d-flex mx-auto" role="search">
                <input id="searchbar_tv" class="form-control me-2 searchbar mediaSearchbar" type="search" placeholder="Sorozat kereső" aria-label="Sorozat keresés">
            </form>
            <br>
            <form class="d-flex mx-auto" role="search">
                <input id="searchbar_movie" class="form-control me-2 searchbar mediaSearchbar" type="search" placeholder="Film kereső" aria-label="Film keresés">
            </form>
            <br><hr><br>
            <div id="searched_sorozatok" class="searchedThings"></div>
            <br><br>
            <div id="searched_filmek" class="searchedThings"></div>
        `

        existingServerLinkKezeles()
        mediaSearchKezeles()
    }
}




//------------------------------------------------------------------------------Ezek kellenek
var language = 'en'

function manageLang() {
    if (getLanguageCookie() != null) {
        language = getLanguageCookie()
    }
}

manageLang()



function debounce(func) {
    let delay = 300

    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
}



function formatDate(datestr) {
    const d = new Date(datestr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const h = d.getHours()
    const m = d.getMinutes()

    return (`${year}.${month}.${day} | ${h}:${m}`)
}




//--------------------------------------------------------------------------------------------------Media Kezelő rész--
async function mediaSearchKezeles() {
    document.querySelectorAll(".mediaSearchbar").forEach(sbar => {
        sbar.addEventListener("input", debounce((e) => {
            mediaSearching(e.target)
        }))
    })


    document.querySelectorAll(".mediaSearchbar").forEach(sbar => {
        sbar.addEventListener("input", (e) => {
            sbar.onkeydown = function(e) {
                if (e.keyCode == 13) {
                    sbar.blur()
                    e.preventDefault()
                }
            }
        })
    })
}




async function mediaSearching(input) {
    search = input.value

    if (input.id == "searchbar_tv") {

        try {
            const getData = await fetch(`https://api.themoviedb.org/3/search/tv?query=${search}&api_key=${API_KEY}&language=${language}`)
            const adatok = await getData.json()
            
            if (adatok.results) {
                const sortedSeries = adatok.results.sort((a, b) => b.popularity - a.popularity);
                //console.log(sortedSeries);

                document.getElementById("searched_filmek").innerHTML = ""
                document.getElementById("searched_sorozatok").innerHTML = ""

                sortedSeries.forEach(el => {
                    document.getElementById("searched_sorozatok").innerHTML += `
                        <div class="mediaSor" id="${el.id}">
                            <div class="imgResz">
                                <img src="https://image.tmdb.org/t/p/w500${el.poster_path}" loading="lazy" alt="sorozat poszter">
                            </div>
                            <div class="adatokResz">
                                <h5 class="card-title"><b>${el.name}</b></h5>
                                <a href="#" id="${el.id}" class="btn btn-primary adatlap-button">Adatlap</a>
                                <p class="rating" style="color: ${ratingColor(el.vote_average)};">${Math.round(el.vote_average * 100) / 100}</p>
                            </div>
                            <div class="kezeloResz">

                                <div class="serverLinkKezelo">
                                    <label for="${el.id}_serverLink">Szerver Link</label>
                                    <input type="text" name="serverLink" id="${el.id}_serverLink">
                                    <button id="${el.id}_tv_setBtn" class="setLnkBtn" onclick="setBtnFunction(this)">Beállítás</button>
                                </div>

                            </div>
                        </div>
                    `
                });


                document.querySelectorAll(".adatlap-button").forEach(el => {
                    el.href = `${window.location.origin}/sorozat/${el.id}`
                })

            }
        } catch(e) {
            console.error(e)
        }

    } else if(input.id == "searchbar_movie") {

        try {
            const getData = await fetch(`https://api.themoviedb.org/3/search/movie?query=${search}&api_key=${API_KEY}&language=${language}`)
            const adatok = await getData.json()
    
            if (adatok.results) {
                const sortedMovies = adatok.results.sort((a, b) => b.popularity - a.popularity);

                document.getElementById("searched_sorozatok").innerHTML = ""
                document.getElementById("searched_filmek").innerHTML = ""

                sortedMovies.forEach(el => {
                    document.getElementById("searched_filmek").innerHTML += `
                        <div class="mediaSor" id="${el.id}">
                            <div class="imgResz">
                                <img src="https://image.tmdb.org/t/p/w500${el.poster_path}" loading="lazy" alt="film poszter">
                            </div>
                            <div class="adatokResz">
                                <h5 class="card-title"><b>${el.title}</b></h5>
                                <a href="#" id="${el.id}" class="btn btn-primary adatlap-button">Adatlap</a>
                                <p class="rating" style="color: ${ratingColor(el.vote_average)};">${Math.round(el.vote_average * 100) / 100}</p>
                            </div>
                            <div class="kezeloResz">

                                <div class="serverLinkKezelo">
                                    <label for="${el.id}_serverLink">Szerver Link</label>
                                    <input type="text" name="serverLink" id="${el.id}_serverLink">
                                    <button id="${el.id}_movie_setBtn" class="setLnkBtn" onclick="setBtnFunction(this)">Beállítás</button>
                                </div>

                            </div>
                        </div>
                    `
                });


                document.querySelectorAll(".adatlap-button").forEach(el => {
                    el.href = `${window.location.origin}/film/${el.id}`
                })

            }
        } catch(e) {
            console.error(e)
        }

    }
}



async function setBtnFunction(btn) {
    var media_id = btn.id.split("_")[0]
    var media_type = btn.id.split("_")[1] 
    var link = document.getElementById(`${media_id}_serverLink`).value

    console.log(media_id, media_type, link)


    try {
        var details = {
            user_id: JSON.parse(localStorage.user).user_id,
            media_id: media_id,
            media_type: media_type,
            link: link
        }
        
        const response = await fetch(`${location.origin}/changeServerLink`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json', "Authorization": localStorage.token },
            body: JSON.stringify(details)
        })
        
        const result = await response.json()
        
        notify(t(result.message), result.type)
    } catch(e) {
        console.log("Error:", e)
    }
}




async function existingServerLinkKezeles() {
    var amiMegy = {
        tipus: "tv"
    }

    try {
        const response = await fetch(`${location.origin}/getServerLinks`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json', "Authorization": localStorage.token },
            body: JSON.stringify(amiMegy)
        })
    
        const result = await response.json()
    
        if (response.ok) {
            for(i in result.dataVissza) {
                letezoSorozatLinkek.push(result.dataVissza[i])
            }
        }
    } catch(e) {
        console.error(e)
    }


    //filmek


    var amiMegy = {
        tipus: "movie"
    }

    try {
        const response = await fetch(`${location.origin}/getServerLinks`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json', "Authorization": localStorage.token },
            body: JSON.stringify(amiMegy)
        })
    
        const result = await response.json()
    
        if (response.ok) {
            for(i in result.dataVissza) {
                letezoFilmLinkek.push(result.dataVissza[i])
            }
        }
    } catch(e) {
        console.error(e)
    }


    fillInLetezoLinkek()
}




async function fillInLetezoLinkek() {
    document.getElementById("marLetezoLinkek").innerHTML += `
        <br>
        <h3>Már hozzáadott linkek:</h3>
    `

    for(let tv in letezoSorozatLinkek) {
        console.log(letezoSorozatLinkek[tv])
        try {
            const getData = await fetch(`https://api.themoviedb.org/3/tv/${letezoSorozatLinkek[tv].media_id}?api_key=${API_KEY}&language=${language}`)

            const adatok = await getData.json()
            if (adatok) {
                //console.log(adatok)

                document.getElementById("marLetezoLinkek").innerHTML += `
                    <div class="mediaSor" id="${adatok.id}">
                        <div class="imgResz">
                            <img src="https://image.tmdb.org/t/p/w500${adatok.poster_path}" loading="lazy" alt="sorozat poszter">
                        </div>
                        <div class="adatokResz">
                            <h5 class="card-title"><b>${adatok.name}</b></h5>
                            <a href="#" id="${adatok.id}" class="btn btn-primary adatlap-button">Adatlap</a>
                            <p class="rating" style="color: ${ratingColor(adatok.vote_average)};">${Math.round(adatok.vote_average * 100) / 100}</p>
                        </div>
                        <div class="kezeloResz">

                            <div class="serverLinkKezelo">
                                <label for="${adatok.id}_serverLink">Szerver Link</label>
                                <input type="text" name="serverLink" id="${adatok.id}_serverLink" value="${letezoSorozatLinkek[tv].link}">
                                <button id="${adatok.id}_tv_setBtn" class="setLnkBtn" onclick="setBtnFunction(this)">Beállítás</button>
                            </div>

                        </div>
                    </div>
                `


                document.querySelectorAll(".adatlap-button").forEach(el => {
                    el.href = `${window.location.origin}/sorozat/${el.id}`
                })
            }

        } catch(e) {console.error(e)}
    }




    for(let tv in letezoFilmLinkek) {
        console.log(letezoFilmLinkek[tv])
        try {
            const getData = await fetch(`https://api.themoviedb.org/3/movie/${letezoFilmLinkek[tv].media_id}?api_key=${API_KEY}&language=${language}`)

            const adatok = await getData.json()
            if (adatok) {
                //console.log(adatok)

                document.getElementById("marLetezoLinkek").innerHTML += `
                    <div class="mediaSor" id="${adatok.id}">
                        <div class="imgResz">
                            <img src="https://image.tmdb.org/t/p/w500${adatok.poster_path}" loading="lazy" alt="sorozat poszter">
                        </div>
                        <div class="adatokResz">
                            <h5 class="card-title"><b>${adatok.title}</b></h5>
                            <a href="#" id="${adatok.id}" class="btn btn-primary adatlap-button">Adatlap</a>
                            <p class="rating" style="color: ${ratingColor(adatok.vote_average)};">${Math.round(adatok.vote_average * 100) / 100}</p>
                        </div>
                        <div class="kezeloResz">

                            <div class="serverLinkKezelo">
                                <label for="${adatok.id}_serverLink">Szerver Link</label>
                                <input type="text" name="serverLink" id="${adatok.id}_serverLink" value="${letezoFilmLinkek[tv].link}">
                                <button id="${adatok.id}_tv_setBtn" class="setLnkBtn" onclick="setBtnFunction(this)">Beállítás</button>
                            </div>

                        </div>
                    </div>
                `


                document.querySelectorAll(".adatlap-button").forEach(el => {
                    el.href = `${window.location.origin}/film/${el.id}`
                })

            }

        } catch(e) {console.error(e)}
    }

    document.getElementById("marLetezoLinkek").innerHTML += `<hr>`
}

//--------------------------------------------------------------------------------------------------Media Kezelő rész vége--



//--------------------------------------------------------------------------------------------------User Kezelő rész--

var users_json = []

async function userKezeloSetup() {
    if (userGroup && (userGroup == "owner" || userGroup == "admin")) {
        var userKezelo = document.getElementById("userKezelo")

        userKezelo.innerHTML += `
            <br>
            <form class="d-flex mx-auto" role="search">
                <input id="searchbar_users" class="form-control me-2 searchbar userSearchbar" type="search" placeholder="Felhasználó kereső" aria-label="Felhasználó keresés">
            </form>
            <br><hr><br>
            <div id="userLista" class="searchedThings"></div>
        `


        fillInUsers()
        userSearchKezeles()
    }
}




async function userSearchKezeles() {
    document.querySelectorAll(".userSearchbar").forEach(sbar => {
        sbar.addEventListener("input", (e) => {
            sbar.onkeydown = function(e) {
                if (e.keyCode == 13) {
                    sbar.blur()
                    e.preventDefault()
                }
            }

            userSearching(e.target)
        })
    })
}


async function userSearching(input) {
    search = input.value

    if (input.value.length == 0 || input.value == " " || input.value == undefined) {
        fillInUsers()
    } else {
        searchUsers(search)
        //document.getElementById("userLista").innerHTML = ""
    }
}


async function fillInUsers() {
    try {
        const response = await fetch(`${location.origin}/getUsers`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json', "Authorization": localStorage.token }
        })
    
        const result = await response.json()
    
        if(result) {
            users_json = result.users
        }
    } catch(e) {console.error(e)}


    document.getElementById("userLista").innerHTML = ""

    for (let u in users_json) {
        var user = users_json[u]

        document.getElementById("userLista").innerHTML += `
            <div id="user_${user.user_id}" class="user" data-id="${user.user_id}" data-username="${user.username}" data-email="${user.email}" data-group="${user.group}" data-join="${formatDate(user.created_at)}">
                <div class="adatok">
                    <p class="uID big bold">ID: ${user.user_id}</p>
                    <p class="uName bold">Name: ${user.username}</p>
                    <p class="uEmail">Email: ${user.email}</p>
                    <p class="uGroup bold">Group: ${user.group}</p>
                    <p class="uJoin">Csatlakozás: ${formatDate(user.created_at)}</p>
                </div>
                <div class="kezeles" id="kezeles_${user.user_id}">
                    <label for="actions_${user.user_id}">Válaszd ki mit szeretnél átírni:</label>
                    <select id="actions_${user.user_id}" class="actionsSelector" onchange="selectorChanged(this)">
                        <option value="-">-</option>
                        <option value="username">Felhasználónév</option>
                        <option value="email">Email</option>
                        <option value="group">Csoport</option>
                    </select>

                    <div class="ebbeMegyAzAppend"></div>
                </div>
            </div>
        `
    }
   
}




function searchUsers(search) {
    const searchTerm = search.toLowerCase();
    const users = document.querySelectorAll("#userLista .user");

    users.forEach(user => {
        const id = user.getAttribute("data-id").toLowerCase();
        const username = user.getAttribute("data-username").toLowerCase();
        const email = user.getAttribute("data-email").toLowerCase();
        const group = user.getAttribute("data-group").toLowerCase();
        const join = user.getAttribute("data-join").toLowerCase()

        if (id.includes(searchTerm)) {
            user.style.display = "";
            user.querySelector(".uID").style.color = "orange"
            user.querySelector(".uID").style.backgroundColor = "purple"
        }

        if (username.includes(searchTerm)) {
            user.style.display = "";
            user.querySelector(".uName").style.color = "orange"
            user.querySelector(".uName").style.backgroundColor = "purple"
        }

        if (email.includes(searchTerm)) {
            user.style.display = "";
            user.querySelector(".uEmail").style.color = "orange"
            user.querySelector(".uEmail").style.backgroundColor = "purple"
        }

        if (group.includes(searchTerm)) {
            user.style.display = "";
            user.querySelector(".uGroup").style.color = "orange"
            user.querySelector(".uGroup").style.backgroundColor = "purple"
        }

        if (join.includes(searchTerm)) {
            user.style.display = "";
            user.querySelector(".uJoin").style.color = "orange"
            user.querySelector(".uJoin").style.backgroundColor = "purple"
        }



        if (
            id.includes(searchTerm) ||
            username.includes(searchTerm) ||
            email.includes(searchTerm) ||
            group.includes(searchTerm) ||
            join.includes(searchTerm)
        ) {
            user.style.display = "";
        } else {
            user.style.display = "none";
        }
    });
}




function selectorChanged(element) {
    var selectedEmberkeGroupja = element.parentElement.parentElement.getAttribute("data-group")
    
    if (selectedEmberkeGroupja == "owner" && userGroup == "admin") {
        notify("Nincs jogod ezt az embert módosítani")

        var appendElni = element.parentElement.querySelector(".ebbeMegyAzAppend")
        appendElni.innerHTML = ""

    } else {
        var tipus = element.value
        var appendElni = element.parentElement.querySelector(".ebbeMegyAzAppend")

        appendElni.innerHTML = ""
        

        if (tipus != "-") {
        if (tipus == "group") {
            var newSelector = document.createElement("select")
            newSelector.id = `${element.id}_groupSelector` //actions_ID_groupSelector lesz belőle, amit splittelhetek _-ként

            newSelector.innerHTML = `
                <option value="user">Felhasználó</option>
                <option value="admin">Admin</option>
            `

            if (userGroup == "owner") {
                newSelector.innerHTML += `
                    <option value="owner">Tulaj</option>
                `
            }

            var okButton = document.createElement("button")
            okButton.innerHTML = "Oké"
            okButton.setAttribute("onclick", `userManageOKButtonClicked(this.parentElement, "${tipus}")`)


            appendElni.appendChild(newSelector)
            appendElni.appendChild(okButton)

        } else {

            var newInput = document.createElement("input")
            newInput.id = `${element.id}_${tipus}Input` //actions_ID_VALAMIInput lesz belőle, amit splittelhetek _-ként
            newInput.setAttribute("type", "text")

            var okButton = document.createElement("button")
            okButton.innerHTML = "Oké"
            okButton.setAttribute("onclick", `userManageOKButtonClicked(this.parentElement, "${tipus}")`)


            appendElni.appendChild(newInput)
            appendElni.appendChild(okButton)

        }
        }
    }

}



async function userManageOKButtonClicked(elemparent, mit) {
    var mit = mit //ugye

    if (mit == "group") {
        var mire = elemparent.querySelector("select").value
        var kinek = elemparent.querySelector("select").id.split("_")[1]
    } else {
        var mire = elemparent.querySelector("input").value
        var kinek = elemparent.querySelector("input").id.split("_")[1]
    }

    console.log(kinek, mit, mire)

    try {
        var details = {
            kinek: kinek,
            mit: mit,
            mire: mire
        }
    
        const response = await fetch(`${location.origin}/changeUser`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json', "Authorization": localStorage.token },
            body: JSON.stringify(details)
        })
    
        const result = await response.json()

        notify(t(result.message), result.type)

        if(result.type == "success") {
            setTimeout(() => {
                window.location.reload()
            }, 1000);
        }
    } catch(e) {console.error(e)}
}

//--------------------------------------------------------------------------------------------------User Kezelő rész vége--



//--------------------------------------------------------------------------------------------------Adatbázis előzmények rész--

async function sqlElozmenyWatchedEpsFill() {
    console.log("A")

    try {
        var amiMegy = {
            sql_table: "user_watched_episodes"
        }

        const response = await fetch(`${location.origin}/getSQLElozmenyek`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json', "Authorization": localStorage.token },
            body: JSON.stringify(amiMegy)
        })

        const result = await response.json()


        if (result) {
            
            document.getElementById("sqlElozmenyWatchedEps").innerHTML += `
                <h3>user_watched_episodes Előzmények:</h3>
                <table class="watchedEps_table">
                    <thead>
                        <tr>
                            <td>Hanyadik</td>
                            <td>watched_episode_id</td>
                            <td>user_id</td>
                            <td>series_id</td>
                            <td>episode_id</td>
                            <td>watched_at</td>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            `

            for (let r in result.tartalom) {
                if (r > (result.tartalom.length - 50)) {
                    var sor = result.tartalom[r]

                    document.querySelector("#sqlElozmenyWatchedEps .watchedEps_table tbody").innerHTML += `
                        <tr>
                            <td>${result.tartalom.length - r}.</td>
                            <td>${sor.watched_episode_id}</td>
                            <td>${sor.user_id}</td>
                            <td>${sor.series_id}</td>
                            <td>${sor.episode_id}</td>
                            <td>${formatDate(sor.watched_at)}</td>
                        </tr>
                    `
                }
            }
        }
        
    } catch(e) {
        console.log("Error:", e)
    }
}

