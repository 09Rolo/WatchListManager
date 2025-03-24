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
const searched_series_list = document.getElementById("searched_series_list")


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
        const getData = await fetch(`https://api.themoviedb.org/3/search/tv?query=${search}&api_key=${API_KEY}&language=${language}`)

        const adatok = await getData.json()
    
        if (adatok.results) {
          const sortedSeries = adatok.results.sort((a, b) => b.popularity - a.popularity);
          
          console.log(sortedSeries);

          searched_series_list.innerHTML = ""

          sortedSeries.forEach(el => {
            searched_series_list.innerHTML += `
                <div class="card" style="width: 18rem;">
                    <img src="https://image.tmdb.org/t/p/w500${el.poster_path}" class="bluredimg" alt="poszter">
                    <div class="imgkeret">
                        <img src="https://image.tmdb.org/t/p/w500${el.poster_path}" class="card-img-top" alt="sorozat poszter">
                    </div>
                    <div class="card-body">
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


          if (searched_series_list.innerHTML == "") {
            searched_series_list.innerHTML = "<p class='info'>Nincs itt semmi, írj be valamit a keresőbe</p>"
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
        el.href = `${window.location.origin}/sorozat/${el.id}`
    })
    
}
