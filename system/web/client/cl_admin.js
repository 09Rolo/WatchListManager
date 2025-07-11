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
            headers: { 'Content-Type': 'application/json' },
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
                        headers: { 'Content-Type': 'application/json' }
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
    }
}





async function mediaKezeloSetup() {
    if (userGroup && userGroup == "owner") {
        var mediaKezelo = document.getElementById("mediaKezelo")

        mediaKezelo.innerHTML = `
            <br>
            <form class="d-flex mx-auto" role="search">
                <input id="searchbar_tv" class="form-control me-2 searchbar" type="search" placeholder="Sorozat kereső" aria-label="Sorozat keresés">
            </form>
            <br>
            <form class="d-flex mx-auto" role="search">
                <input id="searchbar_movie" class="form-control me-2 searchbar" type="search" placeholder="Film kereső" aria-label="Film keresés">
            </form>
            <br><hr><br>
            <div id="searched_sorozatok" class="searchedThings"></div>
            <br><br>
            <div id="searched_filmek" class="searchedThings"></div>
        `

        searchKezeles()
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






async function searchKezeles() {
    document.querySelectorAll(".searchbar").forEach(sbar => {
        sbar.addEventListener("input", debounce((e) => {
            searching(e.target)
        }))
    })


    document.querySelectorAll(".searchbar").forEach(sbar => {
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




async function searching(div) {
    search = div.value

    if (div.id == "searchbar_tv") {

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

    } else if(div.id == "searchbar_movie") {

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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(details)
        })
        
        const result = await response.json()
        
        notify(result.message, result.type)
    } catch(e) {
        console.log("Error:", e)
    }
}
