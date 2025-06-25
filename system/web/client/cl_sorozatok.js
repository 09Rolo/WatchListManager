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

            getPartiallyWatched()
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

          sortedSeries.forEach(el => {
        
            var cardColor = ""
            var cardBodyClass = ""

            for(i in watchedSeries) {
                if (watchedSeries[i] == el.id) {
                    //sajátba is
                    cardColor = "var(--watched)"
                    cardBodyClass = "card-body-watched"

                    sajat_series_list.innerHTML += `
                        <div class="card" style="background-color: ${cardColor};" id="${el.id}" style="width: 18rem;">
                            <img data-src="https://image.tmdb.org/t/p/w500${el.poster_path}" src="./imgs/placeholder.png" loading="lazy" class="bluredimg" alt="poszter">
                            <div class="imgkeret">
                                <img data-src="https://image.tmdb.org/t/p/w500${el.poster_path}" src="./imgs/placeholder.png" loading="lazy" class="card-img-top" alt="film poszter">
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


            for(i in partiallWatched) {
                if (partiallWatched[i] == el.id) {
                    //sajátba is
                    cardColor = "var(--started-series-lathatobb-bg)"
                    cardBodyClass = "card-body-watched_partially"

                    sajat_series_list.innerHTML += `
                        <div class="card" style="background-color: ${cardColor};" id="${el.id}" style="width: 18rem;">
                            <img data-src="https://image.tmdb.org/t/p/w500${el.poster_path}" src="./imgs/placeholder.png" loading="lazy" class="bluredimg" alt="poszter">
                            <div class="imgkeret">
                                <img data-src="https://image.tmdb.org/t/p/w500${el.poster_path}" src="./imgs/placeholder.png" loading="lazy" class="card-img-top" alt="film poszter">
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


            for(i in wishlistedSeries) {
                if (wishlistedSeries[i] == el.id) {
                    //sajátba is
                    cardColor = "var(--wishlisted)"
                    cardBodyClass = "card-body-wishlisted"

                    sajat_series_list.innerHTML += `
                        <div class="card" style="background-color: ${cardColor};" id="${el.id}" style="width: 18rem;">
                            <img data-src="https://image.tmdb.org/t/p/w500${el.poster_path}" src="./imgs/placeholder.png" loading="lazy" class="bluredimg" alt="poszter">
                            <div class="imgkeret">
                                <img data-src="https://image.tmdb.org/t/p/w500${el.poster_path}" src="./imgs/placeholder.png" loading="lazy" class="card-img-top" alt="film poszter">
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
                        <img data-src="https://image.tmdb.org/t/p/w500${el.poster_path}" src="./imgs/placeholder.png" loading="lazy" class="card-img-top" alt="film poszter">
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
          });


          GiveHrefToAdatlapButton()

          setUpcomingErtekelesCucc()

          checkImgLoaded()


          setTimeout(() => {
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
              
            document.querySelectorAll('img[data-src]').forEach(img => {
                observer.observe(img);
            });
        }, 100);



          if (searched_series_list.innerHTML == "") {
            searched_series_list.innerHTML = "<p class='info'>Nincs itt semmi, írj be valamit a keresőbe</p>"
          }

          if (sajat_series_list.innerHTML == "") {
            sajat_series_list.innerHTML = "<p class='info'>Nincs itt semmi, adj hozzá valamit a fiókodhoz a keresésekből</p>"

            if (search.length == 0) {
                fillSajatSeries()
            }
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

async function getWatched() {
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
            for(i in result.dataVissza) {
                if (watchedSeries.includes(result.dataVissza[i].media_id)) {
                    
                } else {
                    watchedSeries.push(result.dataVissza[i].media_id)
                }
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
            for(i in result.dataVissza) {
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

getWishlisted()





async function getPartiallyWatched() {
    var allEpisodes = 0
    var watchedEpisodes = 0

    for (let ids = 0; ids < watchedSeries.length; ids++) {
        const elem = watchedSeries[ids];


        const getData = await fetch(`https://api.themoviedb.org/3/tv/${elem}?api_key=${API_KEY}&language=${language}`)

        const adatok = await getData.json()
        if (adatok) {
            for (let seasons = 1; seasons < adatok.seasons.length; seasons++) {
                const element = adatok.seasons[seasons];

                allEpisodes += element.episode_count
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
                    
                    for(i in result.dataVissza) {
                        if (result.dataVissza[i].media_id == elem) {
                            watchedEpisodes += 1
                        }
                    }
                }
            } catch(e) {
                console.error(e)
            }


            for (let s = 0; s < watchedSeries.length; s++) {
                const element = watchedSeries[s];
                
                if (element == elem) {
                    if (watchedEpisodes >= allEpisodes) {

                    } else {
                        //console.log(s)
                        partiallWatched.push(elem)
                    }
                }
            }



            allEpisodes = 0
            watchedEpisodes = 0
        }

    }

    watchedSeries = watchedSeries.filter(item => !partiallWatched.includes(item))

}







///DBből, ha all az indexelhet akkor mehet

async function fillSajatSeries() {

    if (wishlistedSeries.length > 0 || watchedSeries.length > 0 || partiallWatched.length > 0) {
        sajat_series_list.innerHTML = ""
    } else {
        sajat_series_list.innerHTML = '<p class="info">Nincs itt semmi, adj hozzá valamit a fiókodhoz a keresésekből</p>'
    }




    for(i in partiallWatched) {
        const getData = await fetch(`https://api.themoviedb.org/3/tv/${partiallWatched[i]}?api_key=${API_KEY}&language=${language}`)
        const adatok = await getData.json()
        
        if (adatok) {
            //console.log(adatok);
            
            var cardColor = "var(--started-series-lathatobb-bg)"
    
            sajat_series_list.innerHTML += `
                <div class="card" style="background-color: ${cardColor};" id="${adatok.id}" style="width: 18rem;">
                    <img data-src="https://image.tmdb.org/t/p/w500${adatok.poster_path}" src="./imgs/placeholder.png" loading="lazy" class="bluredimg" alt="poszter">
                    <div class="imgkeret">
                        <img data-src="https://image.tmdb.org/t/p/w500${adatok.poster_path}" src="./imgs/placeholder.png" loading="lazy" class="card-img-top" alt="film poszter">
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
        }
    }




    for(i in wishlistedSeries) {
        const getData = await fetch(`https://api.themoviedb.org/3/tv/${wishlistedSeries[i]}?api_key=${API_KEY}&language=${language}`)
        const adatok = await getData.json()
        
        if (adatok) {
            //console.log(adatok);
            
            var cardColor = "var(--wishlisted)"
    
            sajat_series_list.innerHTML += `
                <div class="card" style="background-color: ${cardColor};" id="${adatok.id}" style="width: 18rem;">
                    <img data-src="https://image.tmdb.org/t/p/w500${adatok.poster_path}" src="./imgs/placeholder.png" loading="lazy" class="bluredimg" alt="poszter">
                    <div class="imgkeret">
                        <img data-src="https://image.tmdb.org/t/p/w500${adatok.poster_path}" src="./imgs/placeholder.png" loading="lazy" class="card-img-top" alt="film poszter">
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
        }
    }



    for(i in watchedSeries) {
        const getData = await fetch(`https://api.themoviedb.org/3/tv/${watchedSeries[i]}?api_key=${API_KEY}&language=${language}`)
        const adatok = await getData.json()
        
        if (adatok) {
            //console.log(adatok);
            
            var cardColor = "var(--watched)"
    
            sajat_series_list.innerHTML += `
                <div class="card" style="background-color: ${cardColor};" id="${adatok.id}" style="width: 18rem;">
                    <img data-src="https://image.tmdb.org/t/p/w500${adatok.poster_path}" src="./imgs/placeholder.png" loading="lazy" class="bluredimg" alt="poszter">
                    <div class="imgkeret">
                        <img data-src="https://image.tmdb.org/t/p/w500${adatok.poster_path}" src="./imgs/placeholder.png" loading="lazy" class="card-img-top" alt="film poszter">
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
        }
    }

    

    GiveHrefToAdatlapButton()

    setUpcomingErtekelesCucc()

    checkImgLoaded()


    setTimeout(() => {
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
          
        document.querySelectorAll('img[data-src]').forEach(img => {
            observer.observe(img);
        });
    }, 100);
    
}


setTimeout(() => {
    fillSajatSeries()
}, 2000);
