//DOM Cuccok
//menu
const menu_account = document.getElementById("menu_account")
const menu_login_register = document.getElementById("menu_login_register")
const menu_logout = document.getElementById("menu_logout")
const menu_account_href = document.getElementById("menu_account_href")
const menu_username = document.getElementById("menu_username")
const menu_logout_button = document.getElementById("menu_logout_button")


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
var BASE_URL = ""

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

            getData()
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



function toHoursAndMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes };
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


function getGenres(genres) {
    var katok = ""

    for(let i = 0; i < genres.length; i++) {
        if (genres.length - i != 1) {
            katok += "" + genres[i].name + ", "
        } else {
            katok += "" + genres[i].name
        }
    }

    return katok
}



const sectionParts = window.location.pathname.split("/")
const section = sectionParts[2]
const menu_language_hu = document.getElementById("menu_language_hu")
const menu_language_en = document.getElementById("menu_language_en")

menu_language_hu.href = `/film/${section}/hu`
menu_language_en.href = `/film/${section}/en`


const langsection = sectionParts[3]
var language = "hu"

if (langsection && langsection == "hu") {
    language = "hu"
} else if (langsection && langsection == "en") {
    language = "en"
}



async function getData() {
    const id = window.location.pathname.split("/")[2]

    const getData = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=${language}`)

    const adatok = await getData.json()
    if (adatok) {
        console.log(adatok)
        const elsoresz = document.getElementById("elsoresz")
        elsoresz.innerHTML = ""

        elsoresz.innerHTML = `
            <div class="adatok col-md-7 col-10">
                <div class="felso">
                    <h2 id="cim" class="underline_hover">${adatok.title}</h2>
                    <hr>
                    <p id="leiras">${adatok.overview}</p>
                </div>
                <div class="also">
                    <div class="rowba">
                        <p id="kategoriak"><span class="bold">${getGenres(adatok.genres)}</span></p>
                        <p id="hossz">Játékidő: <span class="bold">${toHoursAndMinutes(adatok.runtime)["hours"]}</span> óra <span class="bold">${toHoursAndMinutes(adatok.runtime)["minutes"]}</span> perc(${adatok.runtime}perc)</p>
                        <p id="ertekeles" class="rating" style="color: white;">${adatok.vote_average}</p>
                    </div>

                    <p id="releasedate">Megjelenés: <span class="bold">${adatok.release_date}</span></p>
                    <p id="budget">Költségvetés: <span class="bold">${adatok.budget}$</span></p>
                    <p id="status">Státusz: <span class="bold">${adatok.status}</span></p>
                    <a href="https://www.imdb.com/title/${adatok.imdb_id}" target="_blank" rel="noopener noreferrer" id="imdblink"><span class="bold">IMDB Link</span></a>
                </div>
            </div>
            <div id="poster" class="col-md-4 col-10">
                <img src="https://image.tmdb.org/t/p/original${adatok.poster_path}" id="fadedimg" class="img-fluid">
                <img src="https://image.tmdb.org/t/p/original${adatok.poster_path}" id="posterimg" class="img-fluid">
            </div>
        `


    }

}
