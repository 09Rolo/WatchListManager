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
            notify("API Error", "error")
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

const sajat_movies_wishlisted = document.getElementById("sajat_movies_wishlisted")
const sajat_movies_watched = document.getElementById("sajat_movies_watched")


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


    loadTranslations(language)
}

manageLang()





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
        const getData = await fetch(`https://api.themoviedb.org/3/search/movie?query=${search}&api_key=${API_KEY}&language=${language}`)
        const adatok = await getData.json()
    
        if (adatok.results) {
          const sortedMovies = adatok.results.sort((a, b) => b.popularity - a.popularity);
          //console.log(sortedMovies);

          searched_movies_list.innerHTML = ""
          sajat_movies_list.innerHTML = ""

          sajat_movies_watched.innerHTML = ""
          sajat_movies_wishlisted.innerHTML = ""

          sortedMovies.forEach(el => {
        
            var cardColor = ""
            var cardBodyClass = ""

            for(let i in watchedMovies) {
                if (watchedMovies[i] == el.id && el.title != undefined) {
                    //sajátba is
                    cardColor = "var(--watched)"
                    cardBodyClass = "card-body-watched"

                    sajat_movies_watched.innerHTML += `
                        <div class="card" style="background-color: ${cardColor};" id="${el.id}" style="width: 18rem;">
                            <img data-src="https://image.tmdb.org/t/p/w500${el.poster_path}" src="./imgs/placeholder.png" loading="lazy" class="bluredimg" alt="poszter">
                            <div class="imgkeret">
                                <img data-src="https://image.tmdb.org/t/p/w500${el.poster_path}" src="./imgs/placeholder.png" loading="lazy" class="card-img-top" alt="film poszter">
                            </div>
                            <div class="card-body ${cardBodyClass}">
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

                    GiveHrefToAdatlapButton()
                }
            }

            for(let i in wishlistedMovies) {
                if (wishlistedMovies[i] == el.id && el.title != undefined) {
                    //sajátba is
                    cardColor = "var(--wishlisted)"
                    cardBodyClass = "card-body-wishlisted"

                    sajat_movies_wishlisted.innerHTML += `
                        <div class="card" style="background-color: ${cardColor};" id="${el.id}" style="width: 18rem;">
                            <img data-src="https://image.tmdb.org/t/p/w500${el.poster_path}" src="./imgs/placeholder.png" loading="lazy" class="bluredimg" alt="poszter">
                            <div class="imgkeret">
                                <img data-src="https://image.tmdb.org/t/p/w500${el.poster_path}" src="./imgs/placeholder.png" loading="lazy" class="card-img-top" alt="film poszter">
                            </div>
                            <div class="card-body ${cardBodyClass}">
                                <h5 class="card-title"><b>${el.title}</b></h5>
                                <i class="bi bi-journal-arrow-up showtexticon"></i>
                                <p class="card-text">${el.overview}</p>
                                <a href="#" id="${el.id}" class="btn btn-primary adatlap-button" data-t="basic.details">Adatlap</a>
                                <p class="rating" style="color: ${ratingColor(el.vote_average)};">${Math.round(el.vote_average * 100) / 100}</p>
                            </div>
                            <div class="card-footer">
                                <small class="text-body-secondary" data-t="basic.release_date">Megjelenés: </small>${el.release_date}
                            </div>
                        </div>
                    `

                    GiveHrefToAdatlapButton()
                }
            }


            if (el.title != undefined) {
                searched_movies_list.innerHTML += `
                    <div class="card" style="background-color: ${cardColor};" id="${el.id}" style="width: 18rem;">
                        <img data-src="https://image.tmdb.org/t/p/w500${el.poster_path}" src="./imgs/placeholder.png" loading="lazy" class="bluredimg" alt="poszter">
                        <div class="imgkeret">
                            <img data-src="https://image.tmdb.org/t/p/w500${el.poster_path}" src="./imgs/placeholder.png" loading="lazy" class="card-img-top" alt="film poszter">
                        </div>
                        <div class="card-body ${cardBodyClass}">
                            <h5 class="card-title"><b>${el.title}</b></h5>
                            <i class="bi bi-journal-arrow-up showtexticon"></i>
                            <p class="card-text">${el.overview}</p>
                            <a href="#" id="${el.id}" class="btn btn-primary adatlap-button" data-t="basic.details">Adatlap</a>
                            <p class="rating" style="color: ${ratingColor(el.vote_average)};">${Math.round(el.vote_average * 100) / 100}</p>
                        </div>
                        <div class="card-footer">
                            <small class="text-body-secondary" data-t="basic.release_date">Megjelenés: </small>${el.release_date}
                        </div>
                    </div>
                `

                document.querySelectorAll(`.card img`).forEach(image => {
                    observer.observe(image)
                })

                GiveHrefToAdatlapButton()
            }

          });



          setUpcomingErtekelesCucc()

          checkImgLoaded()




            if (searched_movies_list.innerHTML == "") {
                searched_movies_list.innerHTML = "<p class='info' data-t='movies.nothing_here'>Nincs itt semmi, írj be valamit a keresőbe</p>"
            }

            if (sajat_movies_watched.innerHTML == "") {
                sajat_movies_watched.innerHTML = "<p class='info' data-t='movies.nothing_here_mymovies'>Nincs itt semmi, adj hozzá valamit a fiókodhoz a keresésekből</p>"
            }

            if (sajat_movies_wishlisted.innerHTML == "") {
                sajat_movies_wishlisted.innerHTML = "<p class='info' data-t='movies.nothing_here_mymovies'>Nincs itt semmi, adj hozzá valamit a fiókodhoz a keresésekből</p>"
            }


            if (search.length == 0) {
                fillSajatMovies()
            }

        }


        translatePage()
    } catch(e) {
        console.error(e)
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

            for(let i in result.dataVissza) {

                setTimeout(() => {
                    watchedMovies.push(result.dataVissza[i].media_id)
                }, 100);
                
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
            for(let i in result.dataVissza) {
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

    sajat_movies_list.innerHTML = ""

    if (wishlistedMovies.length > 0) {
        sajat_movies_wishlisted.innerHTML = ""
    } else {
        sajat_movies_wishlisted.innerHTML = "<p class='info' data-t='movies.nothing_here_mymovies'>Nincs itt semmi, adj hozzá valamit a fiókodhoz a keresésekből</p>"
    }


    if (watchedMovies.length > 0) {
        sajat_movies_watched.innerHTML = ""
    } else {
        sajat_movies_watched.innerHTML = "<p class='info' data-t='movies.nothing_here_mymovies'>Nincs itt semmi, adj hozzá valamit a fiókodhoz a keresésekből</p>"
    }


    for(let i in wishlistedMovies) {
        const getData = await fetch(`https://api.themoviedb.org/3/movie/${wishlistedMovies[i]}?api_key=${API_KEY}&language=${language}`)
        const adatok = await getData.json()
        
        if (adatok && adatok.title != undefined) {
            //console.log(adatok);
            
            var cardColor = "var(--wishlisted)"
            var cardBodyClass = "card-body-wishlisted"
    
            sajat_movies_wishlisted.innerHTML += `
                <div class="card" style="background-color: ${cardColor};" id="${adatok.id}" style="width: 18rem;">
                    <img data-src="https://image.tmdb.org/t/p/w500${adatok.poster_path}" src="./imgs/placeholder.png" loading="lazy" class="bluredimg" alt="poszter">
                    <div class="imgkeret">
                        <img data-src="https://image.tmdb.org/t/p/w500${adatok.poster_path}" src="./imgs/placeholder.png" loading="lazy" class="card-img-top" alt="film poszter">
                    </div>
                    <div class="card-body ${cardBodyClass}">
                        <h5 class="card-title"><b>${adatok.title}</b></h5>
                        <i class="bi bi-journal-arrow-up showtexticon"></i>
                        <p class="card-text">${adatok.overview}</p>
                        <a href="#" id="${adatok.id}" class="btn btn-primary adatlap-button" data-t="basic.details">Adatlap</a>
                        <p class="rating" style="color: ${ratingColor(adatok.vote_average)};">${Math.round(adatok.vote_average * 100) / 100}</p>
                    </div>
                    <div class="card-footer">
                        <small class="text-body-secondary" data-t="basic.release_date">Megjelenés: </small>${adatok.release_date}
                    </div>
                </div>
            `

            document.querySelectorAll(`.card img`).forEach(image => {
                observer.observe(image)
            })

            GiveHrefToAdatlapButton()
        }
    }


    for(let i in watchedMovies) {
        const getData = await fetch(`https://api.themoviedb.org/3/movie/${watchedMovies[i]}?api_key=${API_KEY}&language=${language}`)
        const adatok = await getData.json()
        
        if (adatok && adatok.title != undefined) {
            //console.log(adatok);
            
            var cardColor = "var(--watched)"
            var cardBodyClass = "card-body-watched"
    
            sajat_movies_watched.innerHTML += `
                <div class="card" style="background-color: ${cardColor};" id="${adatok.id}" style="width: 18rem;">
                    <img data-src="https://image.tmdb.org/t/p/w500${adatok.poster_path}" src="./imgs/placeholder.png" loading="lazy" class="bluredimg" alt="poszter">
                    <div class="imgkeret">
                        <img data-src="https://image.tmdb.org/t/p/w500${adatok.poster_path}" src="./imgs/placeholder.png" loading="lazy" class="card-img-top" alt="film poszter">
                    </div>
                    <div class="card-body ${cardBodyClass}">
                        <h5 class="card-title"><b>${adatok.title}</b></h5>
                        <i class="bi bi-journal-arrow-up showtexticon"></i>
                        <p class="card-text">${adatok.overview}</p>
                        <a href="#" id="${adatok.id}" class="btn btn-primary adatlap-button" data-t="basic.details">Adatlap</a>
                        <p class="rating" style="color: ${ratingColor(adatok.vote_average)};">${Math.round(adatok.vote_average * 100) / 100}</p>
                    </div>
                    <div class="card-footer">
                        <small class="text-body-secondary" data-t="basic.release_date">Megjelenés: </small>${adatok.release_date}
                    </div>
                </div>
            `

            document.querySelectorAll(`.card img`).forEach(image => {
                observer.observe(image)
            })

            GiveHrefToAdatlapButton()
        }
    }


    setUpcomingErtekelesCucc()

    checkImgLoaded()

    loadTranslations(language)
}


setTimeout(() => {
    fillSajatMovies()
}, 1500);




function toggleWishlisted() {
    if(sajat_movies_wishlisted.style.display == "none") {
        sajat_movies_wishlisted.style.display = "flex"
        document.getElementById("wishlistedMoviesToggleBtn").innerHTML = "Kívánságlistás filmeid elrejtése"
        document.getElementById("wishlistedMoviesToggleBtn").dataset.t = "movies.wishlisted_movies_btn_hide"
    } else {
        sajat_movies_wishlisted.style.display = "none"
        document.getElementById("wishlistedMoviesToggleBtn").innerHTML = "Kívánságlistás filmeid megjelenítése"
        document.getElementById("wishlistedMoviesToggleBtn").dataset.t = "movies.wishlisted_movies_btn_show"
    }

    translatePage()
}


function toggleWatched() {
    if(sajat_movies_watched.style.display == "none") {
        sajat_movies_watched.style.display = "flex"
        document.getElementById("watchedMoviesToggleBtn").innerHTML = "Megnézett filmeid elrejtése"
        document.getElementById("wishlistedMoviesToggleBtn").dataset.t = "movies.watched_movies_btn_hide"
    } else {
        sajat_movies_watched.style.display = "none"
        document.getElementById("watchedMoviesToggleBtn").innerHTML = "Megnézett filmeid megjelenítése"
        document.getElementById("wishlistedMoviesToggleBtn").dataset.t = "movies.watched_movies_btn_show"
    }

    translatePage()
}
