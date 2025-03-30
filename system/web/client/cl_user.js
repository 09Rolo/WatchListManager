//DOM Cuccok
//menu
const menu_account = document.getElementById("menu_account")
const menu_login_register = document.getElementById("menu_login_register")
const menu_logout = document.getElementById("menu_logout")
const menu_account_href = document.getElementById("menu_account_href")
const menu_username = document.getElementById("menu_username")
const menu_logout_button = document.getElementById("menu_logout_button")

const sorozatok_starthere_button = document.getElementById("sorozatok_starthere_button")
const filmek_starthere_button = document.getElementById("filmek_starthere_button")

const profile = document.getElementById("profile")
const filmek = document.getElementById("filmek")

var API_KEY = ""


const koszonto1 = document.getElementById("koszonto1")
const koszonto2 = document.getElementById("koszonto2")




window.onload = async () => {
    menu_account.style.display = "none"
    menu_login_register.style.display = "none"
    menu_logout.style.display = "none"

    const usernameRegex = /^[a-zA-Z0-9._áéíóöőúüűÁÉÍÓÖŐÚÜŰ]{3,15}$/;
    const unameToTest = decodeURIComponent(window.location.pathname.split("/")[2])
    if (!usernameRegex.test(unameToTest)) {
        window.location.pathname = "/"
    }

    const token = localStorage.getItem("token")
    const isLoggedin = await checkLogin(token)

    if (isLoggedin) {
        loggedIn()
        alapok()
    } else {
        loggedOut()
        alapok()
    }


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



//welcomer.innerHTML = `Üdvözlet ${JSON.parse(localStorage.getItem("user")).username}!`
async function loggedIn() {
    menu_login_register.style.display = "none"
    menu_account.style.display = ""
    menu_logout.style.display = ""

    menu_account_href.href = `/u/${JSON.parse(localStorage.getItem("user")).username}`
    menu_username.innerHTML = JSON.parse(localStorage.getItem("user")).username
}


function loggedOut() {
    menu_account.style.display = "none"
    menu_logout.style.display = "none"

    menu_login_register.style.display = ""
}


menu_logout_button.onclick = async () => {
    await logout()

    window.location.reload()
}



function alapok() {
    if(JSON.parse(localStorage.getItem("user"))) {
        if(decodeURIComponent(window.location.pathname.split("/")[2]) == JSON.parse(localStorage.getItem("user")).username) { //saját magad vagy
            filmek.style.display = "none"
            profile.style.display = ""
    
    
            koszonto1.innerHTML = `Üdvözlet ${decodeURIComponent(JSON.parse(localStorage.getItem("user")).username)}!`
            displayProfile()
    
        } else {
            profile.style.display = "none"
            filmek.style.display = ""
    
            koszonto2.innerHTML = `${decodeURIComponent(window.location.pathname.split("/")[2])} kívánságlistája:`
            getWishlisted()
        }
    } else {
        profile.style.display = "none"
        filmek.style.display = ""

        koszonto2.innerHTML = `${decodeURIComponent(window.location.pathname.split("/")[2])} kívánságlistája:`
        getWishlisted()
    }
    
}




const sajaturl = document.getElementById("sajaturl")
const copyurl = document.getElementById("copyurl")

async function displayProfile() {
    sajaturl.innerHTML = window.location.origin + "/u/" + decodeURIComponent(window.location.pathname.split("/")[2])
}

sajaturl.onclick = async() => {
    copyTxt()
}

copyurl.onclick = async() => {
    copyTxt()
}

async function copyTxt() {
/*
    try {
        navigator.clipboard.writeText(sajaturl.innerHTML);

        notify(sajaturl.innerHTML + " URL kimásolva!", "info");
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
*/
    const tempInput = document.createElement("textarea");
    tempInput.value = sajaturl.innerHTML;
    document.body.appendChild(tempInput);
    
    tempInput.select();
    document.execCommand("copy"); // For older browsers
    document.body.removeChild(tempInput);

    notify(sajaturl.innerHTML + " URL kimásolva!", "info");
}




var wishlistedMovies = []

async function getWishlisted() {
    try {
        const response = await fetch(`${location.origin}/getUserID`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username: decodeURIComponent(window.location.pathname.split("/")[2])})
        })
    
        const result = await response.json()
    
        if (response.ok) {

            var amiMegy = {
                user_id: result.user_id,
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
                    displayFilmek()
                }
            } catch(e) {
                console.error(e)
            }

        }

    } catch(e) {
        console.error(e)
    }
}




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





const movies_list = document.getElementById("movies_list")
var language = 'hu'


async function displayFilmek() {
    if (wishlistedMovies.length > 0) {
        movies_list.innerHTML = ""
    }


    for(i in wishlistedMovies) {
        const getData = await fetch(`https://api.themoviedb.org/3/movie/${wishlistedMovies[i]}?api_key=${API_KEY}&language=${language}`)
        const adatok = await getData.json()
        
        if (adatok) {

            var cardColor = "var(--wishlisted)"
    
            movies_list.innerHTML += `
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

