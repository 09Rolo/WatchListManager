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
            <div id="poster">
                <img src="https://image.tmdb.org/t/p/original${adatok.poster_path}" id="fadedimg">
                <img src="https://image.tmdb.org/t/p/original${adatok.poster_path}" is="posterimg">
            </div>
            <div class="adatok">
                <div class="felso">
                    <h2 id="cim">${adatok.title}</h2>
                    <hr>
                    <p id="leiras">${adatok.overview}</p>
                </div>
                <div class="also">
                    <p id="budget">Költségvetés: ${adatok.budget}$</p>
                    <p id="kategoriak">${getGenres(adatok.genres)}</p>
                    <p id="releasedate">Megjelenés: ${adatok.release_date}</p>
                    <p id="hossz">Hossz: ${adatok.runtime} perc, ${toHoursAndMinutes(adatok.runtime)["hours"]}:${toHoursAndMinutes(adatok.runtime)["minutes"]}</p>
                    <p id="status">Státusz: ${adatok.status}</p>
                    <p id="ertekeles" style="color: ${ratingColor(adatok.vote_average)};">${adatok.vote_average}</p>
                </div>
            </div>
        `


    }

}
