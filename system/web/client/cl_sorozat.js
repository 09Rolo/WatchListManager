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
var seasonokSzama = 0


var mas_user_id = undefined


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

var allEpisodes = []
var allEpisodes_jsonok = []
var sumMinutes = 0
var watchedMinutes = 0

var episodesWatched = []
var episodesInMainSeasonsWatched = []

var seriesTitle = ""

var userGroup = "user"
var userID = undefined


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
            headers: { 'Content-Type': 'application/json', "Authorization": localStorage.token }
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




    try {
        const response = await fetch(`${location.origin}/getUserGroup`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json', "Authorization": localStorage.token },
            body: JSON.stringify({username: JSON.parse(localStorage.getItem("user")).username})
        })
    
        const result = await response.json()
    
        if (response.ok) {
            userGroup = result.group
        }

    } catch(e) {
        console.error(e)
    }



    adminsIDInput()
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







function toHoursAndMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes };
}



function getVeszoString(list, definialva) {
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
        } else if (status == "Canceled") {
            visszamegy = "Elkaszálva"
        }
    } else {
        visszamegy = "Ismeretlen"
    }

    return visszamegy
}
*/




const id = window.location.pathname.split("/")[2]

async function getData() {

    const getData = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=${language}`)

    const adatok = await getData.json()
    if (adatok) {
        console.log(adatok)

        if (adatok.last_air_date && adatok.status == "Ended") {
            if (language == "hu") {
                var idotartam = adatok.first_air_date + "-től | " + adatok.last_air_date + "-ig"
            } else if(language == "en") {
                var idotartam = `From ${adatok.first_air_date} | To ${adatok.last_air_date}`
            } else {
                var idotartam = `${adatok.first_air_date} | ${adatok.last_air_date}`
            }
        } else {
            if (language == "hu") {
                var idotartam = adatok.first_air_date + "-től"
            } else if(language == "en") {
                var idotartam = "From " + adatok.first_air_date
            } else {
                var idotartam = adatok.first_air_date + "- "
            }
        }


        seriesTitle = adatok.name

        const elsoresz = document.getElementById("elsoresz")
        elsoresz.innerHTML = ""

        elsoresz.innerHTML = `
            <div class="adatok col-md-7 col-10">
                <div class="felso">
                    <h2 id="cim" class="underline_hover">${adatok.name}</h2>
                    <br>
                    <i id="tagline">${adatok.tagline.length != 0 ? "~" + adatok.tagline + "~" : ""}</i>
                    <hr>
                    <p id="datumok"></p>
                    <p id="sajatnote"></p><br>
                    <p id="leiras" class="hosszulehet" data-allapot="zarva">${adatok.overview}</p>
                </div>
                <div class="also">
                    <div class="infoReszleg">
                        <div id="generalInfo">

                            <div class="elsoszekcio">
                                <p id="kategoriak"><span class="bold">${getVeszoString(adatok.genres)}</span></p>
                                <p id="releasedate">${t("cl_series.runtime")}: <span class="bold">${idotartam}</span></p>

                                <div class="egybe">
                                    <p id="originallang">${t("cl_series.original_language")}: <span class="bold">${adatok.original_language}</span></p>
                                    <p id="status">${t("cl_series.state")}: <span class="bold">${t("cl_series." + adatok.status)}</span></p>
                                </div>
                            </div>
                            <div class="masodikszekcio">
                                <p id="ertekeles" class="rating" style="color: ${ratingColor(adatok.vote_average)};">${adatok.vote_average.toFixed(1)}</p>
                            </div>

                        </div>


                        <hr>
                        <button onclick="showExtraInfo(this)" class="cant_select">...</button>


                        <div id="extraInfoBox">
                            <p id="keszito"><span class="bold">${t("cl_series.creator")}:</span> ${getVeszoString(adatok.created_by)}</p>
                            
                            <!--Egyéb fő crew? Rendező, író valami, nem tudom mik vannak, mehetnek ide üres p-ként aztán majd beleteszem jsel-->
                            <!-- -->
                            <p id="iro"></p>
                            <p id="rendezo"></p>
                            <p id="vago"></p>


                            <p id="network"><span class="bold">${t("cl_series.network")}:</span> ${getVeszoString(adatok.networks)}</p>
                            <p id="production"><span class="bold">${t("cl_series.production_companies")}:</span> ${getVeszoString(adatok.production_companies)}</p>
                            <p id="beszeltnyelvek"><span class="bold">${t("cl_series.spoken_languages")}:</span> ${getVeszoString(adatok.spoken_languages)}</p>


                            <button id="togglePersons" class="cant_select" data-allapot="closed">${t("cl_series.show_credits")}</button>

                            <div id="stabLista" class="hidden">
                                <div id="szereplok">
                                    <h3>${t("cl_series.cast")}</h3>
                                    <!-- JSSEL IDE -->
                                </div>
                                <hr>
                                <div id="keszitok">
                                    <h3>${t("cl_series.crew")}</h3>
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
                            <a href="${adatok.homepage}" target="_blank" rel="noopener noreferrer" id="imdblink"><span class="bold">${t("cl_series.series_homepage")}</span></a>
                            <a href="https://www.google.com/search?q=imdb+${adatok.name}" target="_blank" rel="noopener noreferrer" id="imdblink_search"><span class="bold">${t("cl_series.imdb_search")}</span></a>
                            <a href="https://www.google.com/search?q=${adatok.name}+teljes+részek+magyarul+hd" target="_blank" rel="noopener noreferrer"><span class="bold">${t("cl_series.google_search")}</span></a>
                            
                            <hr>
                            <button id="collapse_button">${t("cl_series.show_multiple_links")}</button>
                            <div id="collapse_links">
                                
                                <a href="https://moviedrive.hu/filmek/?q=${adatok.name}" target="_blank" rel="noopener noreferrer">Moviedrive.hu</a>
                                <a href="https://mozisarok.hu/search/${adatok.name}" target="_blank" rel="noopener noreferrer">Mozisarok.hu</a>
                                <a href="https://ww.yesmovies.ag/search.html?q=${adatok.name}" target="_blank" rel="noopener noreferrer">Yesmovies.ag <span class="kisbetus" data-t="basic.lang_en">Angol</span></a>
                                <a href="https://donkey.to/media/search?query=${adatok.name}" target="_blank" rel="noopener noreferrer">Donkey.to <span class="kisbetus" data-t="basic.lang_en">Angol</span></a>

                                <hr>
                                <a href="https://animedrive.hu/search/?q=${adatok.name}" target="_blank" rel="noopener noreferrer">Animedrive.hu</a>
                                <a href="https://9animetv.to/search?keyword=${adatok.name}" target="_blank" rel="noopener noreferrer">9Animetv.to <span class="kisbetus" data-t="basic.lang_en">Angol</span></a>
                                <a href="https://magyaranime.eu/web/kereso/" target="_blank" rel="noopener noreferrer">Magyaranime.eu</a>
                            </div>
                            

                            
                        </div>

                        <div id="inputactions" class="cant_select">
                            <div class="gombok">
                                <div id="wishlistcontainer">
                                    <button id="wishlist" title="Kívánságlistára"><i class="bi bi-bookmark-plus-fill"></i></button>
                                    <p id="wishlisttext">Kívánságlistára</p>
                                </div>

                                <div id="watchedcontainer">
                                    <button id="watched" title="Az összes rész megnézettnek jelölése"><i class="bi bi-file-check"></i></button>
                                    <p id="watchedtext">Jelölés befejezettnek</p>
                                </div>
                            </div>

                            <div class="inputok">
                                <div class="bevitel">
                                    <input type="text" name="link" id="link" placeholder="Link">
                                    <button id="linkbutton" data-t="cl_series.add_link">Link hozzáadása</button>
                                </div>
                                <div class="bevitel">
                                    <textarea name="note" id="note" rows="2" maxlength="250">Jegyzet</textarea>
                                    <button id="notebutton" data-t="cl_series.add_note">Jegyzet hozzáadása</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="poster" class="col-md-4 col-10">
                <img src="https://image.tmdb.org/t/p/original${adatok.poster_path}" id="fadedimg" class="img-fluid">
                <img src="https://image.tmdb.org/t/p/original${adatok.poster_path}" id="posterimg" class="img-fluid">

                <div class="videok">
                    <button id="videokLoad_btn" data-t="cl_series.show_videos">Videók mutatása</button>
                    <div class="bgpreventclickandfade"></div>

                    <div id="videok_container" class="hidden">
                        <span id="x_videok">X</span>
                        <h5 data-t="cl_series.trailers_title">Trailerek</h5>
                        <div id="trailers_container"></div>
                        <hr>
                        <h5 data-t="cl_series.videos_title">Videók</h5>
                        <div id="videos_container"></div>
                    </div>
                </div>
            </div>
        `

        
        
        const masodikresz = document.getElementById("masodikresz")
        masodikresz.innerHTML = `
                <div class="general" id="general">
                    <p id="num_of_s"><span data-t="cl_series.number_of_seasons">Évadok száma:</span> ${adatok.number_of_seasons}</p>
                    
                </div>


                <div id="progressionbox">
                    <!--
                    <div class="progression">
                        <div class="progress">
                            <div class="bar" data-max="62"></div>
                            <div class="fill" data-value="40"></div>
                        </div>
                        
                        <div class="label">
                            <p class="progression_current">40</p>
                            <p class="progression_label">Epizódok</p>
                            <p class="progression_max">62</p>
                        </div>
                    </div>

                    <div class="progression">
                        <div class="progress">
                            <div class="bar" data-max="1600"></div>
                            <div class="fill" data-value="2480"></div>
                        </div>
                        
                        <div class="label">
                            <p class="progression_current">1600</p>
                            <p class="progression_label">Perc vagy óra és akkor más a max p</p>
                            <p class="progression_max">2480</p>
                        </div>
                    </div>
                    -->
                </div>


                <div id="osszesito">
                    <button id="osszesito_btn" onclick="showTable()" data-t="cl_series.summary_table">Összesítő táblázat</button>


                    <div class="szinek" id="szinek" style="display: none;">
                        <div class="magyarazat">
                            <div class="szin"></div>
                            <div class="szinnev" data-t="cl_series.rating_awesome">Tökéletes</div>
                            <p>|</p>
                        </div>
                        <div class="magyarazat">
                            <div class="szin"></div>
                            <div class="szinnev" data-t="cl_series.rating_great">Kiváló</div>
                            <p>|</p>
                        </div>
                        <div class="magyarazat">
                            <div class="szin"></div>
                            <div class="szinnev" data-t="cl_series.rating_good">Jó</div>
                            <p>|</p>
                        </div>
                        <div class="magyarazat">
                            <div class="szin"></div>
                            <div class="szinnev" data-t="cl_series.rating_regular">Átlagos</div>
                            <p>|</p>
                        </div>
                        <div class="magyarazat">
                            <div class="szin"></div>
                            <div class="szinnev" data-t="cl_series.rating_bad">Rossz</div>
                            <p>|</p>
                        </div>
                        <div class="magyarazat">
                            <div class="szin"></div>
                            <div class="szinnev" data-t="cl_series.rating_garbage">Szemét</div>
                            <p>|</p>
                        </div>
                        <div class="magyarazat">
                            <div class="szin"></div>
                            <div class="szinnev" data-t="cl_series.rating_no_data">Nincs adat</div>
                        </div>
                    </div>


                    <div id="tablazat" style="display: none">
                        <table class="cant_select">
                            <thead>
                                <tr id="table_seasons">
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody id="table_episodes">

                            </tbody>
                        </table>
                    </div>

                </div>


                <div id="seasonlist">
                    
                </div>

                <div id="seasonpage">

                </div>
        `

        const seasonlist = document.getElementById("seasonlist")

        
        seasonokSzama = adatok.seasons.length
        

        const table_seasons = document.getElementById("table_seasons")
        const table_episodes = document.getElementById("table_episodes")

        if (adatok.seasons[0].season_number == 1) {

            var max_eps = 0


            for (let season = 1; season < adatok.seasons.length + 1; season++) {

                const getData_seasons = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${API_KEY}&language=${language}`)
                const seasonok = await getData_seasons.json()
                try {
                    if (seasonok.episodes[seasonok.episodes.length - 1].episode_number > max_eps) {  //faszom, ha kimarad egy rész, vagyis szar a számozás akkor nagyobb lesz a szám mint az ep_count :(((
                        max_eps = seasonok.episodes[seasonok.episodes.length - 1].episode_number
                    }
                } catch(e) {}
            }


            for (let ep = 0; ep < max_eps; ep++) {
                table_episodes.innerHTML += `
                    <tr id="t_e${ep+1}">
                        <td>E${ep+1}.</td>
                    </tr>
                `
            }


            for (let season = 1; season < adatok.seasons.length + 1; season++) {
                const getData_seasons = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${API_KEY}&language=${language}`)
                const seasonok = await getData_seasons.json()

                //console.log(seasonok)
                seasonlist.innerHTML += `
                    <button onclick="changeSeason(this)" class="season">${seasonok.season_number}</button>
                `


                table_seasons.innerHTML += `
                    <th>S${season}</th>
                `

                for (let eps = 0; eps < seasonok.episodes.length; eps++) {
                    allEpisodes.push(seasonok.episodes[eps].id)
                    allEpisodes_jsonok.push(seasonok.episodes[eps])
                    sumMinutes += seasonok.episodes[eps].runtime
                }


                for (let i = 0; i < max_eps; i++) {
                    if (seasonok.episodes[i]) {
                        

                        document.getElementById(`t_e${seasonok.episodes[i].episode_number}`).innerHTML += `
                            <td id="Table${seasonok.episodes[i].id}" style="background-color: ${ratingColor(seasonok.episodes[i].vote_average)};" title="${seasonok.episodes[i].name}" onclick="clickedInTable(${seasonok.episodes[i].season_number}, ${seasonok.episodes[i].id})">${seasonok.episodes[i].vote_average.toFixed(1)}</td>
                        `
                    } else {
                        document.getElementById(`t_e${i+1}`).innerHTML += `
                            <td></td>
                        `
                    }
                }

                
            }
        } else {

            var max_eps = 0


            table_seasons.innerHTML += `
                <th>Special</th>
                <th></th>
            `


            for (let season = 0; season < adatok.seasons.length; season++) {

                const getData_seasons = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${API_KEY}&language=${language}`)
                const seasonok = await getData_seasons.json()
                
                for(let faszomszam in seasonok.episodes) {
                    if (seasonok.episodes[faszomszam].episode_number > max_eps) {  //faszom, ha kimarad egy rész, vagyis szar a számozás akkor nagyobb lesz a szám mint az ep_count :(((
                        max_eps = seasonok.episodes[faszomszam].episode_number
                    }
                }
            }


            for (let ep = 0; ep < max_eps; ep++) {
                table_episodes.innerHTML += `
                    <tr id="t_e${ep+1}">
                        <td>E${ep+1}.</td>
                    </tr>
                `
            }
            

        
            for (let season = 0; season < adatok.seasons.length; season++) {

                const getData_seasons = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${API_KEY}&language=${language}`)
                const seasonok = await getData_seasons.json()

                //console.log(seasonok)
                seasonlist.innerHTML += `
                    <button onclick="changeSeason(this)" class="season">${seasonok.season_number}</button>
                `

                if (season > 0) { //extrákat nem számolja bele az összes epizódnál, ezért nem kellene, hogy pl 62/62-t néztél meg és még mindig "nem láttad" az egészet
                    table_seasons.innerHTML += `
                        <th>S${season}</th>
                    `

                    for (let eps = 0; eps < seasonok.episodes.length; eps++) {
                        allEpisodes.push(seasonok.episodes[eps].id)
                        allEpisodes_jsonok.push(seasonok.episodes[eps])
                        sumMinutes += seasonok.episodes[eps].runtime
                    }


                    for (let i = 0; i < max_eps; i++) {
                        if (seasonok.episodes[i]) {

                            document.getElementById(`t_e${seasonok.episodes[i].episode_number}`).innerHTML += `
                                <td id="Table${seasonok.episodes[i].id}" style="background-color: ${ratingColor(seasonok.episodes[i].vote_average)};" title="${seasonok.episodes[i].name}" onclick="clickedInTable(${seasonok.episodes[i].season_number}, ${seasonok.episodes[i].id})">${seasonok.episodes[i].vote_average.toFixed(1)}</td>
                            `
                        } else {
                            document.getElementById(`t_e${i+1}`).innerHTML += `
                                <td></td>
                            `
                        }
                    }

                } else {
                    var szamokVoltak = []

                    for (let i = 0; i < max_eps; i++) {
                        if (seasonok.episodes[i] && seasonok.episodes[i].episode_number == i+1) { //faszért van olyan, hogy kimarad random egy rész??? Breaking Bad Specialsnál 7. után a 9. jön  :(

                            if (!szamokVoltak.includes(seasonok.episodes[i].episode_number)) {


                                szamokVoltak.push(seasonok.episodes[i].episode_number)

                                document.getElementById(`t_e${seasonok.episodes[i].episode_number}`).innerHTML += `
                                    <td id="Table${seasonok.episodes[i].id}" style="background-color: ${ratingColor(seasonok.episodes[i].vote_average)};" title="${seasonok.episodes[i].name}" onclick="clickedInTable(${seasonok.episodes[i].season_number}, ${seasonok.episodes[i].id})">${seasonok.episodes[i].vote_average.toFixed(1)}</td>
                                    <td></td>
                                `
                            }
                        } else if(seasonok.episodes[i] && seasonok.episodes[i].episode_number != i+1) {

                            if (!szamokVoltak.includes(seasonok.episodes[i].episode_number)) {

                                szamokVoltak.push(seasonok.episodes[i].episode_number)
                                
                                document.getElementById(`t_e${seasonok.episodes[i].episode_number}`).innerHTML += `
                                    <td id="Table${seasonok.episodes[i].id}" style="background-color: ${ratingColor(seasonok.episodes[i].vote_average)};" title="${seasonok.episodes[i].name}" onclick="clickedInTable(${seasonok.episodes[i].season_number}, ${seasonok.episodes[i].id})">${seasonok.episodes[i].vote_average.toFixed(1)}</td>
                                    <td></td>
                                `
                            }
                        } else {

                            if (!szamokVoltak.includes(i+1)) {
                                szamokVoltak.push(i+1)

                                document.getElementById(`t_e${i+1}`).innerHTML += `
                                    <td></td>
                                    <td></td>
                                `
                            }
                        }
                    }


                    var max_eps_arrayed = []

                    for (let cucc = 1; cucc < max_eps+1; cucc++) {
                        max_eps_arrayed.push(cucc)
                    }

                    var kimaradtSzamok = max_eps_arrayed.filter(val => !szamokVoltak.includes(val));

                    for (let sz = 0; sz < kimaradtSzamok.length; sz++) {
                        const szam = kimaradtSzamok[sz];
                        
                        document.getElementById(`t_e${szam}`).innerHTML += `
                            <td></td>
                            <td></td>
                        `
                    }

                }
                
            }

        }
        
        

        setErtekelesColors()
        setUpcomingErtekelesCucc()
        startDragFigyeles()
        checkImgLoaded()
        SpecialSeriesThings()
        getPersons()
        manageServerLink()
        idetifyHosszuSzoveg()

        translatePage()



        var nagyobb0percnel = 0

        for (let jsoni = 0; jsoni < allEpisodes_jsonok.length; jsoni++) {
            const json = allEpisodes_jsonok[jsoni];
            if (json.runtime > 0) {
                nagyobb0percnel += 1
            }     
        }

        var atlaghossz = Math.floor(sumMinutes / nagyobb0percnel)
        var ahossz_h = toHoursAndMinutes(atlaghossz).hours
        var ahossz_m = toHoursAndMinutes(atlaghossz).minutes

        if (ahossz_h != 0) {
            if (ahossz_m != 0) {
                var ahossztext = `${ahossz_h} ${t("basic.hours")} ${ahossz_m} ${t("basic.minutes")}`
            } else {
                var ahossztext = `${ahossz_h} ${t("basic.hours")}`
            }
        } else {
            if (ahossz_m != 0) {
                var ahossztext = `${ahossz_m} ${t("basic.minutes")}`
            } else {
                var ahossztext = "0"
            }
        }
        

        document.getElementById("general").innerHTML += `
            <p id="num_of_e"><span data-t="cl_series.number_of_all_episodes">Epizódok száma:</span> ${allEpisodes.length}</p>
            <p id="num_of_mins"><span data-t="cl_series.average_length">Átlag hossz:</span> ${ahossztext}</p>
        `



        var marVoltKoviAirDate = false

        for(let ep in allEpisodes_jsonok) {
            if (!marVoltKoviAirDate) {
                if (new Date(allEpisodes_jsonok[ep].air_date) > new Date()) {
                    document.getElementById("general").innerHTML += `
                        <p id="kovi_ep_to_air"><span data-t="cl_series.next_release">Következő megjelenés:</span> ${allEpisodes_jsonok[ep].season_number}. évad ${allEpisodes_jsonok[ep].episode_number}. rész (${allEpisodes_jsonok[ep].air_date})</p>
                    `

                    marVoltKoviAirDate = true
                }
            }
        }

    }

    translatePage()


    document.getElementById("reload_if_nothing_text").style.display = "none"

    dataAdded = true
}



//------------------------------------------------------Backend cuccok---------------------------------------------
var wishlistbeAddolva
var watchlistbeAddolvaEloszor
var watchlistbeAddolvaUtoljara
var linkAddolva
var noteFrissitve


async function checkWishlist(id, userID) {
    let user_id = userID || JSON.parse(localStorage.user).user_id

    var amiMegy = {
        user_id: user_id,
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




async function checkWatched(id, userID) {
    let user_id = userID || JSON.parse(localStorage.user).user_id

    console.log(user_id)

    var lastEpisodeWatched
    var eloszorBasicDate
    var utoljaraBasicDate


    var amiMegy = {
        user_id: user_id,
        tipus: "tv"
    }

    try {
        const response = await fetch(`${location.origin}/getWatched`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(amiMegy)
        })
    
        const result = await response.json()
    

        let voltmar = false

        if (response.ok) {
            for(i in result.dataVissza) {
                if (result.dataVissza[i].media_id == parseInt(id, 10)) {
                    if (!voltmar) {
                        voltmar = true
                    }


                    var date = new Date(result.dataVissza[i].added_at);
                    var localDate = date.toLocaleDateString(langcodes); // Hungarian format (YYYY.MM.DD) vagy más

                    if (eloszorBasicDate == undefined || eloszorBasicDate > date) {
                        eloszorBasicDate = date
                        watchlistbeAddolvaEloszor = localDate
                    }

                    if (utoljaraBasicDate == undefined || utoljaraBasicDate <= date) {
                        utoljaraBasicDate = date
                        watchlistbeAddolvaUtoljara = localDate

                        lastEpisodeWatched = result.dataVissza[i].episode_id
                    }
                    

                    
                    if (allEpisodes.includes(result.dataVissza[i].episode_id)) {
                        episodesInMainSeasonsWatched.push(result.dataVissza[i].episode_id) //progress-barba csak akkor tegye bele ha nem a specialsból való vagy hasonlók
                    }

                    episodesWatched.push(result.dataVissza[i].episode_id)
                }
            }

            
            var generalcucc = document.getElementById("general")
            //generalcucc.innerHTML += `
            //    <p id="num_of_seen"><span>Látott epizódok száma:</span> ${episodesWatched.length}</p>
            //`

            fillInLastWatched(lastEpisodeWatched)
            //console.log(watchlistbeAddolvaUtoljara)
            progressBars(episodesInMainSeasonsWatched.length, allEpisodes.length, t("cl_series.seen_episodes"))

            checkWatchedMinutes()


            if (voltmar) {
                var allEpisodes_aminekemkell = allEpisodes_jsonok.filter(el => {
                    let epdate_tonorm = new Date(el.air_date).setHours(0, 0, 0, 0)
                    let now_tonorm = new Date().setHours(0, 0, 0, 0)

                    if (epdate_tonorm <= now_tonorm) {
                        if (epdate_tonorm < now_tonorm) {
                            return true
                        }

                        if (epdate_tonorm === now_tonorm && el.runtime) {
                            return true
                        }

                        return false
                    }

                    return false
                });

                //console.log(allEpisodes_aminekemkell)


                if (allEpisodes_aminekemkell.every(el => episodesWatched.includes(el.id))) {
                    return "vegig"
                } else {
                    return "elkezdte"
                }
                
            } else {
                return "nem"
            }

        } else {
            return "nem"
        }
    } catch(e) {
        console.error(e)
        return "nem"
    }
}




async function checkLink(id, userID) {
    let user_id = userID || JSON.parse(localStorage.user).user_id

    var amiMegy = {
        user_id: user_id,
        tipus: "tv"
    }

    try {
        const response = await fetch(`${location.origin}/getLinks`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json', "Authorization": localStorage.token },
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




async function checkNote(id, userID) {
    let user_id = userID || JSON.parse(localStorage.user).user_id

    var amiMegy = {
        user_id: user_id,
        tipus: "tv"
    }

    try {
        const response = await fetch(`${location.origin}/getNotes`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json', "Authorization": localStorage.token },
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
async function wishlistManage(userID) {
    var isWishlisted = await checkWishlist(id, userID)

    if (isWishlisted) {
        wishlist.innerHTML = '<i class="bi bi-bookmark-dash-fill"></i>'
        wishlisttext.innerHTML = "Kivétel a kívánságlistából"
        wishlisttext.dataset.t = "cl_series.remove_wishlist"
        document.body.style.backgroundColor = "var(--wishlisted)"
        datumok.innerHTML += ` | ${t("cl_series.wishlisted_date")}: ${wishlistbeAddolva} | `

        wishlist.dataset.do = "remove"
    } else {
        wishlist.innerHTML = '<i class="bi bi-bookmark-plus-fill"></i>'
        wishlisttext.innerHTML = "Kívánságlistára rakás"
        wishlisttext.dataset.t = "cl_series.add_wishlist"

        wishlist.dataset.do = "add"
    }


    translatePage()
}

wishlistManage(userID)



async function watchedManage(userID) {
    var isWatched = await checkWatched(id, userID)

    if (isWatched == "vegig") {
        watched.innerHTML = '<i class="bi bi-file-excel-fill"></i>'
        watchedtext.innerHTML = "Jelölés nem befejezettnek"
        watchedtext.dataset.t = "cl_series.mark_as_not_finished"
        document.body.style.backgroundColor = "var(--watched-series)"
        datumok.innerHTML += `| ${t("cl_series.started_date")}: ${watchlistbeAddolvaEloszor} | | ${t("cl_series.watched_date")}: ${watchlistbeAddolvaUtoljara} | `

        watched.dataset.do = "removeall"

    } else if(isWatched == "nem") {
        watched.innerHTML = '<i class="bi bi-file-check-fill"></i>'
        watchedtext.innerHTML = "Jelölés befejezettnek"
        watchedtext.dataset.t = "cl_series.mark_as_finished"

        watched.dataset.do = "addall"

    } else if (isWatched == "elkezdte") {
        watched.innerHTML = '<i class="bi bi-file-check-fill"></i>'
        watchedtext.innerHTML = "Jelölés befejezettnek"
        watchedtext.dataset.t = "cl_series.mark_as_finished"
        document.body.style.backgroundColor = "var(--started-series)"
        datumok.innerHTML += ` | ${t("cl_series.started_date")}: ${watchlistbeAddolvaEloszor} | `

        watched.dataset.do = "addall"

    }


    translatePage()
}

watchedManage(userID)




async function linkManage() {
    var haslink = await checkLink(id)

    if (haslink) {
        sajaturl.href = haslink
        sajaturl.innerHTML = '<span class="bold" data-t="cl_series.own_url">Saját link</span>'
        linkbutton.innerHTML = "Link változtatása"
        linkbutton.dataset.t = "cl_series.change_link"
        datumok.innerHTML += ` | ${t("cl_series.link_added_date")}: ${linkAddolva} | `

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
        notebutton.dataset.t = "cl_series.change_note"
        datumok.innerHTML += ` | ${t("cl_series.note_updated_date")}: ${noteFrissitve} | `

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
                media_type: "tv"
            }
    
            const response = await fetch(`${location.origin}/addWishlist`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json', "Authorization": localStorage.token },
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
                media_type: "tv"
            }
    
            const response = await fetch(`${location.origin}/removeWishlist`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json', "Authorization": localStorage.token },
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


    if (watched.dataset.do == "addall") {
        try {
            //
            selectedEpisodes = allEpisodes

            //console.log(selectedEpisodes)
            addEpsToWatched()
        } catch(e) {
            console.log("Error:", e)
        }

    } else if(watched.dataset.do == "removeall") {
        try {
            //
            selectedEpisodes = allEpisodes

            removeEpsFromWatched()
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
                media_type: "tv",
                link_url: link.value
            }
        
            const response = await fetch(`${location.origin}/changeLink`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json', "Authorization": localStorage.token },
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
                    media_type: "tv",
                    link_url: link.value
                }
            
                const response = await fetch(`${location.origin}/changeLink`, {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json', "Authorization": localStorage.token },
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
                media_type: "tv",
                note: note.value
            }
        
            const response = await fetch(`${location.origin}/changeNote`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json', "Authorization": localStorage.token },
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
    note.placeholder = t("cl_series.note")
})


document.getElementById("cim").addEventListener("click", (e) => {
    document.getElementById("seasonlist").scrollIntoView({ behavior: 'smooth' });
})



var collapse_button = document.getElementById("collapse_button")
var collapse_links = document.getElementById("collapse_links")

collapse_button.addEventListener("click", (e) => {
    //console.log(collapse_links.style.height)

    if (collapse_links.style.height == "0px" || collapse_links.style.height == "") {

        collapse_links.style.height = "100%"
        collapse_button.innerHTML = "Kevesebb link mutatása"
        collapse_button.dataset.t = "cl_series.hide_multiple_links"

    } else {

        collapse_links.style.height = "0px"
        collapse_button.innerHTML = "Több link mutatása"
        collapse_button.dataset.t = "cl_series.show_multiple_links"

    }


    translatePage()
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
        console.log(iframe)
        iframe.src = iframe.src
    })
})





    }
}, 100); // Check every 100ms



/*----------------------------------------------------------------------------------------- Seasonok / Epizódok /*----------------------------------------------------------------------------------------- */


var selectedEpisodes = []



async function changeSeason(btn, seasonnum, eptoselect) {
    
    if (seasonnum) { //tehát ha összesítőből
        var canDoIt = false
        var haveToClearSelection = true

        season_buttons = document.getElementsByClassName("season")
        Array.prototype.forEach.call(season_buttons, function(ele) {


            if (ele.style.backgroundColor == "rgba(0, 255, 0, 0.6)" && ele.innerHTML == seasonnum) {
                haveToClearSelection = false

                setTimeout(() => {
                    var episode_divs = document.querySelectorAll(".episode")

                    episode_divs.forEach(epdiv => {
                        if (epdiv.id == eptoselect) {
                            selectEpisode(epdiv)
                        }
                    });
                }, 1000);


            } else if(ele.style.backgroundColor != "rgba(0, 255, 0, 0.6)" && ele.innerHTML == seasonnum) {
                haveToClearSelection = true

                season_num = seasonnum
                ele.style.backgroundColor = "rgba(0, 255, 0, 0.6)"
                ele.style.borderColor = "rgb(0, 255, 0)"


                setTimeout(() => {
                    var episode_divs = document.querySelectorAll(".episode")

                    episode_divs.forEach(epdiv => {
                        if (epdiv.id == eptoselect) {
                            selectEpisode(epdiv)
                        }
                    });
                }, 1000);


                canDoIt = true
            } else {
                ele.style.backgroundColor = "rgba(0,0,0,0.4)"
                ele.style.borderColor = "var(--red-underline)"
            }
            
        });

    

        if (haveToClearSelection) {
            if (selectedEpisodes.length > 0) {
                notify(t("notifs.Az összes kiválasztás törlődött"), "info")

                document.querySelectorAll("td").forEach(tableep => {
                    if (tableep.style.border == "3px solid var(--red-theme)") {
                        tableep.style.border = "0px"
                    }
                })
            }

            selectedEpisodes = []


            document.querySelectorAll("td").forEach(tableep => {
                if (tableep.style.border == "3px solid var(--red-theme)") {
                    tableep.style.border = "0px"
                }
            })
        }


        if(canDoIt) {
            try {
                const getData_seasons = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${season_num}?api_key=${API_KEY}&language=${language}`)
                const season = await getData_seasons.json()
                
                loadSeasonData(season)
            } catch (e) {
                console.error(e)
            }
        }


    } else {

        if (selectedEpisodes.length > 0) {
            notify(t("notifs.Az összes kiválasztás törlődött"), "info")
        }

        selectedEpisodes = []


        if (btn.style.borderColor != "rgb(0, 255, 0)") {
            season_num = btn.innerHTML

            season_buttons = document.getElementsByClassName("season")
            Array.prototype.forEach.call(season_buttons, function(ele) {
                ele.style.backgroundColor = "rgba(0,0,0,0.4)"
                ele.style.borderColor = "var(--red-underline)"
            });
        
            btn.style.backgroundColor = "rgba(0, 255, 0, 0.6)"
            btn.style.borderColor = "rgb(0, 255, 0)"
        
            try {
                const getData_seasons = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${season_num}?api_key=${API_KEY}&language=${language}`)
                const season = await getData_seasons.json()
            
                loadSeasonData(season)
            } catch (e) {
                console.error(e)
            }
        } else {
            season_buttons = document.getElementsByClassName("season")
            Array.prototype.forEach.call(season_buttons, function(ele) {
                ele.style.backgroundColor = "rgba(0,0,0,0.4)"
                ele.style.borderColor = "var(--red-underline)"
            });

            const container = document.getElementById("seasonpage")

            container.innerHTML = ""

            nav_musicbutton("", true)
        }

    }


    translatePage()
}






var utoljaraMegnezettEp
let clickHandler = null
let scrollHandler = null


function handleWindowScrollForArrow(e, utoljaraMegnezettEp, arrowBtn) {
    let currLoc = container.getBoundingClientRect().top


    if (utoljaraMegnezettEp) {
        let currLocOfLastWached = utoljaraMegnezettEp.getBoundingClientRect().top
    
        if (currLocOfLastWached > 50 && currLocOfLastWached < 900) { //most mehet máshová, fel vagy le
            if (currLoc < 100) { //minuszba fog majd menni ugye ha kimegy a képből, és akkor mehet le a legaljára, de ez a kb érték(100) kell neki most
                arrowBtn.innerHTML = '<i class="bi bi-arrow-up-circle"></i>'
                arrowBtn.dataset.direction = "top"
            
            } else {
                arrowBtn.innerHTML = '<i class="bi bi-arrow-down-circle"></i>'
                arrowBtn.dataset.direction = "bottom"
            
            }
        
        } else {
            if (currLocOfLastWached > 50) {
                arrowBtn.innerHTML = '<i class="bi bi-arrow-down-circle"></i>'
                arrowBtn.dataset.direction = "bottom"
            
            } else {
                arrowBtn.innerHTML = '<i class="bi bi-arrow-up-circle"></i>'
                arrowBtn.dataset.direction = "top"
            
            }
        }
    
    } else {
        if (currLoc < 100) { //minuszba fog majd menni ugye ha kimegy a képből, és akkor mehet le a legaljára, de ez a kb érték(100) kell neki most
            arrowBtn.innerHTML = '<i class="bi bi-arrow-up-circle"></i>'
            arrowBtn.dataset.direction = "top"
            
        } else {
            arrowBtn.innerHTML = '<i class="bi bi-arrow-down-circle"></i>'
            arrowBtn.dataset.direction = "bottom"
        
        }
    
    }
}


function handleArrowClick(e, utoljaraMegnezettEp, arrowBtn) {
    var arrowBtn = document.getElementById("backToSeasonSelection")
    let currLoc = container.getBoundingClientRect().top

    
    if (utoljaraMegnezettEp) {
        let currLocOfLastWached = utoljaraMegnezettEp.getBoundingClientRect().top
    
        if (currLocOfLastWached > 50 && currLocOfLastWached < 900) { //most mehet máshová, fel vagy le
        
            if (arrowBtn.dataset.direction == "bottom") {
                document.querySelector("#episodes hr").scrollIntoView({ behavior: 'smooth' });
            
                arrowBtn.innerHTML = '<i class="bi bi-arrow-up-circle"></i>'
                arrowBtn.dataset.direction = "top"
            
            } else if (arrowBtn.dataset.direction == "top") {
                document.getElementById("seasonlist").scrollIntoView({ behavior: 'smooth' });
            
                setTimeout(() => {
                    arrowBtn.innerHTML = '<i class="bi bi-arrow-down-circle"></i>'
                    arrowBtn.dataset.direction = "bottom"
                }, 1000);
            
            }
        
        } else {
            //itt meg muszáj neki az utoljára megnézettre mennie
        
            window.scrollTo({
                top: utoljaraMegnezettEp.getBoundingClientRect().top + window.pageYOffset - 100,
                behavior: "smooth",
            });
        
        
            if (arrowBtn.dataset.direction == "bottom") {
            
                setTimeout(() => {
                    arrowBtn.innerHTML = '<i class="bi bi-arrow-down-circle"></i>'
                    arrowBtn.dataset.direction = "bottom"
                }, 1000);
            
            } else if (arrowBtn.dataset.direction == "top") {
            
                arrowBtn.innerHTML = '<i class="bi bi-arrow-up-circle"></i>'
                arrowBtn.dataset.direction = "top"
            
            }
        
        }
    } else {
        //ha még ugye nincs bejelölt rész
    
        if (arrowBtn.dataset.direction == "bottom") {
            document.querySelector("#episodes hr").scrollIntoView({ behavior: 'smooth' });
        
            arrowBtn.innerHTML = '<i class="bi bi-arrow-up-circle"></i>'
            arrowBtn.dataset.direction = "top"
        
        } else if (arrowBtn.dataset.direction == "top") {
            document.getElementById("seasonlist").scrollIntoView({ behavior: 'smooth' });
        
            setTimeout(() => {
                arrowBtn.innerHTML = '<i class="bi bi-arrow-down-circle"></i>'
                arrowBtn.dataset.direction = "bottom"
            }, 1000);
        
        }
    }
}




function loadSeasonData(s) {
    const container = document.getElementById("seasonpage")
    //console.log(s)
    let date = s.air_date
    let name = s.name
    let episodes = s.episodes
    let overview = s.overview
    let poster = s.poster_path
    let num = s.season_number
    let rating = s.vote_average
    var countAfterMidSeason = 0
    utoljaraMegnezettEp = undefined

    SpecialThingsAudioManage(num)

    container.innerHTML = `
        <div class="infok">
            <h3>${name}</h3>
            <h5>(${date})</h5>
            <p class="hosszulehet" data-allapot="zarva">${overview}</p>
            <div id="ertekeles" class="rating" style="color: ${ratingColor(rating)};">${rating.toFixed(1)}</div>
        </div>

        <div class="row kozeprow">
            <div id="episodes" class="col-md-7 col-12">
                
            </div>
            
            <div id="evadposter" class="col-md-4 col-10">
                <img src="https://image.tmdb.org/t/p/original${poster}" id="evadfadedimg" class="img-fluid">
                <img src="https://image.tmdb.org/t/p/original${poster}" id="evadposterimg" class="img-fluid">
            </div>
        </div>
    `


    idetifyHosszuSzoveg() //az overviewnek kell


    const episodes_container = document.getElementById("episodes")
    episodes_container.innerHTML = ""

    for (let episode = 0; episode < episodes.length; episode++) {
        let ep = episodes[episode]
        var hossz = 0
        
        if (toHoursAndMinutes(ep.runtime)["hours"] != 0) {
            var hossz = `<span class="bold">${toHoursAndMinutes(ep.runtime)["hours"]}</span> ${t("basic.hours")} ${toHoursAndMinutes(ep.runtime)["minutes"] != 0 ? `<span class="bold">${toHoursAndMinutes(ep.runtime)["minutes"]}</span> ${t("basic.minutes")} ` : ""}(${ep.runtime}${t("basic.minutes")})`
        } else {
            var hossz = `<span class="bold">${toHoursAndMinutes(ep.runtime)["minutes"]}</span> ${t("basic.minutes")}`
        }

        var epnumtext = ep.episode_number
        var overviewinfo = ""

        if (ep.episode_type == "mid_season" || countAfterMidSeason > 0) {
            if (countAfterMidSeason == 0) {
                countAfterMidSeason++
            } else {
                countAfterMidSeason++
                epnumtext = `${ep.episode_number} <span class="mid_season_secound_countdown">(${countAfterMidSeason-1})</span>`
                overviewinfo = "<br><br><span class='extrainfo' data-t='cl_series.extra_info_midSeasons'>(Sok helyen külön töltik fel a seasont a felénél kettéosztva. Azért van a második számláló)</span>"
            }

        }



        if (userGroup == "user") {
            
            episodes_container.innerHTML += `
                <div class="episode hidden" id="${ep.id}" onclick="selectEpisode(this)">
                    <div class="data">
                        <p class="ep_num">${epnumtext}.</p>
                        <p>${ep.name}</p>
                        <p>(${ep.air_date}, ${hossz})</p>
                        <div id="ertekeles" class="rating" style="color: ${ratingColor(ep.vote_average)};">${ep.vote_average.toFixed(1)}</div>
                        <button class="overviewButton" onclick="showOverview(this.parentElement.parentElement)" data-t="cl_series.overview">Áttekintés</button>
                    </div>
                    <div class="overview">
                        <p>${ep.overview}${overviewinfo}</p>
                    </div>
                </div>
        
            `

        } else {

            episodes_container.innerHTML += `
                <div class="episode hidden" id="${ep.id}" onclick="selectEpisode(this)">
                    <div class="data">
                        <p class="ep_num">${epnumtext}.</p>
                        <p>${ep.name}</p>
                        <i>(DEV ONLY) Ep ID:${ep.id}</i>
                        <p>(${ep.air_date}, ${hossz})</p>
                        <div id="ertekeles" class="rating" style="color: ${ratingColor(ep.vote_average)};">${ep.vote_average.toFixed(1)}</div>
                        <button class="overviewButton" onclick="showOverview(this.parentElement.parentElement)" data-t="cl_series.overview">Áttekintés</button>
                    </div>
                    <div class="overview">
                        <p>${ep.overview}${overviewinfo}</p>
                    </div>
                </div>
        
            `

        }
        
    }

    episodes_container.innerHTML += `
        <hr>
        <div class="alsoResz">
            <div class="buttons" id="kezelobtns" style="display: none;">
                <button onclick="addEpsToWatched()" data-t="cl_series.mark_as_watched">Jelölés megnézettnek</button>
                <button onclick="removeEpsFromWatched()" data-t="cl_series.mark_as_not_watched">Jelölés nem megnézettnek</button>
            </div>

            <div id="backBtnContainer">
                <button id="backToSeasonSelection" data-direction="top"><i class="bi bi-arrow-up-circle"></i></button>
            </div>
        </div>
    `



    let ListedEpisodes = document.getElementsByClassName("episode")

    Array.prototype.forEach.call(ListedEpisodes, function(ep) {
        if (episodesWatched.includes(parseInt(ep.id, 10))) {
            ep.classList.add("watched")
            utoljaraMegnezettEp = ep
        }
    });






    var arrowBtn = document.getElementById("backToSeasonSelection")
    
    clickHandler = (e) => handleArrowClick(e, utoljaraMegnezettEp, arrowBtn)
    scrollHandler = (e) => handleWindowScrollForArrow(e, utoljaraMegnezettEp, arrowBtn)

    arrowBtn.removeEventListener("click", clickHandler)
    window.removeEventListener("scroll", scrollHandler)


    arrowBtn.addEventListener("click", clickHandler)
    window.addEventListener("scroll", scrollHandler)



    setUpcomingErtekelesCucc()
    startEpsObserver()
    checkImgLoaded()

    translatePage()

    container.scrollIntoView({ behavior: 'smooth' });

    setTimeout(() => {
        if (utoljaraMegnezettEp) {
            window.scrollTo({
                top: utoljaraMegnezettEp.getBoundingClientRect().top + window.pageYOffset - 100,
                behavior: "smooth",
            });
        }
    }, 500);

}



function showOverview(parent) {

    setTimeout(() => {
        for (let i = 0; i < selectedEpisodes.length; i++) {
            const element = selectedEpisodes[i];
        
            //console.log(element, parent.id)
            if (element == parent.id) {
                selectedEpisodes.splice(i, 1)
                parent.classList.remove("selected")
                break
            }
        
        }


        let overview = parent.getElementsByClassName("overview")[0]

        if (overview.style.display == " " || overview.style.display == "" || overview.style.display == "none") {
            overview.style.display = "block"
        } else {
            overview.style.display = "none"
        }
        
    }, 100);

}





function selectEpisode(melyik) {
    //console.log(selectedEpisodes, melyik.id)
    let found = false

    for (let i = 0; i < selectedEpisodes.length; i++) {
        const element = selectedEpisodes[i];

        if (element == melyik.id) {
            found = true
            selectedEpisodes.splice(i, 1)
            break
        }
        
    }

    if (found) {
        melyik.classList.remove("selected")

        document.getElementById(`Table${melyik.id}`).style.border = "0px"
    } else {
        melyik.classList.add("selected")
        selectedEpisodes.push(melyik.id)

        document.getElementById(`Table${melyik.id}`).style.border = "3px solid var(--red-theme)"
    }


    let kezeloButtons = document.getElementById("kezelobtns") 

    if (selectedEpisodes.length > 0) {
        kezeloButtons.style.display = "flex"
    } else {
        kezeloButtons.style.display = "none"
    }


    setTimeout(() => { //mert az áttekintés miatt buglik
        if (selectedEpisodes.length > 0) {
            kezeloButtons.style.display = "flex"
        } else {
            kezeloButtons.style.display = "none"
        }
    }, 200);
}



//adás/vevés

async function addEpsToWatched() {
    let loadingparent = document.getElementById("loadingparent")
    loadingparent.style.display = "flex"


    for (let i = 0; i < selectedEpisodes.length; i++) {
        var isAdded = false
        const ep = selectedEpisodes[i];


        for (let jsoni = 0; jsoni < allEpisodes_jsonok.length; jsoni++) {
            const json = allEpisodes_jsonok[jsoni];
            
            if (json.id == ep) {
                var epDate = new Date(json.air_date)
                var currDate = new Date()
                //console.log(json)
                //console.log(currDate, epDate, currDate >= epDate, json.runtime, currDate >= epDate && json.runtime > 0)

                if (currDate >= epDate) {
                    try {
                        var details = {
                            user_id: JSON.parse(localStorage.user).user_id,
                            media_id: id,
                            media_type: "tv",
                            ep_id: ep,
                        }
                    
                        const response = await fetch(`${location.origin}/addWatched`, {
                            method: "POST",
                            headers: { 'Content-Type': 'application/json', "Authorization": localStorage.token },
                            body: JSON.stringify(details)
                        })
                    
                        const result = await response.json()
                    
                        //notify(result.message, result.type)
                        isAdded = true


                        if(result.type == "success") {
                            console.log("Siker")
                        }
                    } catch(e) {
                        console.log("Error:", e)
                    }
                } else {
                    isAdded = true //legyen true, hogy ne menjen tovább és gondolja, hogy special ep
                    notify(t("notifs.Még nem jelent(ek) meg az epizód(ok)"), "error")
                }
            }
        }



        if (!isAdded) {
            //Valószínűleg a Special Seasonből való rész lett bejelölve

            if (epDate) {
                if (currDate >= epDate) {
                    try {
                        var details = {
                            user_id: JSON.parse(localStorage.user).user_id,
                            media_id: id,
                            media_type: "tv",
                            ep_id: ep,
                        }
                    
                        const response = await fetch(`${location.origin}/addWatched`, {
                            method: "POST",
                            headers: { 'Content-Type': 'application/json', "Authorization": localStorage.token },
                            body: JSON.stringify(details)
                        })
                    
                        const result = await response.json()
                    
                        //notify(result.message, result.type)
                        isAdded = true
                    
                    
                        if(result.type == "success") {
                            console.log("Siker")
                        }
                    } catch(e) {
                        console.log("Error:", e)
                    }
                } else {
                    notify(t("notifs.Még nem jelent(ek) meg az epizód(ok)"), "error")
                }
            } else {
                //null az epdate, valamiért tuti lesz ilyen sajna, még rész kihagyások is vannak ebbe a kurva api-ba, a 10. után jön a 13. rész :)))

                try {
                    var details = {
                        user_id: JSON.parse(localStorage.user).user_id,
                        media_id: id,
                        media_type: "tv",
                        ep_id: ep,
                    }
                
                    const response = await fetch(`${location.origin}/addWatched`, {
                        method: "POST",
                        headers: { 'Content-Type': 'application/json', "Authorization": localStorage.token },
                        body: JSON.stringify(details)
                    })
                
                    const result = await response.json()
                
                    //notify(result.message, result.type)
                    isAdded = true
                
                
                    if(result.type == "success") {
                        console.log("Siker")
                    }
                } catch(e) {
                    console.log("Error:", e)
                }
            }
        }


    }

    //it meg reload max egy kis timeouttal, nem is kell a loadingot eltűntetni akkor
    setTimeout(() => {
        window.location.reload()
    }, 1000);
}



async function removeEpsFromWatched() {
    let loadingparent = document.getElementById("loadingparent")
    loadingparent.style.display = "flex"


    for (let i = 0; i < selectedEpisodes.length; i++) {
        const ep = selectedEpisodes[i];
        
        try {
            var details = {
                user_id: JSON.parse(localStorage.user).user_id,
                media_id: id,
                media_type: "tv",
                ep_id: ep,
            }
        
            const response = await fetch(`${location.origin}/removeWatched`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json', "Authorization": localStorage.token },
                body: JSON.stringify(details)
            })
        
            const result = await response.json()
        
            //notify(result.message, result.type)
        
            if(result.type == "success") {
                console.log("Siker")
            }
        } catch(e) {
            console.log("Error:", e)
        }
    
    }
    
    //it meg reload max egy kis timeouttal, nem is kell a loadingot eltűntetni akkor
    setTimeout(() => {
        window.location.reload()
    }, 1000);
}



async function fillInLastWatched(ep_id) {
    var missed = false
    var marLetezik = false

    for (let i = 0; i < seasonokSzama; i++) {
        try {
            const getData_seasons = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${i}?api_key=${API_KEY}&language=${language}`)
            const season = await getData_seasons.json()
            
            for (let s = 0; s < season.episodes.length; s++) {
                if (season.episodes[s].id == ep_id) {

                    var generalcucc = document.getElementById("general")
                    generalcucc.innerHTML += `
                        <hr>
                        <p id="last_seen"><span data-t="cl_series.last_watched_episode">Utoljára látott epizód:</span> ${season.episodes[s].season_number}. ${t("cl_series.season")} ${season.episodes[s].episode_number}. ${t("cl_series.episode")}</p>
                    `
                    marLetezik = true
                }
            }
        } catch(e) {
            missed = true
        }
    }


    if (missed && !marLetezik) {
        for (let i = 1; i < seasonokSzama+1; i++) {
            try {
                const getData_seasons = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${i}?api_key=${API_KEY}&language=${language}`)
                const season = await getData_seasons.json()
                
                for (let s = 0; s < season.episodes.length; s++) {
                    if (season.episodes[s].id == ep_id) {
    
                        var generalcucc = document.getElementById("general")
                        generalcucc.innerHTML += `
                            <hr>
                            <p id="last_seen"><span data-t="cl_series.last_watched_episode">Utoljára látott epizód:</span> ${season.episodes[s].season_number}. ${t("cl_series.season")}  ${season.episodes[s].episode_number}. ${t("cl_series.episode")}</p>
                        `
                    }
                }
            } catch(e) {
                missed = true
            }
        }
    }


    translatePage()
} 



function showTable() {
    const table = document.getElementById("tablazat")
    const szinek = document.getElementById("szinek")

    if (table.style.display == "none" || table.style.display == "") {
        table.style.display = "flex"
        szinek.style.display = "flex"
    } else {
        table.style.display = "none"
        szinek.style.display = "none"
    }
}



function setErtekelesColors() {
    document.querySelectorAll("td").forEach(td => {
        if (td.style.backgroundColor == "var(--rating-awesome)" || td.style.backgroundColor == "var(--rating-bad)" || td.style.backgroundColor == "var(--rating-garbage)") {
            td.style.color = "white"
        }

        if (td.style.backgroundColor == "var(--rating-upcoming)") {
            td.innerHTML = "?"
        }
    })
}


function startDragFigyeles() {
    const table = document.getElementById("tablazat")
    var isDown = false
    var startX
    var scrollLeft


    table.addEventListener("mousedown", (e) => {
        isDown = true
        startX = e.pageX - table.offsetLeft;
        scrollLeft = table.scrollLeft;
    })

    table.addEventListener("mouseleave", (e) => {
        isDown = false
    })
    table.addEventListener("mouseup", (e) => {
        isDown = false
    })

    table.addEventListener('mousemove', (e) => {
        if(!isDown) return;
        e.preventDefault();
        const x = e.pageX - table.offsetLeft;
        const walk = (x - startX) * 1; //scroll-speed
        table.scrollLeft = scrollLeft - walk;
        //console.log(walk);
    });
}



var progressbarokadva = false

async function checkWatchedMinutes() {
    const getData = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=${language}`)

    const adatok = await getData.json()
    if (adatok) {
    
        if (adatok.seasons[0].season_number == 1) {
            for (let seasoni = 1; seasoni < adatok.seasons.length + 1; seasoni++) {
                
                const getData_seasons = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${seasoni}?api_key=${API_KEY}&language=${language}`)
                const season = await getData_seasons.json()
                
                for (let eps = 0; eps < season.episodes.length; eps++) {
                    if (episodesWatched.includes(season.episodes[eps].id)) {
                    
                        watchedMinutes += season.episodes[eps].runtime
                    }
                }
            }
        } else {
            for (let seasoni = 1; seasoni < adatok.seasons.length; seasoni++) {
                
                const getData_seasons = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${seasoni}?api_key=${API_KEY}&language=${language}`)
                const season = await getData_seasons.json()
                
                for (let eps = 0; eps < season.episodes.length; eps++) {
                    if (episodesWatched.includes(season.episodes[eps].id)) {
                    
                        watchedMinutes += season.episodes[eps].runtime
                    }
                }
            }
        }
        
    }


    progressBars(watchedMinutes, sumMinutes, t("cl_series.spent_hours"))

    progressbarokadva = true
    
    setTimeout(() => {
        startBarObserver()
    }, 1000);
}


async function progressBars(current, max, title) {
    const progressionBox = document.getElementById("progressionbox")

    if (title == t("cl_series.spent_hours")) {
        var currtime_h = toHoursAndMinutes(current).hours
        var currtime_m = toHoursAndMinutes(current).minutes

        if (currtime_h != 0) {
            if (currtime_m != 0) {
                var currtext = `${currtime_h} ${t("basic.hours")} ${currtime_m} ${t("basic.minutes")}`
            } else {
                var currtext = `${currtime_h} ${t("basic.hours")}`
            }
        } else {
            if (currtime_m != 0) {
                var currtext = `${currtime_m} ${t("basic.minutes")}`
            } else {
                var currtext = "0"
            }
        }
        

        var maxtime_h = toHoursAndMinutes(max).hours
        var maxtime_m = toHoursAndMinutes(max).minutes

        if (maxtime_h != 0) {
            if (maxtime_m != 0) {
                var maxtext = `${maxtime_h} ${t("basic.hours")} ${maxtime_m} ${t("basic.minutes")}`
            } else {
                var maxtext = `${maxtime_h} ${t("basic.hours")}`
            }
        } else {
            if (maxtime_m != 0) {
                var maxtext = `${maxtime_m} ${t("basic.minutes")}`
            } else {
                var maxtext = "0"
            }
        }


        progressionBox.innerHTML += `
            <div class="progression">
                <div class="progress" data-max="${max}" data-value="${current}">
                    <div class="circle">
                        <svg viewBox="0 0 100 50" class="arc" preserveAspectRatio="xMidYMid meet">
                            <path class="bg" d="M 10 50 A 40 40 0 0 1 90 50" />
                            <path class="fg" d="M 10 50 A 40 40 0 0 1 90 50" />
                        </svg>
                    </div>
                </div>

                <div class="label">
                    <p class="progression_current">${currtext}</p>
                    <p class="progression_label">${title}</p>
                    <p class="progression_max">${maxtext}</p>
                </div>
            </div>
        `
    } else {
        progressionBox.innerHTML += `
            <div class="progression">
                <div class="progress" data-max="${max}" data-value="${current}">
                    <div class="circle">
                        <svg viewBox="0 0 100 50" class="arc" preserveAspectRatio="xMidYMid meet">
                            <path class="bg" d="M 10 50 A 40 40 0 0 1 90 50" />
                            <path class="fg" d="M 10 50 A 40 40 0 0 1 90 50" />
                        </svg>
                    </div>
                </div>

                <div class="label">
                    <p class="progression_current">${current}</p>
                    <p class="progression_label">${title}</p>
                    <p class="progression_max">${max}</p>
                </div>
            </div>
        `
    }


    translatePage()
    
}



function startBarObserver() {

    const bar_observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
           if (entry.isIntersecting) {

                setTimeout(() => {
                    const progress = entry.target;
                
                    const circle = progress.querySelector(".fg");
                    const max = parseInt(progress.dataset.max);
                    const current = parseInt(progress.dataset.value);


                    const percentage = Math.min(current / max, 1); // clamp to 1 max
                    const fullLength = 126; // Half-circle path length
                    const offset = fullLength - (fullLength * percentage);

                    circle.style.strokeDashoffset = offset;

                    if (percentage == 1) {
                        circle.style.animation = "coloring 3s infinite ease-in-out"

                    } else if (percentage <= 0.25) {
                        //console.log(percentage)
                        circle.style.stroke = "rgb(169, 19, 19)"
                    } else if (percentage <= 0.5) {
                        circle.style.stroke = "rgb(202, 133, 53)"
                    } else if (percentage <= 0.75) {
                        circle.style.stroke = "rgb(217, 206, 131)"
                    } else if (percentage < 1) {
                        circle.style.stroke = "rgb(134, 224, 61)"
                    }
                }, 500);

                bar_observer.unobserve(entry.target)
            }
        });
    });


    document.querySelectorAll('.progress').forEach(progress => {
        bar_observer.observe(progress);
    });
}



function startEpsObserver() {
    const ep_observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {

                setTimeout(() => {
                    const ep = entry.target

                    ep.classList.add("showing")
                    ep_observer.unobserve(entry.target)
                }, 10);

            }
        })
    })

    document.querySelectorAll('.episode').forEach(ep => {
        ep_observer.observe(ep);
    });
}




function clickedInTable(snum, epid) {
    changeSeason("", snum, epid)
}


async function putInVideok() {
    var trailers_container = document.getElementById("trailers_container")
    var videos_container = document.getElementById("videos_container")

    try {
        const videos_fetch = await fetch(`https://api.themoviedb.org/3/tv/${id}/videos?api_key=${API_KEY}`)
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
            videos_container.innerHTML = `<p>${t("cl_series.not_available_video")}</p>`

            videos_container.innerHTML += `
                <a href="https://www.youtube.com/results?search_query=${seriesTitle}" target="_blank" rel="noopener noreferrer" data-t="cl_series.search_for_videos">Videók keresése YouTube-on</a>
            `
        } else {

            videos_container.innerHTML += `
                <p></p>
                <a href="https://www.youtube.com/results?search_query=${seriesTitle}" target="_blank" rel="noopener noreferrer" data-t="cl_series.search_for_more_videos">További videók keresése YouTube-on</a>
            `
        }

        if (trailers_container.innerHTML == "") {
            trailers_container.innerHTML = `<p>${t("cl_series.not_available_trailer")}</p>`

            trailers_container.innerHTML += `
                <a href="https://www.youtube.com/results?search_query=${seriesTitle}+trailer" target="_blank" rel="noopener noreferrer" data-t="cl_series.search_for_trailers">Trailer keresése YouTube-on</a>
            `
        } else {
            
            trailers_container.innerHTML += `
                <p></p>
                <a href="https://www.youtube.com/results?search_query=${seriesTitle}+trailer" target="_blank" rel="noopener noreferrer" data-t="cl_series.search_for_more_trailers">További trailerek keresése YouTube-on</a>
            `
        }
    } catch(e) {
        console.error(e)
    }


    translatePage()

}




var isSpecial = false


async function SpecialSeriesThings() { //ide kell majd a kuki check a legelejére, hogy ne menjen tovább mer fölösleges lenne akkor ha ki van kapcsolva

if (getSpecialCookie() == null) {setSpecialCookie("be")}

if (getSpecialCookie() == "be") {
    var sseries

    try {
        const response = await fetch('/client/specialseries.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const file = await response.json();
        sseries = file.sorozatok;


    } catch(e) {
        console.error(e)
    }


    //Dolgozhatunk is vele végre
    
    for(let i in sseries) {
        if (sseries[i].id == id) {
            isSpecial = true


            if (sseries[i].font) {
                if (sseries[i].font != "" || sseries[i].font != " ") {
                    var navtartalom = document.getElementById("navtartalom")
                    
                    navtartalom.innerHTML += `
                        <span class="navbar-text cant_select" id="nav_font"> | ${t("cl_series.normal_font")} |</span>
                    `

                    document.getElementById("nav_font").addEventListener("click", nav_fontButton)
                    document.getElementById("nav_font").style.color = "white"

                    var fontSzoveg = `
                        @font-face {
                          font-family: specialSeriesFont;
                          src: url(/fonts/${sseries[i].font});
                        }

                        .specialFontosElem {
                            ${sseries[i].font_settings ? sseries[i].font_settings : ""}
                        }
                    `

                    var styleSheet = document.createElement("style")
                    styleSheet.textContent = fontSzoveg
                    document.head.appendChild(styleSheet)

                    document.body.style.fontFamily = "specialSeriesFont, sans-serif"
                    document.body.classList.add("specialFontosElem")

                }
            }


            if (sseries[i].mode == "music") {

                if (sseries[i].settings && sseries[i].settings["ALL"]) {
                    var fileformat = sseries[i].settings["ALL"][0].split(".")[sseries[i].settings["ALL"][0].split(".").length - 1]
                    var hang = document.createElement("AUDIO");

                    if (hang.canPlayType(`audio/${fileformat}`) !== "") {

                        hang.setAttribute("src",`/audio/${sseries[i].title}/${sseries[i].settings["ALL"][0]}`);
                        hang.setAttribute("id", "audio_ALL")
                        
                        if (sseries[i].settings["loop"]) {
                            hang.setAttribute("loop", "");
                        }

                        hang.volume = sseries[i].settings["ALL"][1]
                        hang.style.display = "none"

                        document.body.appendChild(hang);
                    }


                } else if(!sseries[i].settings["ALL"]) {
                    for(let s in sseries[i].settings) {
                        if(s / s == 1 || s == 0) { //csak hogy szám legyen, a loop és hasonlók nem kellenek, csak majd később
                            var fileformat = sseries[i].settings[s][0].split(".")[sseries[i].settings[s][0].split(".").length - 1]
                            var hang = document.createElement("AUDIO");

                            if (hang.canPlayType(`audio/${fileformat}`) !== "") {
                                hang.setAttribute("src",`/audio/${sseries[i].title}/${sseries[i].settings[s][0]}`);
                                hang.setAttribute("id", `audio_S${s}`)

                                if (sseries[i].settings["loop"]) {
                                    hang.setAttribute("loop", "");
                                }
                            
                                hang.volume = sseries[i].settings[s][1]
                                hang.style.display = "none"
                            
                                document.body.appendChild(hang);
                            }

                        }
                    }
                }


            }


        }
    }


    translatePage()
}
}




var audioPlayed = false
var navtartalom = document.getElementById("navtartalom")
var tartalomadva = false
var utcsozene

function SpecialThingsAudioManage(season) {
if (isSpecial){


    if (!tartalomadva) {
        navtartalom.innerHTML += `
            <span class="navbar-text cant_select" data-state="turn_off" id="nav_music"> | ${t("cl_series.stop_music")} | </span>
        `
        tartalomadva = true


        if (document.getElementById("nav_music")) {document.getElementById("nav_music").addEventListener("click", nav_musicbutton)}
        if (document.getElementById("nav_font")) {document.getElementById("nav_font").addEventListener("click", nav_fontButton)} //valamiért megint meg kell adni az eventlistenert mert elbaszodik ha nem adom meg neki, fogalmam sincs miért
    } else {

        if (document.getElementById("nav_music")) {document.getElementById("nav_music").removeEventListener("click", nav_musicbutton)}
        if (document.getElementById("nav_font")) {document.getElementById("nav_font").removeEventListener("click", nav_fontButton)}

        //---

        if (document.getElementById("nav_music")) {document.getElementById("nav_music").addEventListener("click", nav_musicbutton)}
        if (document.getElementById("nav_font")) {document.getElementById("nav_font").addEventListener("click", nav_fontButton)} //valamiért megint meg kell adni az eventlistenert mert elbaszodik ha nem adom meg neki, fogalmam sincs miért
    }




    if (!audioPlayed) {
        let nav_music = document.getElementById("nav_music")

        if (nav_music.dataset.state == "turn_off") { //mert akkor a gomb stoppolni fogja amit megnyomja tehát mehet a zene most
            if(document.querySelector("#audio_ALL")) {
                document.querySelector("#audio_ALL").play()
                audioPlayed = true
            } else if(document.querySelector(`#audio_S${season}`)) {
                document.querySelector(`#audio_S${season}`).play()
                audioPlayed = true
            }

        } else {//alapból a gomb el fogja inditani, szóval most nem kell indítani
            //itt a hiba
            if(document.querySelector("#audio_ALL")) {
                utcsozene = document.querySelector("#audio_ALL")
                audioPlayed = false

            } else if(document.querySelector(`#audio_S${season}`)) {
                utcsozene = document.querySelector(`#audio_S${season}`)
                audioPlayed = false
                
            }
        }

    } else {//ha már megy egy zene és évadot váltunk
        var auds = document.querySelectorAll("audio")

        auds.forEach(aud => {
            aud.pause()
            aud.load()
        })

        audioPlayed = false

        SpecialThingsAudioManage(season)
    }


    document.querySelectorAll("a").forEach(a => { // ha rámegy egy a-ra akkor állítsa meg a zenét, mert akkor a háttérben menne tovább
        a.addEventListener("click", (e) => {
            nav_musicbutton("", true)
        })
    })



    if (nav_music.dataset.state == "turn_off") {
        nav_music.innerHTML = ` | ${t("cl_series.stop_music")} | `
        nav_music.style.color = "red"
    } else if (nav_music.dataset.state == "turn_on") {
        nav_music.innerHTML = ` | ${t("cl_series.start_music")} | `
        nav_music.style.color = "green"
    }

    translatePage()
}
}




function nav_musicbutton(e, fullypause) {
if (isSpecial) {
    var nav_music = document.getElementById("nav_music")

    if (fullypause) {
        var auds = document.querySelectorAll("audio")

        auds.forEach(aud => {
            if (!aud.paused && !aud.ended && aud.readyState > 2) {
                aud.pause()
                aud.load()
                utcsozene = aud
            }
        })
        
        audioPlayed = false
        nav_music.dataset.state = "turn_on"
    } else {
        if(nav_music.dataset.state == "turn_off") {
            var auds = document.querySelectorAll("audio")
                
            auds.forEach(aud => {
                if (!aud.paused && !aud.ended && aud.readyState > 2) {
                    aud.pause()
                    aud.load()
                    utcsozene = aud
                }
            })
        
            audioPlayed = false
            nav_music.dataset.state = "turn_on"
        } else {
            utcsozene.play()
            audioPlayed = true
            nav_music.dataset.state = "turn_off"
        }
    }



    if (nav_music.dataset.state == "turn_off") {
        nav_music.innerHTML = ` | ${t("cl_series.stop_music")} | `
        nav_music.style.color = "red"
    } else if (nav_music.dataset.state == "turn_on") {
        nav_music.innerHTML = ` | ${t("cl_series.start_music")} | `
        nav_music.style.color = "green"
    }

    translatePage()
}
}





function nav_fontButton(e) {
if (isSpecial) {
    var nav_font = document.getElementById("nav_font")
    var currFont = document.body.style.fontFamily.split(",")[0]

    if (currFont == "specialSeriesFont") {
        nav_font.innerHTML = ` | ${t("cl_series.special_font")} | `
        nav_font.style.color = "orange"
        document.body.style.fontFamily = "var(--font-main)"
        document.body.classList.remove("specialFontosElem")
    } else {
        nav_font.innerHTML = ` | ${t("cl_series.normal_font")} | `
        nav_font.style.color = "white"
        document.body.style.fontFamily = "specialSeriesFont, sans-serif"
        document.body.classList.add("specialFontosElem")
    }


    translatePage()
}
}




//Server Link cucc

async function manageServerLink() {
    const serverLink = document.getElementById("serverLink")
    var serverLinkURL = undefined


    var amiMegy = {
        tipus: "tv"
    }

    try {
        const response = await fetch(`${location.origin}/getServerLinks`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json', "Authorization": localStorage.token },
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
        serverLink.innerHTML = `<span class='bold'>${t("cl_series.watch_here")}</span>`
        serverLink.href = `${window.origin}/watch/tv/${id}`
    }


    translatePage()
}





function showExtraInfo(btnElem) {
    const extraInfoBox = document.getElementById("extraInfoBox")

    if (extraInfoBox.style.height == "0px" || extraInfoBox.style.height == "") {

        btnElem.innerHTML = "- - -"
        extraInfoBox.style.height = "100%"
    } else {
        btnElem.innerHTML = "..."
        extraInfoBox.style.height = "0"

    }
}




var Persons = []


async function getPersons() {
    const getData = await fetch(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=${API_KEY}`)

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
            togglePersons.innerText = t("cl_series.show_credits")

            stabLista.classList.remove("showing")

        } else if (togglePersons.dataset.allapot == "closed") {
            togglePersons.dataset.allapot = "opened"
            togglePersons.innerText = t("cl_series.hide_credits")

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
                    <h4 data-t="cl_series.no_available_data">Sajnos nincs elérhető adat</h4>
                    <h5><a href="https://www.google.com/search?q=${seriesTitle}+szereposztás" target="_blank" rel="noopener noreferrer" data-t="cl_series.search_for_credits">Stáb keresése</a></h5>
                </div>
            `
        } else {
            szereplok.innerHTML += `
                <div class="creditsTag cast">
                    <h4><a href="https://www.google.com/search?q=${seriesTitle}+szereposztás" target="_blank" rel="noopener noreferrer" data-t="cl_series.search_for_more_credits">További stáb keresése</a></h4>
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



            if (getProperTranslation(ember.known_for_department) == "Író") {
                if (document.getElementById("iro").innerHTML == "") {
                    document.getElementById("iro").innerHTML += `
                        <span class="bold" data-t="basic.Writing">Író: </span> ${ember.name}
                    `
                } else {
                    document.getElementById("iro").innerHTML += `, ${ember.name}`
                }
            }
            

            if (ember.job == "Series Director") {
                if (document.getElementById("rendezo").innerHTML == "") {
                    document.getElementById("rendezo").innerHTML += `
                        <span class="bold" data-t="basic.Directing">Rendező: </span> ${ember.name}
                    `
                } else {
                    document.getElementById("rendezo").innerHTML += `, ${ember.name}`
                }
            }


            if (ember.job == "Editor") {
                if (document.getElementById("vago").innerHTML == "") {
                    document.getElementById("vago").innerHTML += `
                        <span class="bold" data-t="basic.Editing">Vágó: </span> ${ember.name}
                    `
                } else {
                    document.getElementById("vago").innerHTML += `, ${ember.name}`
                }
            }

        }


        if (Persons.crew.length == 0) {
            keszitok.innerHTML += `
                <div class="creditsTag crew">
                    <h4 data-t="cl_series.no_available_data">Sajnos nincs elérhető adat</h4>
                    <h5><a href="https://www.google.com/search?q=${seriesTitle}+szereposztás" target="_blank" rel="noopener noreferrer" data-t="cl_series.search_for_credits">Stáb keresése</a></h5>
                </div>
            `
        } else {
            keszitok.innerHTML += `
                <div class="creditsTag crew">
                    <h4><a href="https://www.google.com/search?q=${seriesTitle}+szereposztás" target="_blank" rel="noopener noreferrer" data-t="cl_series.search_for_more_credits">További stáb keresése</a></h4>
                </div>
            `
        }
    }

    
    toggleCastToWork()
    translatePage()
}






function idetifyHosszuSzoveg() {
    const szovegamirekell = document.querySelectorAll(".hosszulehet")

    if (szovegamirekell.length > 0) {
        szovegamirekell.forEach(szoveg => {

            szoveg.addEventListener("click", (e) => {
                var allapota = szoveg.dataset.allapot || "nyitva"

                if (allapota == "zarva") {
                    //nyitni
                    szoveg.setAttribute( 'style', 'color: white !important' );
                    szoveg.style.whiteSpace = "wrap"
                    szoveg.style.animationPlayState = "paused"

                    szoveg.dataset.allapot = "nyitva"

                } else if(allapota == "nyitva") {
                    //zárni
                    szoveg.setAttribute( 'style', 'color: white' );
                    szoveg.style.whiteSpace = "nowrap"
                    szoveg.style.animationPlayState = "running"

                    szoveg.dataset.allapot = "zarva"
                }
            })


            if (szoveg.dataset.allapot) {
                if (szoveg.dataset.allapot == "zarva") {
                    //zarni
                    szoveg.setAttribute( 'style', 'color: white' );
                    szoveg.style.whiteSpace = "nowrap"
                    szoveg.style.animationPlayState = "running"
                }
            }
        })
    }
}




async function adminsIDInput() {
    if (userGroup) {
        if (userGroup != "user") {
            
            let mas_user_id = new URLSearchParams(window.location.search).get("mas_user_id")
            if (mas_user_id) {
                alert(`Te most a kovetkezo id-t nezed: ${mas_user_id}`)
                alert("Csak a wishlist vagy watched statusat tudod, sorry")

                userID = mas_user_id
            }


            document.getElementById("navtartalom").innerHTML += `
                <li class="nav-item">
                    <input type="text" placeholder="ADMINONLY: ID" id="mas_user_id_input"></input>
                </li>
            `

            document.getElementById("mas_user_id_input").addEventListener("keypress", (e) => {
                if(e.key == "Enter") {
                    e.preventDefault()

                    var url = new URL(window.location)
                    url.searchParams.set("mas_user_id", document.getElementById("mas_user_id_input").value)
                    window.history.replaceState({}, "", url)

                    setTimeout(() => {
                        window.location.reload()
                    }, 200);
                }
            })

        }
    }
}
