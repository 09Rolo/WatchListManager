//DOM Cuccok
//menu
const menu_account = document.getElementById("menu_account")
const menu_login_register = document.getElementById("menu_login_register")
const menu_logout = document.getElementById("menu_logout")
const menu_account_href = document.getElementById("menu_account_href")
const menu_username = document.getElementById("menu_username")
const menu_logout_button = document.getElementById("menu_logout_button")

var watchedMovies = []
var wishlistedMovies = []


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

//welcomer.innerHTML = `Üdvözlet ${JSON.parse(localStorage.getItem("user")).username}!`
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
const searched_movies_list = document.getElementById("searched_movies_list")
const sajat_movies_list = document.getElementById("sajat_movies_list")


const searchbar = document.getElementById("searchbar")
var search = ""
var language = 'hu'

searchbar.addEventListener("input", async (e) => {
    search = e.target.value


    const sectionParts = window.location.pathname.split("/")
    const section = sectionParts[2]

    if (section && section == "hu") {
        language = "hu"
    } else if (section && section == "en") {
        language = "en"
    }


    try {
        const getData = await fetch(`https://api.themoviedb.org/3/search/movie?query=${search}&api_key=${API_KEY}&language=${language}`)
        const adatok = await getData.json()
    
        if (adatok.results) {
          const sortedMovies = adatok.results.sort((a, b) => b.popularity - a.popularity);
          console.log(sortedMovies);

          searched_movies_list.innerHTML = ""
          sajat_movies_list.innerHTML = ""

          sortedMovies.forEach(el => {
        
            var cardColor = ""

            for(i in watchedMovies) {
                if (watchedMovies[i] == el.id) {
                    //sajátba is
                    cardColor = "var(--watched)"

                    sajat_movies_list.innerHTML += `
                        <div class="card" style="background-color: ${cardColor};" id="${el.id}" style="width: 18rem;">
                            <img src="https://image.tmdb.org/t/p/w500${el.poster_path}" class="bluredimg" alt="poszter">
                            <div class="imgkeret">
                                <img src="https://image.tmdb.org/t/p/w500${el.poster_path}" class="card-img-top" alt="film poszter">
                            </div>
                            <div class="card-body">
                                <h5 class="card-title"><b>${el.title}</b></h5>
                                <i class="bi bi-journal-arrow-up showtexticon"></i>
                                <p class="card-text">${el.overview}</p>
                                <a href="#" id="${el.id}" class="btn btn-primary adatlap-button">Adatlap</a>
                                <p class="rating" style="color: ${ratingColor(el.vote_average)};">${Math.round(el.vote_average * 100) / 100}</p>
                            </div>
                            <div class="card-footer">
                                <small class="text-body-secondary">Megjelenés: ${el.release_date}</small>
                            </div>
                        </div>
                    `
                }
            }

            for(i in wishlistedMovies) {
                if (wishlistedMovies[i] == el.id) {
                    //sajátba is
                    cardColor = "var(--wishlisted)"

                    sajat_movies_list.innerHTML += `
                        <div class="card" style="background-color: ${cardColor};" id="${el.id}" style="width: 18rem;">
                            <img src="https://image.tmdb.org/t/p/w500${el.poster_path}" class="bluredimg" alt="poszter">
                            <div class="imgkeret">
                                <img src="https://image.tmdb.org/t/p/w500${el.poster_path}" class="card-img-top" alt="film poszter">
                            </div>
                            <div class="card-body">
                                <h5 class="card-title"><b>${el.title}</b></h5>
                                <i class="bi bi-journal-arrow-up showtexticon"></i>
                                <p class="card-text">${el.overview}</p>
                                <a href="#" id="${el.id}" class="btn btn-primary adatlap-button">Adatlap</a>
                                <p class="rating" style="color: ${ratingColor(el.vote_average)};">${Math.round(el.vote_average * 100) / 100}</p>
                            </div>
                            <div class="card-footer">
                                <small class="text-body-secondary">Megjelenés: ${el.release_date}</small>
                            </div>
                        </div>
                    `
                }
            }


            searched_movies_list.innerHTML += `
                <div class="card" style="background-color: ${cardColor};" id="${el.id}" style="width: 18rem;">
                    <img src="https://image.tmdb.org/t/p/w500${el.poster_path}" class="bluredimg" alt="poszter">
                    <div class="imgkeret">
                        <img src="https://image.tmdb.org/t/p/w500${el.poster_path}" class="card-img-top" alt="film poszter">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title"><b>${el.title}</b></h5>
                        <i class="bi bi-journal-arrow-up showtexticon"></i>
                        <p class="card-text">${el.overview}</p>
                        <a href="#" id="${el.id}" class="btn btn-primary adatlap-button">Adatlap</a>
                        <p class="rating" style="color: ${ratingColor(el.vote_average)};">${Math.round(el.vote_average * 100) / 100}</p>
                    </div>
                    <div class="card-footer">
                        <small class="text-body-secondary">Megjelenés: ${el.release_date}</small>
                    </div>
                </div>
            `
          });


          GiveHrefToAdatlapButton()

          if (searched_movies_list.innerHTML == "") {
            searched_movies_list.innerHTML = "<p class='info'>Nincs itt semmi, írj be valamit a keresőbe</p>"
          }

          if (sajat_movies_list.innerHTML == "") {
            sajat_movies_list.innerHTML = "<p class='info'>Nincs itt semmi, adj hozzá valamit a fiókodhoz a keresésekből</p>"

            if (search.length == 0) {
                fillSajatMovies()
            }
          }
        }
    } catch(e) {
        console.error(e)
    }
    

})



function ratingColor(rating) {
    if (rating >= 7.5) {
        return "green"
    } else if (rating >= 5) {
        return "orange"
    } else {
        return "red"
    }
}


function GiveHrefToAdatlapButton() {
    var adatlapB = document.getElementsByClassName("adatlap-button")

    Array.from(adatlapB).forEach(el => {
        el.href = `${window.location.origin}/film/${el.id}`
    })
    
}




//megkapni az összes cuccot

async function getWatched() {
    var amiMegy = {
        user_id: JSON.parse(localStorage.user).user_id,
        tipus: "movie"
    }

    try {
        const response = await fetch(`${location.origin}/getWatched`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(amiMegy)
        })
    
        const result = await response.json()
    
        if (response.ok) {
            for(i in result.dataVissza) {
                watchedMovies.push(result.dataVissza[i].media_id)
            }
        }
    } catch(e) {
        console.error(e)
    }
}

getWatched()



async function getWishlisted() {
    var amiMegy = {
        user_id: JSON.parse(localStorage.user).user_id,
        tipus: "movie"
    }

    try {
        const response = await fetch(`${location.origin}/getWishlist`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(amiMegy)
        })
    
        const result = await response.json()
    
        if (response.ok) {
            for(i in result.dataVissza) {
                wishlistedMovies.push(result.dataVissza[i].media_id)
            }
        }
    } catch(e) {
        console.error(e)
    }
}

getWishlisted()



///DBből, ha all az indexelhet akkor mehet

async function fillSajatMovies() {

    if (wishlistedMovies.length > 0 || watchedMovies.length > 0) {
        sajat_movies_list.innerHTML = ""
    } else {
        sajat_movies_list.innerHTML = '<p class="info">Nincs itt semmi, adj hozzá valamit a fiókodhoz a keresésekből</p>'
    }


    for(i in wishlistedMovies) {
        const getData = await fetch(`https://api.themoviedb.org/3/movie/${wishlistedMovies[i]}?api_key=${API_KEY}&language=${language}`)
        const adatok = await getData.json()
        
        if (adatok) {
            console.log(adatok);
            
            var cardColor = "var(--wishlisted)"
    
            sajat_movies_list.innerHTML += `
                <div class="card" style="background-color: ${cardColor};" id="${adatok.id}" style="width: 18rem;">
                    <img src="https://image.tmdb.org/t/p/w500${adatok.poster_path}" class="bluredimg" alt="poszter">
                    <div class="imgkeret">
                        <img src="https://image.tmdb.org/t/p/w500${adatok.poster_path}" class="card-img-top" alt="film poszter">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title"><b>${adatok.title}</b></h5>
                        <i class="bi bi-journal-arrow-up showtexticon"></i>
                        <p class="card-text">${adatok.overview}</p>
                        <a href="#" id="${adatok.id}" class="btn btn-primary adatlap-button">Adatlap</a>
                        <p class="rating" style="color: ${ratingColor(adatok.vote_average)};">${Math.round(adatok.vote_average * 100) / 100}</p>
                    </div>
                    <div class="card-footer">
                        <small class="text-body-secondary">Megjelenés: ${adatok.release_date}</small>
                    </div>
                </div>
            `
        }
    }


    for(i in watchedMovies) {
        const getData = await fetch(`https://api.themoviedb.org/3/movie/${watchedMovies[i]}?api_key=${API_KEY}&language=${language}`)
        const adatok = await getData.json()
        
        if (adatok) {
            console.log(adatok);
            
            var cardColor = "var(--watched)"
    
            sajat_movies_list.innerHTML += `
                <div class="card" style="background-color: ${cardColor};" id="${adatok.id}" style="width: 18rem;">
                    <img src="https://image.tmdb.org/t/p/w500${adatok.poster_path}" class="bluredimg" alt="poszter">
                    <div class="imgkeret">
                        <img src="https://image.tmdb.org/t/p/w500${adatok.poster_path}" class="card-img-top" alt="film poszter">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title"><b>${adatok.title}</b></h5>
                        <i class="bi bi-journal-arrow-up showtexticon"></i>
                        <p class="card-text">${adatok.overview}</p>
                        <a href="#" id="${adatok.id}" class="btn btn-primary adatlap-button">Adatlap</a>
                        <p class="rating" style="color: ${ratingColor(adatok.vote_average)};">${Math.round(adatok.vote_average * 100) / 100}</p>
                    </div>
                    <div class="card-footer">
                        <small class="text-body-secondary">Megjelenés: ${adatok.release_date}</small>
                    </div>
                </div>
            `
        }
    }

    GiveHrefToAdatlapButton()

}


setTimeout(() => {
    fillSajatMovies()
}, 2000);
