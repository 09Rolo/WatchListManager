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
var GOOGLE_API = ""

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
            GOOGLE_API = result.googleAPI

            getData()
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



function toHoursAndMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes };
}




function getVeszoString(list, definialva) {
    if (list) {

        var definialva = definialva || "name"
        var str = ""

        if (list.length == 0) {
            str = "Ismeretlen"
        }

        for(let i = 0; i < list.length; i++) {
            if (list.length - i != 1) {
                str += "" + list[i][definialva] + ", "
            } else {
                str += "" + list[i][definialva]
            }
        }

        return str

    }
}


/*
function getProperStatus(status) {
    var visszamegy = status //alapból megkapja a saját értékét, aztán ha véletlen nem adtam hozzá max kiírja angolul
    
    if (status) {
        if (status == "Ended") {
            visszamegy = "Befejezve"
        } else if (status == "Returning Series") {
            visszamegy = "Folyamatban lévő sorozat"
        } else if (status == "In Production") {
            visszamegy = "Készítés alatt"
        }
    } else {
        visszamegy = "Ismeretlen"
    }

    return visszamegy
}
*/



const sectionParts = window.location.pathname.split("/")
const section = sectionParts[2]
const menu_language_hu = document.getElementById("menu_language_hu")
const menu_language_en = document.getElementById("menu_language_en")

menu_language_hu.href = `/film/${section}/hu`
menu_language_en.href = `/film/${section}/en`


var language = 'hu'
var langcodes = "hu-HU"

function manageLang() {
    const sectionParts = window.location.pathname.split("/")
    const section = sectionParts[3]

    if (section && section == "hu") {
        language = "hu"
    } else if (section && section == "en") {
        language = "en"
    }


    if (language == "en") {
        langcodes = "en-US"
    }


    if (getLanguageCookie() != null && !section) {
        language = getLanguageCookie()
    }


    loadTranslations(language)
}

manageLang()



var movieTitle = ""

const id = window.location.pathname.split("/")[2]

async function getData() {

    const getData = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=${language}`)

    const adatok = await getData.json()
    if (adatok) {
        
        movieTitle = adatok.title

        const elsoresz = document.getElementById("elsoresz")
        elsoresz.innerHTML = ""

        elsoresz.innerHTML = `
            <div class="adatok col-md-7 col-10">
                <div class="felso">
                    <h2 id="cim" class="underline_hover">${adatok.title}</h2>
                    <br>
                    <i id="tagline">${adatok.tagline.length != 0 ? "~" + adatok.tagline + "~" : ""}</i>
                    <hr>
                    <p id="datumok"></p>
                    <p id="sajatnote"></p><br>
                    <p id="leiras">${adatok.overview}</p>
                </div>
                <div class="also">
                    <div class="infoReszleg">
                        <div id="generalInfo">

                            <div class="elsoszekcio">
                                <p id="kategoriak"><span class="bold">${getVeszoString(adatok.genres)}</span></p>
                                <p id="hossz">${t("movie.runtime")}: <span class="bold">${toHoursAndMinutes(adatok.runtime)["hours"]}</span> ${t("basic.hours")} <span class="bold">${toHoursAndMinutes(adatok.runtime)["minutes"]}</span> ${t("basic.minutes")} (${adatok.runtime} ${t("basic.minutes")})</p>
                                <p id="releasedate">${t("movie.release")}: <span class="bold">${adatok.release_date}</span></p>
                                <p id="originallang">${t("movie.original_language")}: <span class="bold">${adatok.original_language}</span></p>
                                <p id="budget">${t("movie.budget")}: <span class="bold">${adatok.budget}$</span></p>
                                <p id="status">${t("movie.state")}: <span class="bold">${t("movie." + adatok.status)}</span></p>
                            </div>

                            <div class="masodikszekcio">
                                <p id="ertekeles" class="rating" style="color: ${ratingColor(adatok.vote_average)};">${adatok.vote_average.toFixed(1)}</p>
                            </div>

                        </div>


                        <hr>
                        <button onclick="showExtraInfo()">...</button>


                        <div id="extraInfoBox">
                            <p id="kollekcio"><span class="bold">${t("movie.collection")}:</span> ${adatok.belongs_to_collection ? adatok.belongs_to_collection.name : "Nincs"}</p>

                            <!--Egyéb fő crew? Rendező, író valami, nem tudom mik vannak, mehetnek ide üres p-ként aztán majd beleteszem jsel-->
                            <!-- -->
                            <p id="rendezo"></p>
                            <p id="vago"></p>

                            <p id="production"><span class="bold">${t("movie.production_companies")}:</span> ${getVeszoString(adatok.production_companies)}</p>
                            <p id="beszeltnyelvek"><span class="bold">${t("movie.spoken_languages")}:</span> ${getVeszoString(adatok.spoken_languages)}</p>


                            <button id="togglePersons" class="cant_select" data-allapot="closed">${t("movie.show_credits")}</button>

                            <div id="stabLista" class="hidden">
                                <div id="szereplok">
                                    <h3>${t("movie.cast")}</h3>
                                    <!-- JSSEL IDE -->
                                </div>
                                <hr>
                                <div id="keszitok">
                                    <h3>${t("movie.crew")}</h3>
                                    <!-- JSSEL IDE -->
                                </div>
                            </div>

                        </div>

                    </div>

                    <div class="bottominteractions">
                        <div id="linkbox" class="cant_select">
                            <a href="" target="_blank" rel="noopener noreferrer" id="sajaturl"></a>
                            <a href="" target="_blank" rel="noopener noreferrer" id="serverLink"></a>
                            <hr>
                            <a href="https://www.imdb.com/title/${adatok.imdb_id}" target="_blank" rel="noopener noreferrer" id="imdblink"><span class="bold">IMDB Link</span></a>
                            <a href="https://www.google.com/search?q=${adatok.title}+teljes+film+magyarul+hd" target="_blank" rel="noopener noreferrer"><span class="bold" data-t="movie.google_search">Google Keresés</span></a>
                            
                            <hr>
                            <a href="https://moviedrive.hu/filmek/?q=${adatok.title}" target="_blank" rel="noopener noreferrer">Moviedrive.hu</a>
                            <a href="https://mozisarok.hu/search/${adatok.title}" target="_blank" rel="noopener noreferrer">Mozisarok.hu</a>
                            <a href="https://hdmozi.hu/?s=${adatok.title}" target="_blank" rel="noopener noreferrer">HDMozi.hu</a>
                            <a href="https://filminvazio.cc/?s=${adatok.title}" target="_blank" rel="noopener noreferrer">FilmInvazio.cc</a>
                            <a href="https://ww.yesmovies.ag/search.html?q=${adatok.title}" target="_blank" rel="noopener noreferrer">Yesmovies.ag <span class="kisbetus" data-t="basic.lang_en">Angol</span></a>
                            <a href="https://donkey.to/media/search?query=${adatok.title}" target="_blank" rel="noopener noreferrer">Donkey.to <span class="kisbetus" data-t="basic.lang_en">Angol</span></a>

                            <hr>
                            <div class="videok">
                                <button id="videokLoad_btn" data-t="movie.show_videos">Videók mutatása</button>
                                <div class="bgpreventclickandfade"></div>

                                <div id="videok_container" class="hidden">
                                    <span id="x_videok">X</span>
                                    <h5 data-t="movie.trailers_title">Trailerek</h5>
                                    <div id="trailers_container"></div>
                                    <hr>
                                    <h5 data-t="movie.videos_title">Videók</h5>
                                    <div id="videos_container"></div>
                                </div>
                            </div>
                        </div>

                        
                        <div id="inputactions" class="cant_select">
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
                                    <button id="linkbutton" data-t="movie.add_link">Link hozzáadása</button>
                                </div>
                                <div class="bevitel">
                                    <textarea name="note" id="note" rows="2" maxlength="250">Jegyzet</textarea>
                                    <button id="notebutton" data-t="movie.add_note">Jegyzet hozzáadása</button>
                                </div>
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

        dataAdded = true

        setUpcomingErtekelesCucc()
        checkImgLoaded()
        getPersons()
        manageServerLink()

        translatePage()
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
                if (result.dataVissza[i].media_id == parseInt(id, 10)) {
                    var date = new Date(result.dataVissza[i].added_at); 
                    var localDate = date.toLocaleDateString(langcodes); // Hungarian format (YYYY.MM.DD) vagy más
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
                if (result.dataVissza[i].media_id == parseInt(id, 10)) {
                    var date = new Date(result.dataVissza[i].added_at); 
                    var localDate = date.toLocaleDateString(langcodes); // Hungarian format (YYYY.MM.DD) vagy más
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
        tipus: "movie"
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
                    var localDate = date.toLocaleDateString(langcodes); // Hungarian format (YYYY.MM.DD) vagy más
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
        tipus: "movie"
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
                    var localDate = date.toLocaleDateString(langcodes); // Hungarian format (YYYY.MM.DD) vagy más
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
        wishlisttext.dataset.t = "movie.remove_wishlist"
        document.body.style.backgroundColor = "var(--wishlisted)"
        datumok.innerHTML += ` | ${t("movie.wishlisted_date")}: ${wishlistbeAddolva} | `

        wishlist.dataset.do = "remove"
    } else {
        wishlist.innerHTML = '<i class="bi bi-bookmark-plus-fill"></i>'
        wishlisttext.innerHTML = "Kívánságlistára rakás"
        wishlisttext.dataset.t = "movie.add_wishlist"

        wishlist.dataset.do = "add"
    }

    translatePage()
}

wishlistManage()



async function watchedManage() {
    var isWatched = await checkWatched(id)

    if (isWatched) {
        watched.innerHTML = '<i class="bi bi-file-excel-fill"></i>'
        watchedtext.innerHTML = "Jelölés nem megnézettnek"
        watchedtext.dataset.t = "movie.remove_watched"
        document.body.style.backgroundColor = "var(--watched)"
        datumok.innerHTML += ` | ${t("movie.watched_date")}: ${watchlistbeAddolva} | `

        watched.dataset.do = "remove"
    } else {
        watched.innerHTML = '<i class="bi bi-file-check-fill"></i>'
        watchedtext.innerHTML = "Jelölés megnézettnek"
        watchedtext.dataset.t = "movie.add_watched"

        watched.dataset.do = "add"
    }

    translatePage()
}

watchedManage()




async function linkManage() {
    var haslink = await checkLink(id)

    if (haslink) {
        sajaturl.href = haslink
        sajaturl.innerHTML = '<span class="bold" data-t="movie.own_url">Saját link</span>'
        linkbutton.innerHTML = "Link változtatása"
        linkbutton.dataset.t = "movie.change_link"
        datumok.innerHTML += ` | ${t("movie.link_added_date")}: ${linkAddolva} | `

        link.value = haslink
    } else {
        sajaturl.innerHTML = ""
    }


    link.addEventListener("focusin", () => {
        link.select()
    })


    translatePage()
}

linkManage()




async function noteManage() {
    var hasnote = await checkNote(id)

    if (hasnote) {
        sajatnote.innerHTML = hasnote
        notebutton.innerHTML = "Jegyzet változtatása"
        notebutton.dataset.t = "movie.change_note"
        datumok.innerHTML += ` | ${t("movie.note_updated_date")}: ${noteFrissitve} | `

        belepesnelNote = hasnote
        note.value = hasnote

        if (Math.floor(hasnote.length / 30) > 2) {
            note.rows = Math.floor(hasnote.length / 30)
        }
    } else {
        sajatnote.innerHTML = ""
    }

    
    translatePage()
}

noteManage()





wishlist.onclick = async() => {

    if (wishlist.dataset.do == "add") {
        try {
            var details = {
                user_id: JSON.parse(localStorage.user).user_id,
                media_id: id,
                media_type: "movie"
            }
    
            const response = await fetch(`${location.origin}/addWishlist`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(details)
            })
    
            const result = await response.json()
    
            notify(t(result.message), result.type)
    
            if(result.type == "success") {
                setTimeout(() => {
                    window.location.reload()
                }, 1000);
            }
        } catch(e) {
            console.log("Error:", e)
        }
    } else if(wishlist.dataset.do == "remove") {
        try {
            var details = {
                user_id: JSON.parse(localStorage.user).user_id,
                media_id: id,
                media_type: "movie"
            }
    
            const response = await fetch(`${location.origin}/removeWishlist`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(details)
            })
    
            const result = await response.json()
    
            notify(t(result.message), result.type)
    
            if(result.type == "success") {
                setTimeout(() => {
                    window.location.reload()
                }, 1000);
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
                media_type: "movie"
            }
    
            const response = await fetch(`${location.origin}/addWatched`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(details)
            })
    
            const result = await response.json()
    
            notify(t(result.message), result.type)
    
            if(result.type == "success") {
                setTimeout(() => {
                    window.location.reload()
                }, 1000);
            }
        } catch(e) {
            console.log("Error:", e)
        }

    } else if(watched.dataset.do == "remove") {
        try {
            var details = {
                user_id: JSON.parse(localStorage.user).user_id,
                media_id: id,
                media_type: "movie"
            }
    
            const response = await fetch(`${location.origin}/removeWatched`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(details)
            })
    
            const result = await response.json()
    
            notify(t(result.message), result.type)
    
            if(result.type == "success") {
                setTimeout(() => {
                    window.location.reload()
                }, 1000);
            }
        } catch(e) {
            console.log("Error:", e)
        }
    }

}





linkbutton.onclick = async() => {

    const pattern = /^(?:(?:https?|ftp):\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+[^\s]*$/i;
    var haslink = await checkLink(id)

    if (pattern.test(link.value) && link.value != haslink) {
        try {
            var details = {
                user_id: JSON.parse(localStorage.user).user_id,
                media_id: id,
                media_type: "movie",
                link_url: link.value
            }
        
            const response = await fetch(`${location.origin}/changeLink`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(details)
            })
        
            const result = await response.json()
        
            notify(t(result.message), result.type)
        
            if(result.type == "success") {
                setTimeout(() => {
                    window.location.reload()
                }, 1000);
            }
        } catch(e) {
            console.log("Error:", e)
        }
    } else {
        if (link.value.length == 0) {
            try {
                var details = {
                    user_id: JSON.parse(localStorage.user).user_id,
                    media_id: id,
                    media_type: "movie",
                    link_url: link.value
                }
            
                const response = await fetch(`${location.origin}/changeLink`, {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(details)
                })
            
                const result = await response.json()
            
                notify(t(result.message), result.type)
            
                if(result.type == "success") {
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000);
                }
            } catch(e) {
                console.log("Error:", e)
            }
            
        } else if(link.value == haslink) {
            notify(t("notifs.A link ugyan az"), "info")

        } else {
            notify(t("notifs.Helytelen URL"), "error")
        }
    }
}




notebutton.onclick = async() => {

    if (note.value != "Jegyzet" && note.value != belepesnelNote) {
        try {
            var details = {
                user_id: JSON.parse(localStorage.user).user_id,
                media_id: id,
                media_type: "movie",
                note: note.value
            }
        
            const response = await fetch(`${location.origin}/changeNote`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(details)
            })
        
            const result = await response.json()
        
            notify(t(result.message), result.type)
        
            if(result.type == "success") {
                setTimeout(() => {
                    window.location.reload()
                }, 1000);
            }
        } catch(e) {
            console.log("Error:", e)
        }
    } else {
        notify(t("notifs.Írj be valamit előtte"), "error")
    }

}




note.addEventListener("focusin", (e) => {
    note.innerHTML = ""
    note.placeholder = t("movie.note")
})




var videokPuttedIn = false

var videokLoad_btn = document.getElementById("videokLoad_btn")
var x_videok = document.getElementById("x_videok")
var videok_container = document.getElementById("videok_container")

//putInVideok()

videokLoad_btn.addEventListener("click", (e) => {
    if (!videokPuttedIn) {
        putInVideok()
        videokPuttedIn = true
    }

    if (videok_container.style.opacity == "0" || videok_container.style.opacity == "") {
        document.querySelector(".bgpreventclickandfade").style.display = "flex"

        videok_container.classList.add("showing")
    } else {
        document.querySelector(".bgpreventclickandfade").style.display = "none"

        videok_container.classList.remove("showing")
    }
})


x_videok.addEventListener("click", (e) => {
    document.querySelector(".bgpreventclickandfade").style.display = "none"
    videok_container.classList.remove("showing")


    var iframek = document.querySelectorAll("iframe")

    iframek.forEach(iframe => {
        //console.log(iframe)
        iframe.src = iframe.src
    })
})




    }
}, 100); // Check every 100ms





async function putInVideok() {
    var trailers_container = document.getElementById("trailers_container")
    var videos_container = document.getElementById("videos_container")

    try {
        const videos_fetch = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`)
        const vids_json = await videos_fetch.json()

        if (vids_json) {
            var vids = vids_json.results

            for (let v = 0; v < vids.length; v++) {
                const vid = vids[v];
                
                if (vid.type == "Trailer" && vid.site == "YouTube") {
                    var Tkey = vid.key
                    var YTURL = `https://www.youtube.com/embed/${Tkey}`

                    const yt_api = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails,status&id=${Tkey}&key=${GOOGLE_API}`)
                    const yt_api_json = await yt_api.json()

                    var canPutInVid = false

                    if(yt_api_json.items[0].contentDetails && yt_api_json.items[0].contentDetails.regionRestriction) {
                        //console.log(yt_api_json.items[0].contentDetails.regionRestriction)

                        if (yt_api_json.items[0].contentDetails.regionRestriction.allowed && !yt_api_json.items[0].contentDetails.regionRestriction.allowed.includes("HU")) {
                            canPutInVid = false
                        } else if (yt_api_json.items[0].contentDetails.regionRestriction.blocked && yt_api_json.items[0].contentDetails.regionRestriction.blocked.includes("HU")) {
                            canPutInVid = false
                        } else {
                            canPutInVid = true
                        }
                    } else {
                        canPutInVid = true
                    }
                    
                    if (canPutInVid) {
                        trailers_container.innerHTML += `
                            <iframe width="445" height="250" src="${YTURL}" frameborder="0" allowfullscreen></iframe>
                        `
                    }

                } else {
                    
                    //console.log(vid)
                    if (vid.site == "YouTube") {
                        var Tkey = vid.key
                        var YTURL = `https://www.youtube.com/embed/${Tkey}`

                        const yt_api = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails,status&id=${Tkey}&key=${GOOGLE_API}`)
                        const yt_api_json = await yt_api.json()

                        var canPutInVid = false

                        if(yt_api_json.items[0].contentDetails && yt_api_json.items[0].contentDetails.regionRestriction) {
                            //console.log(yt_api_json.items[0].contentDetails.regionRestriction)

                            if (yt_api_json.items[0].contentDetails.regionRestriction.allowed && !yt_api_json.items[0].contentDetails.regionRestriction.allowed.includes("HU")) {
                                canPutInVid = false
                            } else if (yt_api_json.items[0].contentDetails.regionRestriction.blocked && yt_api_json.items[0].contentDetails.regionRestriction.blocked.includes("HU")) {
                                canPutInVid = false
                            } else {
                                canPutInVid = true
                            }
                        } else {
                            canPutInVid = true
                        }

                        if (canPutInVid) {
                            videos_container.innerHTML += `
                                <iframe width="445" height="250" src="${YTURL}" frameborder="0" allowfullscreen></iframe>
                            `
                        }
                    }

                }
            }

        }


        if (videos_container.innerHTML == "") {
            videos_container.innerHTML = `<p>${t("movie.not_available_video")}</p>`

            videos_container.innerHTML += `
                <a href="https://www.youtube.com/results?search_query=${movieTitle}" target="_blank" rel="noopener noreferrer">${t("movie.search_for_videos")}</a>
            `
        } else {
            videos_container.innerHTML += `
                <p></p>
                <a href="https://www.youtube.com/results?search_query=${movieTitle}" target="_blank" rel="noopener noreferrer">${t("movie.search_for_more_videos")}</a>
            `
        }

        if (trailers_container.innerHTML == "") {
            trailers_container.innerHTML = `<p>${t("movie.not_available_trailer")}</p>`

            trailers_container.innerHTML += `
                <a href="https://www.youtube.com/results?search_query=${movieTitle}+trailer" target="_blank" rel="noopener noreferrer">${t("movie.search_for_trailers")}</a>
            `
        } else {
            trailers_container.innerHTML += `
                <p></p>
                <a href="https://www.youtube.com/results?search_query=${movieTitle}+trailer" target="_blank" rel="noopener noreferrer">${t("movie.search_for_more_trailers")}</a>
            `
        }
    } catch(e) {
        console.error(e)
    }

}





//Server Link cucc

async function manageServerLink() {
    const serverLink = document.getElementById("serverLink")
    var serverLinkURL = undefined


    var amiMegy = {
        tipus: "movie"
    }

    try {
        const response = await fetch(`${location.origin}/getServerLinks`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(amiMegy)
        })
    
        const result = await response.json()
    
        if (response.ok) {
            for(i in result.dataVissza) {
                if (result.dataVissza[i].media_id == parseInt(id, 10)) {

                    serverLinkURL = result.dataVissza[i].link

                }
            }
        }
    } catch(e) {
        console.error(e)
    }


    if (serverLinkURL != undefined) {
        //van link
        serverLink.innerHTML = `<span class='bold'>${t("movie.watch_here")}</span>`
        serverLink.href = `${window.origin}/watch/movie/${id}`
    }

    
    translatePage()
}




function showExtraInfo() {
    const extraInfoBox = document.getElementById("extraInfoBox")

    if (extraInfoBox.style.height == "0px" || extraInfoBox.style.height == "") {

        extraInfoBox.style.height = "100%"
    } else {
        extraInfoBox.style.height = "0"
    }
}






var Persons = []


async function getPersons() {
    const getData = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`)

    const persons = await getData.json()
    if (persons) {
        Persons = persons
    }


    fillInPersons()
}


function toggleCastToWork() {
    const togglePersons = document.getElementById("togglePersons")

    togglePersons.addEventListener("click", (e) => {

        const stabLista = document.getElementById("stabLista")

        if (togglePersons.dataset.allapot == "opened") {
            togglePersons.dataset.allapot = "closed"
            togglePersons.innerText = t("movie.show_credits")

            stabLista.classList.remove("showing")

        } else if (togglePersons.dataset.allapot == "closed") {
            togglePersons.dataset.allapot = "opened"
            togglePersons.innerText = t("movie.hide_credits")

            stabLista.classList.add("showing")
        }

    })


    translatePage()
}



function getProperTranslation(string) {
    if (t("basic." + string) == ("basic." + string)) {
        return string
    } else {
        return t("basic." + string)
    }
}



function fillInPersons() {
    const szereplok = document.getElementById("szereplok")
    const keszitok = document.getElementById("keszitok")
    
    console.log(Persons)


    if (Persons) {
        for (let ca in Persons.cast) {
            var ember = Persons.cast[ca]

            szereplok.innerHTML += `
                <div class="creditsTag cast">
                    <img loading="lazy" src="https://image.tmdb.org/t/p/original${ember.profile_path}" class="img-fluid creditPersonIMG" alt="A kép nem található">
                    <h4><a href="https://www.google.com/search?q=${ember.name}" target="_blank" rel="noopener noreferrer">${ember.name}</a></h4>
                    <h5>${ember.character}</h5>
                </div>
            `
        }

        if (Persons.cast.length == 0) {
            szereplok.innerHTML += `
                <div class="creditsTag cast">
                    <h4>${t("movie.no_available_data")}</h4>
                    <h5><a href="https://www.google.com/search?q=${movieTitle}+szereposztás" target="_blank" rel="noopener noreferrer">${t("movie.search_for_credits")}</a></h5>
                </div>
            `
        } else {
            szereplok.innerHTML += `
                <div class="creditsTag cast">
                    <h4><a href="https://www.google.com/search?q=${movieTitle}+szereposztás" target="_blank" rel="noopener noreferrer">${t("movie.search_for_more_credits")}</a></h4>
                </div>
            `
        }



        for (let cr in Persons.crew) {
            var ember = Persons.crew[cr]

            keszitok.innerHTML += `
                <div class="creditsTag crew">
                    <img loading="lazy" src="https://image.tmdb.org/t/p/original${ember.profile_path}" class="img-fluid creditPersonIMG" alt="A kép nem található">
                    <h4><a href="https://www.google.com/search?q=${ember.name}" target="_blank" rel="noopener noreferrer">${ember.name}</a></h4>
                    <h5>${getProperTranslation(ember.known_for_department)}</h5>
                    <h6>${getProperTranslation(ember.job)}</h6>
                </div>
            `


            if (ember.job == "Director") {
                if (document.getElementById("rendezo").innerHTML == "") {
                    document.getElementById("rendezo").innerHTML += `
                        <span class="bold">${t("basic.Directing")}: </span> ${ember.name}
                    `
                } else {
                    document.getElementById("rendezo").innerHTML += `, ${ember.name}`
                }
            }


            if (ember.job == "Editor") {
                if (document.getElementById("vago").innerHTML == "") {
                    document.getElementById("vago").innerHTML += `
                        <span class="bold">${t("basic.Editing")}: </span> ${ember.name}
                    `
                } else {
                    document.getElementById("vago").innerHTML += `, ${ember.name}`
                }
            }

        }


        if (Persons.crew.length == 0) {
            keszitok.innerHTML += `
                <div class="creditsTag crew">
                    <h4>${t("movie.no_available_data")}</h4>
                    <h5><a href="https://www.google.com/search?q=${movieTitle}+szereposztás" target="_blank" rel="noopener noreferrer">${t("movie.search_for_credits")}</a></h5>
                </div>
            `
        } else {
            keszitok.innerHTML += `
                <div class="creditsTag crew">
                    <h4><a href="https://www.google.com/search?q=${movieTitle}+szereposztás" target="_blank" rel="noopener noreferrer">${t("movie.search_for_more_credits")}</a></h4>
                </div>
            `
        }
    }

    toggleCastToWork()
}
