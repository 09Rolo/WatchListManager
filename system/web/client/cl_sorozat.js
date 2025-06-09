//DOM Cuccok
//menu
const menu_account = document.getElementById("menu_account")
const menu_login_register = document.getElementById("menu_login_register")
const menu_logout = document.getElementById("menu_logout")
const menu_account_href = document.getElementById("menu_account_href")
const menu_username = document.getElementById("menu_username")
const menu_logout_button = document.getElementById("menu_logout_button")


var dataAdded = false
var belepesnelNote


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




const sectionParts = window.location.pathname.split("/")
const section = sectionParts[2]
const menu_language_hu = document.getElementById("menu_language_hu")
const menu_language_en = document.getElementById("menu_language_en")

menu_language_hu.href = `/sorozat/${section}/hu`
menu_language_en.href = `/sorozat/${section}/en`


const langsection = sectionParts[3]
var language = "hu"

if (langsection && langsection == "hu") {
    language = "hu"
} else if (langsection && langsection == "en") {
    language = "en"
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




const id = window.location.pathname.split("/")[2]

async function getData() {

    const getData = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=${language}`)

    const adatok = await getData.json()
    if (adatok) {
        console.log(adatok)

        if (adatok.last_air_date && adatok.status == "Ended") {
            var idotartam = adatok.first_air_date + "-től | " + adatok.last_air_date + "-ig"
        } else {
            var idotartam = adatok.first_air_date + "-től"
        }


        const elsoresz = document.getElementById("elsoresz")
        elsoresz.innerHTML = ""

        elsoresz.innerHTML = `
            <div class="adatok col-md-7 col-10">
                <div class="felso">
                    <h2 id="cim" class="underline_hover">${adatok.name}</h2>
                    <hr>
                    <p id="datumok"></p>
                    <p id="sajatnote"></p><br>
                    <p id="leiras">${adatok.overview}</p>
                </div>
                <div class="also">
                    <div class="rowba">
                        <p id="kategoriak"><span class="bold">${getGenres(adatok.genres)}</span></p>
                        <!--<p id="hossz">Játékidő: <span class="bold">${toHoursAndMinutes(adatok.runtime)["hours"]}</span> óra <span class="bold">${toHoursAndMinutes(adatok.runtime)["minutes"]}</span> perc(${adatok.runtime}perc)</p>-->
                        <p id="ertekeles" class="rating" style="color: ${ratingColor(adatok.vote_average)};">${adatok.vote_average.toFixed(1)}</p>
                    </div>

                    <p id="releasedate">Időtartam: <span class="bold">${idotartam}</span></p>
                    <p id="originallang">Eredeti nyelv: <span class="bold">${adatok.original_language}</span></p>
                    <!--<p id="budget">Költségvetés: <span class="bold">${adatok.budget}$</span></p>-->
                    <p id="status">Státusz: <span class="bold">${adatok.status}</span></p>
                    <a href="${adatok.homepage}" target="_blank" rel="noopener noreferrer" id="imdblink"><span class="bold">Hivatalos oldala</span></a>
                    <br>
                    <a href="" target="_blank" rel="noopener noreferrer" id="sajaturl"></a>

                        
                    <div id="inputactions">
                        <div class="gombok">
                            <div id="wishlistcontainer">
                                <button id="wishlist" title="Kívánságlistára"><i class="bi bi-bookmark-plus-fill"></i></button>
                                <p id="wishlisttext">Kívánságlistára</p>
                            </div>
        
                            <div id="watchedcontainer">
                                <button id="watched" title="Megnézettnek jelölés"><i class="bi bi-file-check"></i></button>
                                <p id="watchedtext">Megnézettnek jelölés</p>
                            </div>
                        </div>

                        <div class="inputok">
                            <div class="bevitel">
                                <input type="text" name="link" id="link" placeholder="Link">
                                <button id="linkbutton">Link hozzáadása</button>
                            </div>
                            <div class="bevitel">
                                <textarea name="note" id="note" rows="2" maxlength="250">Jegyzet</textarea>
                                <button id="notebutton">Jegyzet hozzáadása</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="poster" class="col-md-4 col-10">
                <img src="https://image.tmdb.org/t/p/original${adatok.poster_path}" id="fadedimg" class="img-fluid">
                <img src="https://image.tmdb.org/t/p/original${adatok.poster_path}" id="posterimg" class="img-fluid">
            </div>
        `

        
        
        const masodikresz = document.getElementById("masodikresz")
        masodikresz.innerHTML = `
                <div class="general">
                    <p id="num_of_s"><span>Évadok száma:</span> ${adatok.number_of_seasons}</p>
                    <p id="num_of_e"><span>Epzódok száma:</span> ${adatok.number_of_episodes}</p>
                </div>

                <div id="seasonlist">
                    
                </div>

                <div id="seasonpage">

                </div>
        `

        const seasonlist = document.getElementById("seasonlist")

        
        for (let season = 0; season < adatok.seasons.length; season++) {
            const getData_seasons = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${API_KEY}&language=${language}`)
            const seasonok = await getData_seasons.json()

            console.log(seasonok)
            seasonlist.innerHTML += `
                <button onclick="changeSeason(this)" class="season">${seasonok.season_number}</button>
            `
        }
        

        


        dataAdded = true

    }

}



//------------------------------------------------------Backend cuccok---------------------------------------------
var wishlistbeAddolva
var watchlistbeAddolva
var linkAddolva
var noteFrissitve


async function checkWishlist(id) {
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
                if (result.dataVissza[i].media_id == parseInt(id, 10)) {
                    var date = new Date(result.dataVissza[i].added_at); 
                    var localDate = date.toLocaleDateString("hu-HU"); // Hungarian format (YYYY.MM.DD)
                    wishlistbeAddolva = localDate

                    return true
                }
            }

            return false
        }
    } catch(e) {
        console.error(e)
    }
}




async function checkWatched(id) {
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
                if (result.dataVissza[i].media_id == parseInt(id, 10)) {
                    var date = new Date(result.dataVissza[i].added_at); 
                    var localDate = date.toLocaleDateString("hu-HU"); // Hungarian format (YYYY.MM.DD)
                    watchlistbeAddolva = localDate

                    return true
                }
            }

            return false
        }
    } catch(e) {
        console.error(e)
    }
}




async function checkLink(id) {
    var amiMegy = {
        user_id: JSON.parse(localStorage.user).user_id,
        tipus: "tv"
    }

    try {
        const response = await fetch(`${location.origin}/getLinks`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(amiMegy)
        })
    
        const result = await response.json()
    
        if (response.ok) {
            for(i in result.dataVissza) {
                if (result.dataVissza[i].media_id == parseInt(id, 10)) {
                    var date = new Date(result.dataVissza[i].added_at); 
                    var localDate = date.toLocaleDateString("hu-HU"); // Hungarian format (YYYY.MM.DD)
                    linkAddolva = localDate

                    return result.dataVissza[i].link_url
                }
            }

            return false
        }
    } catch(e) {
        console.error(e)
    }
}




async function checkNote(id) {
    var amiMegy = {
        user_id: JSON.parse(localStorage.user).user_id,
        tipus: "tv"
    }

    try {
        const response = await fetch(`${location.origin}/getNotes`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(amiMegy)
        })
    
        const result = await response.json()
    
        if (response.ok) {
            for(i in result.dataVissza) {
                if (result.dataVissza[i].media_id == parseInt(id, 10)) {
                    var date = new Date(result.dataVissza[i].added_at); 
                    var localDate = date.toLocaleDateString("hu-HU"); // Hungarian format (YYYY.MM.DD)
                    noteFrissitve = localDate

                    return result.dataVissza[i].note
                }
            }

            return false
        }
    } catch(e) {
        console.error(e)
    }
}





const checkCondition = setInterval(() => {
    if (dataAdded) {
        clearInterval(checkCondition); // Stop checking




const wishlist = document.getElementById("wishlist")  //wishlist button
const wishlisttext = document.getElementById("wishlisttext")
const watched = document.getElementById("watched")  //watched button
const watchedtext = document.getElementById("watchedtext")

const link = document.getElementById("link")  //link input, ennek .value
const linkbutton = document.getElementById("linkbutton")
const sajaturl = document.getElementById("sajaturl")
const note = document.getElementById("note")  // note input, kell a .valueja
const notebutton = document.getElementById("notebutton")

const id = parseInt((window.location.pathname.split("/")[2]), 10)
const datumok = document.getElementById("datumok")


//megnézni megnézte e vagy wishlisten van e
async function wishlistManage() {
    var isWishlisted = await checkWishlist(id)

    if (isWishlisted) {
        wishlist.innerHTML = '<i class="bi bi-bookmark-dash-fill"></i>'
        wishlisttext.innerHTML = "Kivétel a kívánságlistából"
        document.body.style.backgroundColor = "var(--wishlisted)"
        datumok.innerHTML += ` | Kívánságlistához adva: ${wishlistbeAddolva} | `

        wishlist.dataset.do = "remove"
    } else {
        wishlist.innerHTML = '<i class="bi bi-bookmark-plus-fill"></i>'
        wishlisttext.innerHTML = "Kívánságlistára rakás"

        wishlist.dataset.do = "add"
    }
}

wishlistManage()



async function watchedManage() {
    var isWatched = await checkWatched(id)

    if (isWatched) {
        watched.innerHTML = '<i class="bi bi-file-excel-fill"></i>'
        watchedtext.innerHTML = "Jelölés nem megnézettnek"
        document.body.style.backgroundColor = "var(--watched)"
        datumok.innerHTML += ` | Megnézve: ${watchlistbeAddolva} | `

        watched.dataset.do = "remove"
    } else {
        watched.innerHTML = '<i class="bi bi-file-check-fill"></i>'
        watchedtext.innerHTML = "Jelölés megnézettnek"

        watched.dataset.do = "add"
    }
}

watchedManage()




async function linkManage() {
    var haslink = await checkLink(id)

    if (haslink) {
        sajaturl.href = haslink
        sajaturl.innerHTML = '<span class="bold">Saját link</span>'
        linkbutton.innerHTML = "Link változtatása"
        datumok.innerHTML += ` | Link adva: ${linkAddolva} | `
    } else {
        sajaturl.innerHTML = ""
    }
}

linkManage()




async function noteManage() {
    var hasnote = await checkNote(id)

    if (hasnote) {
        sajatnote.innerHTML = hasnote
        notebutton.innerHTML = "Jegyzet változtatása"
        datumok.innerHTML += ` | Jegyzet frissítve: ${noteFrissitve} | `

        belepesnelNote = hasnote
        note.value = hasnote
    } else {
        sajatnote.innerHTML = ""
    }
}

noteManage()





wishlist.onclick = async() => {

    if (wishlist.dataset.do == "add") {
        try {
            var details = {
                user_id: JSON.parse(localStorage.user).user_id,
                media_id: id,
                media_type: "tv"
            }
    
            const response = await fetch(`${location.origin}/addWishlist`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(details)
            })
    
            const result = await response.json()
    
            notify(result.message, result.type)
    
            if(result.type == "success") {
                setTimeout(() => {
                    window.location.reload()
                }, 2000);
            }
        } catch(e) {
            console.log("Error:", e)
        }
    } else if(wishlist.dataset.do == "remove") {
        try {
            var details = {
                user_id: JSON.parse(localStorage.user).user_id,
                media_id: id,
                media_type: "tv"
            }
    
            const response = await fetch(`${location.origin}/removeWishlist`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(details)
            })
    
            const result = await response.json()
    
            notify(result.message, result.type)
    
            if(result.type == "success") {
                setTimeout(() => {
                    window.location.reload()
                }, 2000);
            }
        } catch(e) {
            console.log("Error:", e)
        }
    }
    

}





watched.onclick = async() => {

    if (watched.dataset.do == "add") {
        try {
            var details = {
                user_id: JSON.parse(localStorage.user).user_id,
                media_id: id,
                media_type: "tv"
            }
    
            const response = await fetch(`${location.origin}/addWatched`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(details)
            })
    
            const result = await response.json()
    
            notify(result.message, result.type)
    
            if(result.type == "success") {
                setTimeout(() => {
                    window.location.reload()
                }, 2000);
            }
        } catch(e) {
            console.log("Error:", e)
        }

    } else if(watched.dataset.do == "remove") {
        try {
            var details = {
                user_id: JSON.parse(localStorage.user).user_id,
                media_id: id,
                media_type: "tv"
            }
    
            const response = await fetch(`${location.origin}/removeWatched`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(details)
            })
    
            const result = await response.json()
    
            notify(result.message, result.type)
    
            if(result.type == "success") {
                setTimeout(() => {
                    window.location.reload()
                }, 2000);
            }
        } catch(e) {
            console.log("Error:", e)
        }
    }

}





linkbutton.onclick = async() => {

    if (link.value.length > 0) {
        const pattern = /^(?:(?:https?|ftp):\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+[^\s]*$/i;
        
        if (pattern.test(link.value)) {
            try {
                var details = {
                    user_id: JSON.parse(localStorage.user).user_id,
                    media_id: id,
                    media_type: "tv",
                    link_url: link.value
                }
            
                const response = await fetch(`${location.origin}/changeLink`, {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(details)
                })
            
                const result = await response.json()
            
                notify(result.message, result.type)
            
                if(result.type == "success") {
                    setTimeout(() => {
                        window.location.reload()
                    }, 2000);
                }
            } catch(e) {
                console.log("Error:", e)
            }
        } else {
            notify("Helytelen URL", "error")
        }
    } else {
        notify("Írj be valamit előtte", "error")
    }

}




notebutton.onclick = async() => {

    if (note.value.length > 0 && note.value != "Jegyzet" && note.value != belepesnelNote) {
        try {
            var details = {
                user_id: JSON.parse(localStorage.user).user_id,
                media_id: id,
                media_type: "tv",
                note: note.value
            }
        
            const response = await fetch(`${location.origin}/changeNote`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(details)
            })
        
            const result = await response.json()
        
            notify(result.message, result.type)
        
            if(result.type == "success") {
                setTimeout(() => {
                    window.location.reload()
                }, 2000);
            }
        } catch(e) {
            console.log("Error:", e)
        }
    } else {
        notify("Írj be valamit előtte", "error")
    }

}







    }
}, 100); // Check every 100ms


async function changeSeason(btn) {
    season_num = btn.innerHTML
    
    season_buttons = document.getElementsByClassName("season")
    Array.prototype.forEach.call(season_buttons, function(ele) {
        ele.style.backgroundColor = "rgba(0,0,0,0.4"
        ele.style.borderColor = "var(--red-underline)"
    });

    btn.style.backgroundColor = "rgba(0, 255, 0, 0.6)"
    btn.style.borderColor = "rgb(0, 255, 0)"

    const getData_seasons = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${season_num}?api_key=${API_KEY}&language=${language}`)
    const season = await getData_seasons.json()

    loadSeasonData(season)
}



function loadSeasonData(s) {
    const container = document.getElementById("seasonpage")

    let date = s.air_date
    let name = s.name
    let episodes = s.episodes
    let overview = s.overview
    let poster = s.poster_path
    let num = s.season_number
    let rating = s.vote_average


    container.innerHTML = `
        <div class="infok">
            <h3>${name}</h3>
            <h5>(${date})</h5>
            <p>${overview}</p>
            <div id="ertekeles" class="rating" style="color: ${ratingColor(rating)};">${rating.toFixed(1)}</div>
        </div>

        <div class="row">
            <div id="episodes" class="col-md-7 col-10">
                
            </div>
            
            <div id="poster" class="col-md-4 col-10">
                <img src="https://image.tmdb.org/t/p/original${poster}" id="fadedimg" class="img-fluid">
                <img src="https://image.tmdb.org/t/p/original${poster}" id="posterimg" class="img-fluid">
            </div>
        </div>
    `

    const episodes_container = document.getElementById("episodes")
    episodes_container.innerHTML = ""

    for (let episode = 0; episode < episodes.length; episode++) {
        let ep = episodes[episode]
        var hossz = 0
        
        if (toHoursAndMinutes(ep.runtime)["hours"] != 0) {
            var hossz = `<p id="hossz"><span class="bold">${toHoursAndMinutes(ep.runtime)["hours"]}</span> óra <span class="bold">${toHoursAndMinutes(ep.runtime)["minutes"]}</span> perc(${ep.runtime}perc))</p>`
        } else {
            var hossz = `<p id="hossz"><span class="bold">${toHoursAndMinutes(ep.runtime)["minutes"]}</span> perc)</p>`
        }

        episodes_container.innerHTML += `
            <div class="episode">
                <div class="data">
                    <p class="ep_num">${ep.episode_number}.</p>
                    <p>${ep.name}</p>
                    <p>(${ep.air_date},</p>
                    ${hossz}
                    <div id="ertekeles" class="rating" style="color: ${ratingColor(ep.vote_average)};">${ep.vote_average.toFixed(1)}</div>
                </div>
                <div class="overview">
                    <p>${ep.overview}</p>
                </div>
            </div>
        
        `
    }
    
}
