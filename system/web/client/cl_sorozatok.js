//DOM Cuccok
//menu
const menu_account = document.getElementById("menu_account")
const menu_login_register = document.getElementById("menu_login_register")
const menu_logout = document.getElementById("menu_logout")
const menu_account_href = document.getElementById("menu_account_href")
const menu_username = document.getElementById("menu_username")
const menu_logout_button = document.getElementById("menu_logout_button")

var watchedSeries = []
var wishlistedSeries = []
var partiallWatched = []

var sumOfMegnezettSorozatok = 0
var sumOfElkezdettSorozatok = 0
var sumOfWishlistesSorozatok = 0
var sumOfMegnezettEpizodok = 0



window.onload = async () => {
    menu_account.style.display = "none"
    menu_login_register.style.display = "none"
    menu_logout.style.display = "none"

    const token = localStorage.getItem("token")
    const isLoggedin = await checkLogin(token)

    if (isLoggedin) {
        loggedIn()
    } else {
        window.location.pathname = "/"
    }
}



var API_KEY = ""

async function loggedIn() {
    menu_login_register.style.display = "none"
    menu_account.style.display = ""
    menu_logout.style.display = ""

    menu_account_href.href = `/u/${JSON.parse(localStorage.getItem("user")).username}`
    menu_username.innerHTML = JSON.parse(localStorage.getItem("user")).username



    try {
        const response = await fetch(`${location.origin}/getAPIinfo`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        })
    
        const result = await response.json()
    
        if (response.ok) {
            API_KEY = result.apiKey

            getWishlisted()
            getWatched()

            
            setTimeout(() => {
                fillSajatSeries()
            }, 1500);


        } else {
            notify("Hiba történt az API-al", "error")
        }
    
    } catch(e) {
        console.error(e)
    }
}


menu_logout_button.onclick = async () => {
    await logout()

    window.location.reload()
}



//Keresés cucc
const searched_series_list = document.getElementById("searched_series_list")
const sajat_series_list = document.getElementById("sajat_series_list")

const sajat_series_partial = document.getElementById("sajat_series_partial")
const sajat_series_wishlisted = document.getElementById("sajat_series_wishlisted")
const sajat_series_watched = document.getElementById("sajat_series_watched")



const searchbar = document.getElementById("searchbar")
var search = ""
var language = 'hu'



function manageLang() {
    const sectionParts = window.location.pathname.split("/")
    const section = sectionParts[2]

    if (section && section == "hu") {
        language = "hu"
    } else if (section && section == "en") {
        language = "en"
    }

    
    if (getLanguageCookie() != null && !section) {
        language = getLanguageCookie()
    }
}

manageLang()





//image observer cucc, hogy ne buggoljon annyira a weboldal elvileg?
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
        
            checkImgLoaded(2000)
            //observer.unobserve(img);
        } else {
            const img = entry.target;
            img.src = "./imgs/placeholder.png";
        }
    });
});
//observer.observe(img); //hozzáadni így lehet







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





searchbar.onkeydown = function(e) {
    if (e.keyCode == 13) {
        searchbar.blur()
        e.preventDefault()
    }
}


searchbar.addEventListener("input", debounce((e) => {
    searching(e.target.value)
}))

window.addEventListener("pageshow", (event) => {
    searching(searchbar.value)
})



async function searching(tartalom) {
    search = tartalom

    try {
        const getData = await fetch(`https://api.themoviedb.org/3/search/tv?query=${search}&api_key=${API_KEY}&language=${language}`)
        const adatok = await getData.json()
    
        if (adatok.results) {
            const sortedSeries = adatok.results.sort((a, b) => b.popularity - a.popularity);
            //console.log(sortedSeries);

            searched_series_list.innerHTML = ""
            sajat_series_list.innerHTML = ""

            sajat_series_partial.innerHTML = ""
            sajat_series_wishlisted.innerHTML = ""
            sajat_series_watched.innerHTML = ""


            sortedSeries.forEach(el => {
            
                var cardColor = ""
                var cardBodyClass = ""
                
                for(let i in watchedSeries) {
                    if (watchedSeries[i] == el.id && el.name != undefined) {
                        //sajátba is
                        cardColor = "var(--watched)"
                        cardBodyClass = "card-body-watched"

                        sajat_series_watched.innerHTML += `
                            <div class="card" style="background-color: ${cardColor};" id="${el.id}" style="width: 18rem;">
                                <img data-src="https://image.tmdb.org/t/p/w500${el.poster_path}" src="./imgs/placeholder.png" loading="lazy" class="bluredimg" alt="poszter">
                                <div class="imgkeret">
                                    <img data-src="https://image.tmdb.org/t/p/w500${el.poster_path}" src="./imgs/placeholder.png" loading="lazy" class="card-img-top" alt="Sorozat Poszter">
                                </div>
                                <div class="card-body ${cardBodyClass}">
                                    <h5 class="card-title"><b>${el.name}</b></h5>
                                    <i class="bi bi-journal-arrow-up showtexticon"></i>
                                    <p class="card-text">${el.overview}</p>
                                    <a href="#" id="${el.id}" class="btn btn-primary adatlap-button">Adatlap</a>
                                    <p class="rating" style="color: ${ratingColor(el.vote_average)};">${Math.round(el.vote_average * 100) / 100}</p>
                                </div>
                                <div class="card-footer">
                                    <small class="text-body-secondary">Megjelenés: ${el.first_air_date}</small>
                                </div>
                            </div>
                        `
                    }
                }


                for(let i in partiallWatched) {
                    if (partiallWatched[i] == el.id && el.name != undefined) {
                        //sajátba is
                        cardColor = "var(--started-series-lathatobb-bg)"
                        cardBodyClass = "card-body-watched_partially"

                        sajat_series_partial.innerHTML += `
                            <div class="card" style="background-color: ${cardColor};" id="${el.id}" style="width: 18rem;">
                                <img data-src="https://image.tmdb.org/t/p/w500${el.poster_path}" src="./imgs/placeholder.png" loading="lazy" class="bluredimg" alt="poszter">
                                <div class="imgkeret">
                                    <img data-src="https://image.tmdb.org/t/p/w500${el.poster_path}" src="./imgs/placeholder.png" loading="lazy" class="card-img-top" alt="Sorozat Poszter">
                                </div>
                                <div class="card-body ${cardBodyClass}">
                                    <h5 class="card-title"><b>${el.name}</b></h5>
                                    <i class="bi bi-journal-arrow-up showtexticon"></i>
                                    <p class="card-text">${el.overview}</p>
                                    <a href="#" id="${el.id}" class="btn btn-primary adatlap-button">Adatlap</a>
                                    <p class="rating" style="color: ${ratingColor(el.vote_average)};">${Math.round(el.vote_average * 100) / 100}</p>
                                </div>
                                <div class="card-footer">
                                    <small class="text-body-secondary">Megjelenés: ${el.first_air_date}</small>
                                </div>
                            </div>
                        `
                    }
                }


                for(let i in wishlistedSeries) {
                    if (wishlistedSeries[i] == el.id && el.name != undefined) {
                        //sajátba is
                        cardColor = "var(--wishlisted)"
                        cardBodyClass = "card-body-wishlisted"

                        sajat_series_wishlisted.innerHTML += `
                            <div class="card" style="background-color: ${cardColor};" id="${el.id}" style="width: 18rem;">
                                <img data-src="https://image.tmdb.org/t/p/w500${el.poster_path}" src="./imgs/placeholder.png" loading="lazy" class="bluredimg" alt="poszter">
                                <div class="imgkeret">
                                    <img data-src="https://image.tmdb.org/t/p/w500${el.poster_path}" src="./imgs/placeholder.png" loading="lazy" class="card-img-top" alt="Sorozat Poszter">
                                </div>
                                <div class="card-body ${cardBodyClass}">
                                    <h5 class="card-title"><b>${el.name}</b></h5>
                                    <i class="bi bi-journal-arrow-up showtexticon"></i>
                                    <p class="card-text">${el.overview}</p>
                                    <a href="#" id="${el.id}" class="btn btn-primary adatlap-button">Adatlap</a>
                                    <p class="rating" style="color: ${ratingColor(el.vote_average)};">${Math.round(el.vote_average * 100) / 100}</p>
                                </div>
                                <div class="card-footer">
                                    <small class="text-body-secondary">Megjelenés: ${el.first_air_date}</small>
                                </div>
                            </div>
                        `
                    }
                }


                searched_series_list.innerHTML += `
                    <div class="card" style="background-color: ${cardColor};" id="${el.id}" style="width: 18rem;">
                        <img data-src="https://image.tmdb.org/t/p/w500${el.poster_path}" src="./imgs/placeholder.png" loading="lazy" class="bluredimg" alt="poszter">
                        <div class="imgkeret">
                            <img data-src="https://image.tmdb.org/t/p/w500${el.poster_path}" src="./imgs/placeholder.png" loading="lazy" class="card-img-top" alt="Sorozat Poszter">
                        </div>
                        <div class="card-body ${cardBodyClass}">
                            <h5 class="card-title"><b>${el.name}</b></h5>
                            <i class="bi bi-journal-arrow-up showtexticon"></i>
                            <p class="card-text">${el.overview}</p>
                            <a href="#" id="${el.id}" class="btn btn-primary adatlap-button">Adatlap</a>
                            <p class="rating" style="color: ${ratingColor(el.vote_average)};">${Math.round(el.vote_average * 100) / 100}</p>
                        </div>
                        <div class="card-footer">
                            <small class="text-body-secondary">Megjelenés: ${el.first_air_date}</small>
                        </div>
                    </div>
                `

                document.querySelectorAll(`.card img`).forEach(image => {
                    observer.observe(image)
                })
            });


          GiveHrefToAdatlapButton()

          setUpcomingErtekelesCucc()

          checkImgLoaded()



            if (searched_series_list.innerHTML == "") {
                searched_series_list.innerHTML = "<p class='info'>Nincs itt semmi, írj be valamit a keresőbe</p>"
            }



            if (sajat_series_partial.innerHTML == "") {
                sajat_series_partial.innerHTML = "<p class='info'>Nincs itt semmi, adj hozzá valamit a fiókodhoz a keresésekből</p>"
            }

            if (sajat_series_wishlisted.innerHTML == "") {
                sajat_series_wishlisted.innerHTML = "<p class='info'>Nincs itt semmi, adj hozzá valamit a fiókodhoz a keresésekből</p>"
            }

            if (sajat_series_watched.innerHTML == "") {
                sajat_series_watched.innerHTML = "<p class='info'>Nincs itt semmi, adj hozzá valamit a fiókodhoz a keresésekből</p>"
            }


            if (search.length == 0) {
                fillSajatSeries()
            }
        }
    } catch(e) {
        console.error(e)
    }
    

}




function GiveHrefToAdatlapButton() {
    var adatlapB = document.getElementsByClassName("adatlap-button")

    Array.from(adatlapB).forEach(el => {
        el.href = `${window.location.origin}/sorozat/${el.id}`
    })
    
}





//megkapni az összes cuccot

async function getWishlisted() {
    var amiMegy = {
        user_id: JSON.parse(localStorage.user).user_id,
        tipus: "tv"
    }

    try {
        const response = await fetch(`${location.origin}/getWishlist`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(amiMegy)
        })
    
        const result = await response.json()
    
        if (response.ok) {
            for(let i in result.dataVissza) {
                if (watchedSeries.includes(result.dataVissza[i].media_id)) {
                    
                } else {
                    wishlistedSeries.push(result.dataVissza[i].media_id)
                }
                
            }
        }
    } catch(e) {
        console.error(e)
    }
}






async function getWatched() {
    var SorozatokAmikVoltak = []


    var amiMegy = {
        user_id: JSON.parse(localStorage.user).user_id,
        tipus: "tv"
    }

    try {
        const response = await fetch(`${location.origin}/getWatched`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(amiMegy)
        })
    
        const result = await response.json()
    
        if (response.ok) {
            for(let i in result.dataVissza) {
                if (!SorozatokAmikVoltak.includes(result.dataVissza[i].media_id)) {
                    SorozatokAmikVoltak.push(result.dataVissza[i].media_id)
                }
            }


            for(let x in SorozatokAmikVoltak) {

                setTimeout(async () => {
                    var sori = SorozatokAmikVoltak[x]
                    var fullmegnezte = await isFullyWatched(sori)

                    if (fullmegnezte) {
                        if (!partiallWatched.includes(sori)) { //csak a biztonság kedvéért
                            watchedSeries.push(sori)
                        }
                    } else {
                        if (!watchedSeries.includes(sori)) {
                            partiallWatched.push(sori)
                        }
                    }
                }, 100);

            }

        }
    } catch(e) {
        console.error(e)
    }
}




async function isFullyWatched(elem) {
    var allEpisodes = 0
    var watchedEpisodes = 0
    var vanSpecialSeasonje = false
    var s0asEpizodok = []

    try {
        const getData = await fetch(`https://api.themoviedb.org/3/tv/${elem}?api_key=${API_KEY}&language=${language}`)

        const adatok = await getData.json()
        if (adatok) {
            var now = new Date()


            if (adatok.seasons[0].season_number == 1) {
                for (let seasons = 0; seasons < adatok.seasons.length; seasons++) {
                    const element = adatok.seasons[seasons];

                    if (new Date(element.air_date) <= now) {
                        allEpisodes += element.episode_count
                    }
                }
            } else if(adatok.seasons[0].season_number != 1) {
                vanSpecialSeasonje = true

                for (let seasons = 1; seasons < adatok.seasons.length; seasons++) {
                    const element = adatok.seasons[seasons];
                    
                    if (new Date(element.air_date) <= now) {
                        allEpisodes += element.episode_count
                    }
                }
            }

            

            var amiMegy = {
                user_id: JSON.parse(localStorage.user).user_id,
                tipus: "tv"
            }

            try {
                const response = await fetch(`${location.origin}/getWatched`, {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(amiMegy)
                })
            
                const result = await response.json()
            
                if (response.ok) {

                    if (vanSpecialSeasonje) {
                        //lekérés
                        try {
                            const getData_seasons = await fetch(`https://api.themoviedb.org/3/tv/${elem}/season/0?api_key=${API_KEY}&language=${language}`)
                            const season = await getData_seasons.json()
                        
                            for (let e in season.episodes) {
                                s0asEpizodok.push(season.episodes[e].id)
                            }
                        } catch (e) {
                            console.error(e)
                        }
                    }


                    
                    for(let i in result.dataVissza) {
                        if (result.dataVissza[i].media_id == elem) {
                            //le kell kérni a 0 seasont hogyha van, és megnézni, hogy benne van e a result.dataVissza[i].episode_id
                            if (vanSpecialSeasonje) {
                                if (s0asEpizodok && s0asEpizodok.length > 0) {
                                    if (!s0asEpizodok.includes(result.dataVissza[i].episode_id)) {
                                        watchedEpisodes += 1
                                    }
                                } else {
                                    watchedEpisodes += 1
                                }
                            } else {
                                watchedEpisodes += 1
                            }
                        }
                    }
                }
            } catch(e) {
                console.error(e)
            }


            //console.log(allEpisodes, adatok.name)
            //console.log(watchedEpisodes)
            sumOfMegnezettEpizodok += watchedEpisodes

            if (watchedEpisodes >= allEpisodes) {
                return true
            } else {
                return false
            }
        }

    } catch(e) {return false}

}







///DBből, ha all az indexelhet akkor mehet

async function fillSajatSeries() {

    sajat_series_list.innerHTML = ""


    if (wishlistedSeries.length > 0) {
        sajat_series_wishlisted.innerHTML = ""
    } else {
        sajat_series_wishlisted.innerHTML = "<p class='info'>Nincs itt semmi, adj hozzá valamit a fiókodhoz a keresésekből</p>"
    }


    if (watchedSeries.length > 0) {
        sajat_series_watched.innerHTML = ""
    } else {
        sajat_series_watched.innerHTML = "<p class='info'>Nincs itt semmi, adj hozzá valamit a fiókodhoz a keresésekből</p>"
    }


    if (partiallWatched.length > 0) {
        sajat_series_partial.innerHTML = ""
    } else {
        sajat_series_partial.innerHTML = "<p class='info'>Nincs itt semmi, adj hozzá valamit a fiókodhoz a keresésekből</p>"
    }



    for(let i in partiallWatched) {
        const getData = await fetch(`https://api.themoviedb.org/3/tv/${partiallWatched[i]}?api_key=${API_KEY}&language=${language}`)
        const adatok = await getData.json()
        
        if (adatok && adatok.name != undefined) {
            //console.log(adatok);
            
            var cardColor = "var(--started-series-lathatobb-bg)"
    
            sajat_series_partial.innerHTML += `
                <div class="card" style="background-color: ${cardColor};" id="${adatok.id}" style="width: 18rem;">
                    <img data-src="https://image.tmdb.org/t/p/w500${adatok.poster_path}" src="./imgs/placeholder.png" loading="lazy" class="bluredimg" alt="poszter">
                    <div class="imgkeret">
                        <img data-src="https://image.tmdb.org/t/p/w500${adatok.poster_path}" src="./imgs/placeholder.png" loading="lazy" class="card-img-top" alt="Sorozat Poszter">
                    </div>
                    <div class="card-body card-body-watched_partially">
                        <h5 class="card-title"><b>${adatok.name}</b></h5>
                        <i class="bi bi-journal-arrow-up showtexticon"></i>
                        <p class="card-text">${adatok.overview}</p>
                        <a href="#" id="${adatok.id}" class="btn btn-primary adatlap-button">Adatlap</a>
                        <p class="rating" style="color: ${ratingColor(adatok.vote_average)};">${Math.round(adatok.vote_average * 100) / 100}</p>
                    </div>
                    <div class="card-footer">
                        <small class="text-body-secondary">Megjelenés: ${adatok.first_air_date}</small>
                    </div>
                </div>
            `

            document.querySelectorAll(`.card img`).forEach(image => {
                observer.observe(image)
            })


            sumOfElkezdettSorozatok += 1
        }
    }




    for(let i in wishlistedSeries) {
        const getData = await fetch(`https://api.themoviedb.org/3/tv/${wishlistedSeries[i]}?api_key=${API_KEY}&language=${language}`)
        const adatok = await getData.json()
        
        if (adatok && adatok.name != undefined) {
            //console.log(adatok);
            
            var cardColor = "var(--wishlisted)"
    
            sajat_series_wishlisted.innerHTML += `
                <div class="card" style="background-color: ${cardColor};" id="${adatok.id}" style="width: 18rem;">
                    <img data-src="https://image.tmdb.org/t/p/w500${adatok.poster_path}" src="./imgs/placeholder.png" loading="lazy" class="bluredimg" alt="poszter">
                    <div class="imgkeret">
                        <img data-src="https://image.tmdb.org/t/p/w500${adatok.poster_path}" src="./imgs/placeholder.png" loading="lazy" class="card-img-top" alt="Sorozat Poszter">
                    </div>
                    <div class="card-body card-body-wishlisted">
                        <h5 class="card-title"><b>${adatok.name}</b></h5>
                        <i class="bi bi-journal-arrow-up showtexticon"></i>
                        <p class="card-text">${adatok.overview}</p>
                        <a href="#" id="${adatok.id}" class="btn btn-primary adatlap-button">Adatlap</a>
                        <p class="rating" style="color: ${ratingColor(adatok.vote_average)};">${Math.round(adatok.vote_average * 100) / 100}</p>
                    </div>
                    <div class="card-footer">
                        <small class="text-body-secondary">Megjelenés: ${adatok.first_air_date}</small>
                    </div>
                </div>
            `

            document.querySelectorAll(`.card img`).forEach(image => {
                observer.observe(image)
            })


            sumOfWishlistesSorozatok += 1
        }
    }



    for(let i in watchedSeries) {
        const getData = await fetch(`https://api.themoviedb.org/3/tv/${watchedSeries[i]}?api_key=${API_KEY}&language=${language}`)
        const adatok = await getData.json()
        
        if (adatok && adatok.name != undefined) {
            //console.log(adatok);
            
            var cardColor = "var(--watched)"
    
            sajat_series_watched.innerHTML += `
                <div class="card" style="background-color: ${cardColor};" id="${adatok.id}" style="width: 18rem;">
                    <img data-src="https://image.tmdb.org/t/p/w500${adatok.poster_path}" src="./imgs/placeholder.png" loading="lazy" class="bluredimg" alt="poszter">
                    <div class="imgkeret">
                        <img data-src="https://image.tmdb.org/t/p/w500${adatok.poster_path}" src="./imgs/placeholder.png" loading="lazy" class="card-img-top" alt="Sorozat Poszter">
                    </div>
                    <div class="card-body card-body-watched">
                        <h5 class="card-title"><b>${adatok.name}</b></h5>
                        <i class="bi bi-journal-arrow-up showtexticon"></i>
                        <p class="card-text">${adatok.overview}</p>
                        <a href="#" id="${adatok.id}" class="btn btn-primary adatlap-button">Adatlap</a>
                        <p class="rating" style="color: ${ratingColor(adatok.vote_average)};">${Math.round(adatok.vote_average * 100) / 100}</p>
                    </div>
                    <div class="card-footer">
                        <small class="text-body-secondary">Megjelenés: ${adatok.first_air_date}</small>
                    </div>
                </div>
            `

            document.querySelectorAll(`.card img`).forEach(image => {
                observer.observe(image)
            })


            sumOfMegnezettSorozatok += 1
        }
    }

    

    GiveHrefToAdatlapButton()

    setUpcomingErtekelesCucc()

    checkImgLoaded()
    
    showAvailableInfo()
}




function toggleWishlisted() {
    if(sajat_series_wishlisted.style.display == "none") {
        sajat_series_wishlisted.style.display = "flex"
        document.getElementById("wishlistedSeriesToggleBtn").innerHTML = "Kívánságlistás sorozataid elrejtése"
    } else {
        sajat_series_wishlisted.style.display = "none"
        document.getElementById("wishlistedSeriesToggleBtn").innerHTML = "Kívánságlistás sorozataid megjelenítése"
    }
}


function toggleWatched() {
    if(sajat_series_watched.style.display == "none") {
        sajat_series_watched.style.display = "flex"
        document.getElementById("watchedSeriesToggleBtn").innerHTML = "Megnézett sorozataid elrejtése"
    } else {
        sajat_series_watched.style.display = "none"
        document.getElementById("watchedSeriesToggleBtn").innerHTML = "Megnézett sorozataid megjelenítése"
    }
}

function togglePartial() {
    if(sajat_series_partial.style.display == "none") {
        sajat_series_partial.style.display = "flex"
        document.getElementById("partialSeriesToggleBtn").innerHTML = "Elkezdett sorozataid elrejtése"
    } else {
        sajat_series_partial.style.display = "none"
        document.getElementById("partialSeriesToggleBtn").innerHTML = "Elkezdett sorozataid megjelenítése"
    }
}




function showAvailableInfo() {

    if (sumOfElkezdettSorozatok > 0 || sumOfMegnezettSorozatok > 0 || sumOfWishlistesSorozatok > 0) {
        let ibetu = document.createElement("div")
        ibetu.id = "infoIBetu"
        ibetu.innerHTML = `
            <button onclick="toggleIBetuInfo()"><i class="bi bi-info-circle"></i></button>
        `

        let iBetuInfoBox = document.createElement("div")
        iBetuInfoBox.id = "iBetuInfoBox"
        iBetuInfoBox.style.opacity = 0
        iBetuInfoBox.innerHTML = `
            <div class="box cant_select" style="border-bottom: none;" onclick="toggleIBetuInfo()">
                <h4>Információ</h4>
                <h5>X</h5>
                <hr>
                <div><p>Összes hozzáadott sorozatok száma: </p><p>${sumOfElkezdettSorozatok + sumOfMegnezettSorozatok + sumOfWishlistesSorozatok}</p></div>
                <div><p>Megnézett sorozatok száma: </p><p>${sumOfMegnezettSorozatok}</p></div>
                <div><p>Elkezdett sorozatok száma: </p><p>${sumOfElkezdettSorozatok}</p></div>
                <div><p>Kívánságlistás sorozatok száma: </p><p>${sumOfWishlistesSorozatok}</p></div>
                <br>
                <div><p>Összesen megnézett epizódok száma: </p><p>${sumOfMegnezettEpizodok}</p></div>
            </div>
        `

        document.getElementById("main").appendChild(ibetu)
        document.getElementById("main").appendChild(iBetuInfoBox)
    }

}


function toggleIBetuInfo() {
    const iBetuInfoBox = document.getElementById("iBetuInfoBox")

    if (iBetuInfoBox.style.opacity == 0) {
        iBetuInfoBox.style.opacity = 1
    } else if(iBetuInfoBox.style.opacity == 1) {
        iBetuInfoBox.style.opacity = 0
    }

}
