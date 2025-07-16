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

var API_KEY = ""
var isLoggedin = false
var userGroup


window.onload = async () => {
    menu_account.style.display = "none"
    menu_login_register.style.display = "none"
    menu_logout.style.display = "none"

    sorozatok_starthere_button.href = "/auth/login"
    sorozatok_starthere_button.innerHTML = "Jelentkezz be a kezdéshez"
    filmek_starthere_button.href = "/auth/login"
    filmek_starthere_button.innerHTML = "Jelentkezz be a kezdéshez"


    const token = localStorage.getItem("token")
    isLoggedin = await checkLogin(token)

    if (isLoggedin) {
        loggedIn()
    } else {
        loggedOut()
    }
}




async function loggedIn() {
    menu_login_register.style.display = "none"
    menu_account.style.display = ""
    menu_logout.style.display = ""

    menu_account_href.href = `/u/${JSON.parse(localStorage.getItem("user")).username}`
    menu_username.innerHTML = JSON.parse(localStorage.getItem("user")).username

    sorozatok_starthere_button.href = "/sorozatok"
    sorozatok_starthere_button.innerHTML = "Kezeld őket itt"
    filmek_starthere_button.href = "/filmek"
    filmek_starthere_button.innerHTML = "Kezeld őket itt"


    document.getElementById("infoBox").style.display = "none" //Levi mondta, hogy szerinte tűnjön el


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


    getMedia()



    try {
        const response = await fetch(`${location.origin}/getUserGroup`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username: JSON.parse(localStorage.getItem("user")).username})
        })
    
        const result = await response.json()
    
        if (response.ok) {
            userGroup = result.group

            manageUserByGroup()
        }

    } catch(e) {
        console.error(e)
    }
}


async function loggedOut() {
    menu_account.style.display = "none"
    menu_logout.style.display = "none"

    menu_login_register.style.display = ""

    sorozatok_starthere_button.href = "/auth/login"
    sorozatok_starthere_button.innerHTML = "Jelentkezz be a kezdéshez"
    filmek_starthere_button.href = "/auth/login"
    filmek_starthere_button.innerHTML = "Jelentkezz be a kezdéshez"
}


menu_logout_button.onclick = async () => {
    await logout()

    window.location.reload()
}



var language = 'hu'

function manageLang() {
    if (getLanguageCookie() != null) {
        language = getLanguageCookie()
    }
}

manageLang()



function GiveHrefToAdatlapButton() {
    var adatlapB = document.getElementsByClassName("adatlap-button")

    Array.from(adatlapB).forEach(el => {
        el.href = `${window.location.origin}/sorozat/${el.id}`
    })
    
}




//--------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------TIMELINE Újra------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------------------

function daysUntil(dateString) {
    const now = new Date();
    const targetDate = new Date(dateString);

    // Zero out the time part so it's date-to-date (not hour-sensitive)
    now.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate - now;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}



function formatDate(date, nodots, extra) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = d.getFullYear();

    if (!extra) {
        if (!nodots) {
            return `${year}.${month}.${day}`
        } else {
            return `${year}-${month}-${day}`
        }
    } else if(extra == "year_and_month") {
        return `${year}-${month}`
    }

}






var now = new Date()

var nineMonths = new Date
nineMonths.setMonth(now.getMonth() + 9);

var someMonthsLater = new Date(nineMonths.getFullYear(), nineMonths.getMonth() + 1, 0)


var allSeries = []
var Series = [] //ezzel kellene dolgozni csak
var Seasons = [] //ezek amiket displayelni kellene
var Datumok = []
var MaJelenikMeg = []


async function getMedia() {
if(isLoggedin) {


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
            for(let i in result.dataVissza) {
                if (allSeries.includes(result.dataVissza[i].media_id)) {
                    
                } else {
                    allSeries.push(result.dataVissza[i].media_id)
                }
            }
        }
    } catch(e) {
        console.error(e)
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
                if (allSeries.includes(result.dataVissza[i].media_id)) {
                    
                } else {
                    allSeries.push(result.dataVissza[i].media_id)
                }
            }
        }
    } catch(e) {
        console.error(e)
    }


    //console.log(allSeries)
    
    

    for(let i in allSeries) {
        const getData = await fetch(`https://api.themoviedb.org/3/tv/${allSeries[i]}?api_key=${API_KEY}&language=${language}`)

        const adatok = await getData.json()
        if (adatok) {
            if (adatok.status != "Ended" && adatok.next_episode_to_air != null) {
                Series.push(adatok)
            }
        }
    }

    

    for(let d in Series) {
        for (let s in Series[d].seasons) {
            if (Series[d].seasons[s].season_number > 0) {

                const getData_seasons = await fetch(`https://api.themoviedb.org/3/tv/${Series[d].id}/season/${Series[d].seasons[s].season_number}?api_key=${API_KEY}&language=${language}`)
                const season = await getData_seasons.json()
                
                //datum nagyobb mint a mostani vagy egyenlő VAGY null, mert lehet még nincs megadva, akkor is kellenek az előző epek miatt a seasonok
        
                //console.log(season, new Date(season.episodes[season.episodes.length -1].air_date) >= now)
                if (season.episodes[season.episodes.length -1].air_date == null || formatDate(new Date(season.episodes[season.episodes.length -1].air_date)) >= formatDate(now)) {
                    Seasons.push(season)
                }
            }
        }
    }



    fillInData()
}
}




async function fillInData() {
    //console.log(Seasons)

    for(let s in Seasons) {
        for (let e in Seasons[s].episodes) {
            var airdate = new Date(Seasons[s].episodes[e].air_date)
            var airdate_str = Seasons[s].episodes[e].air_date



            if(formatDate(airdate) == formatDate(now)) {
                var ep = Seasons[s].episodes[e]

                if (!MaJelenikMeg[airdate_str]) {
                    MaJelenikMeg[airdate_str] = []
                }


                if (!MaJelenikMeg[airdate_str][ep.show_id]) {
                    MaJelenikMeg[airdate_str][ep.show_id] = []
                }


                MaJelenikMeg[airdate_str][ep.show_id].push(ep)

            } else if (airdate > now && airdate <= someMonthsLater) {
                var napaddig = daysUntil(Seasons[s].episodes[e].air_date)
                var ep = Seasons[s].episodes[e]


                if (!Datumok[napaddig]) {
                    Datumok[napaddig] = [];
                }

                if (!Datumok[napaddig][airdate_str]) {
                    Datumok[napaddig][airdate_str] = []
                }


                if (!Datumok[napaddig][airdate_str][ep.show_id]) {
                    Datumok[napaddig][airdate_str][ep.show_id] = []
                }


                Datumok[napaddig][airdate_str][ep.show_id].push(ep)

            }


        }
    }

    //console.log(Datumok)
    if (Datumok.length > 0) {
        DoTimelineData()
    }
}





function DoTimelineData() {
    ManageTimelineBeforeData()


    for(let day in Datumok) {
        for(let date in Datumok[day]) {
            for(let id in Datumok[day][date]) {
                var mettolmeddigtxt
                var sname
                var poster

                if (Datumok[day][date][id].length > 1) {
                    mettolmeddigtxt = `S${Datumok[day][date][id][0].season_number} | E${Datumok[day][date][id][0].episode_number} - E${Datumok[day][date][id][Datumok[day][date][id].length - 1].episode_number}`
                } else {
                    mettolmeddigtxt = `S${Datumok[day][date][id][0].season_number} E${Datumok[day][date][id][0].episode_number}`
                }


                for (let series in Series) {
                    if (Series[series].id == Datumok[day][date][id][0].show_id) {
                        sname = Series[series].name
                        poster = "https://image.tmdb.org/t/p/original" + Series[series].poster_path
                    }
                }

                
                addTimelineItem(date, poster, sname, mettolmeddigtxt, id, day)
            }
        }
    }



    for(let date in MaJelenikMeg) {
        for(let id in MaJelenikMeg[date]) {
            var mettolmeddigtxt
            var sname
            var poster

            if (MaJelenikMeg[date][id].length > 1) {
                mettolmeddigtxt = `S${MaJelenikMeg[date][id][0].season_number} | E${MaJelenikMeg[date][id][0].episode_number} - E${MaJelenikMeg[date][id][Datumok[day][date][id].length - 1].episode_number}`
            } else {
                mettolmeddigtxt = `S${MaJelenikMeg[date][id][0].season_number} E${MaJelenikMeg[date][id][0].episode_number}`
            }



            for (let series in Series) {
                if (Series[series].id == MaJelenikMeg[date][id][0].show_id) {
                    sname = Series[series].name
                    poster = "https://image.tmdb.org/t/p/original" + Series[series].poster_path
                }
            }

                
            addNowAiring(poster, sname, mettolmeddigtxt, id)
        }
    }



    ManageTimelineAfterData()
}





const idovonal = document.getElementById("idovonal");

function addTimelineItem(date, poster, sname, mettolmeddigtxt, id, daysFromToday) {
    const pxPerDay = 120;

    if (new Date(date).getMonth() == now.getMonth()) {
        var leftPx = daysFromToday * pxPerDay;
    } else {
        var leftPx = date.split("-")[date.split("-").length - 1] * pxPerDay;
    }
    


    if (document.getElementById(`timeline-items_${daysFromToday}`)) { //már van

        document.getElementById(`timeline-items_${daysFromToday}`).innerHTML += `
            <div class="timeline-item">
                <h5>${date}</h5>
                <img src="${poster}">
                <h4>${sname}</h4>
                <p>${mettolmeddigtxt}</p>
                <a class="adatlap-button" id="${id}" href="">Adatlap</a>
                <div></div>
            </div>
        `

        if (!document.querySelector(`#timeline-items_${daysFromToday} .tobbdolog`)) {
            var tobbdologSzoveg = document.createElement("p")
            tobbdologSzoveg.classList = "tobbdolog"
            tobbdologSzoveg.innerHTML = "Több megjelenés!"

            document.getElementById(`timeline-items_${daysFromToday}`).insertBefore(tobbdologSzoveg, document.getElementById(`timeline-items_${daysFromToday}`).firstChild)
        }

    } else { //még nincs az nap, első cucc

        var item = document.createElement("div") //és ez ugye nem a card hanem a card containerje
        item.id = `timeline-items_${daysFromToday}`
        item.className = "timeline-items"
        item.style.left = `${leftPx}px`

        item.innerHTML += `
            <div class="timeline-item">
                <h5>${date}</h5>
                <img src="${poster}">
                <h4>${sname}</h4>
                <p>${mettolmeddigtxt}</p>
                <a class="adatlap-button" id="${id}" href="">Adatlap</a>
                <div></div>
            </div>
        `

    }


    if (document.querySelector(`#idovonal_${formatDate(date, true, "year_and_month")}`)) {
        if (item) {
            document.querySelector(`#idovonal_${formatDate(date, true, "year_and_month")}`).appendChild(item);
        }   
    } else {
        var realDate = new Date(date)

        document.querySelector(".idovonalak").innerHTML += `
            <div class="idovonal" style="display: none" id="idovonal_${formatDate(date, true, "year_and_month")}">
                <div class="timeline-start" id="timelineStartDate">${formatDate(new Date(realDate.getFullYear(), realDate.getMonth(), 1))}</div>
                <div class="timeline-end" id="timelineEndDate">${formatDate(new Date(realDate.getFullYear(), realDate.getMonth() + 1, 0))}</div>
            </div>
        `

        if (item) {
            document.querySelector(`#idovonal_${formatDate(date, true, "year_and_month")}`).appendChild(item);
        }
    }
}






function addNowAiring(poster, sname, mettolmeddigtxt, id) {
    document.getElementById("idovonal_MA").innerHTML += `
        <div class="NowAiring">
            <img src="${poster}">
            <h4>${sname}</h4>
            <p>${mettolmeddigtxt}</p>
            <a class="adatlap-button" id="${id}" href="">Adatlap</a>
            <div></div>
        </div>
    `
}







function ManageTimelineBeforeData() {
    document.getElementById("timeline-kulso").style.display = ""

    //console.log(MaJelenikMeg)
    for(let i in MaJelenikMeg) {document.getElementById("majelenikmeg").style.display = ""} //valamiért csak így lehet sajna, de az a lényeg ha van benne valami akkor megjeleníti a divet


    var evek = document.getElementById("evek")

    if (now.getMonth() > 3) {
        evek.innerHTML = `<span>${now.getFullYear()} / ${now.getFullYear() + 1}</span>`
    } else {
        evek.innerHTML = `<span>${now.getFullYear()}</span>`
    }


    //többi
    const honapok = document.getElementById("honapok")
    honapok.innerHTML = ""

    const currYear = now.getFullYear()
    const currMonth = now.getMonth()
    const currMonthText = now.toLocaleDateString('hu-HU', { month: 'short' })
    const monthsToShow = 9 //+ugye a mostani

    for (let i = 0; i <= monthsToShow; i++) {
        const newDate = new Date(currYear, currMonth + i).toLocaleDateString('hu-HU', { month: 'short' })

        honapok.innerHTML += `
            <li class="honap" id="honap_${formatDate(new Date(currYear, currMonth + i), true, "year_and_month")}"><span>${newDate}</span></li>
        `
    }

}



function ManageTimelineAfterData() {
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
                
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const remainingRatio = (daysInMonth - day + 1) / daysInMonth;
    const monthWidth = 3720; //120px per nap
    const remainingPx = remainingRatio * monthWidth;
    
    document.getElementById(`idovonal_${formatDate(new Date(year, month), true, "year_and_month")}`).style.minWidth = remainingPx + "px"
    document.querySelector(`#idovonal_${formatDate(new Date(year, month), true, "year_and_month")} .timeline-end`).style.left = remainingPx + 5 + "px"
    document.querySelector(`#idovonal_${formatDate(new Date(year, month), true, "year_and_month")} .timeline-start`).innerHTML = formatDate(new Date(now.getFullYear(), now.getMonth(), now.getDate()))


    GiveHrefToAdatlapButton()

    GiveClickFunctionToMonths()

    switchMonth(formatDate(now, true, "year_and_month"), true)
}



function GiveClickFunctionToMonths() {
    document.querySelectorAll(".honap").forEach(ho => {
        ho.addEventListener("click", (e) => {
            switchMonth(ho.id.split("_")[1])
        })
    })
}


function switchMonth(date, dontscroll) {
    document.querySelector(".idovonalak").style.display = "none"
    document.querySelectorAll(".idovonal").forEach(vonal => {vonal.style.display = "none"})

    if (!document.querySelector(`#honap_${date}`).classList.contains("selected")) {
        if (document.querySelector(`#idovonal_${date}`)) {
                document.querySelector(".idovonalak").style.display = ""
                document.querySelector(`#idovonal_${date}`).style.display = ""

                document.querySelectorAll(`.honap`).forEach(ho => ho.classList.remove("selected"))
                document.querySelector(`#honap_${date}`).classList.add("selected")

                
                if (!dontscroll) {
                    document.querySelector(`#idovonal_${date} .timeline-items`).scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    }); //és ez valamiért elbassza az évek locationját :DDDD
                    document.getElementById("evek").style.bottom = "-20px"

                    setTimeout(() => {
                        window.scrollTo({
                            top: document.getElementById("evek").getBoundingClientRect().top + window.scrollY,
                            behavior: 'smooth'
                        });
                    }, 10);

                    //console.log()
                }

                


        } else {
            notify("Ebben a hónapban nem jelenik meg semmi!", "info")

            document.querySelectorAll(`.honap`).forEach(ho => ho.classList.remove("selected"))
            document.querySelector(`#honap_${date}`).classList.add("selected")
        }
    } else {
        document.querySelectorAll(`.honap`).forEach(ho => ho.classList.remove("selected"))
    }
}



//--------------------------------------------------------------------------------------------------------------------------------


function manageUserByGroup() {
    if(userGroup && userGroup != "user") {
        var ujElement = document.createElement("div")
        ujElement.classList = "kartya big cant_select"
        ujElement.innerHTML = `
            <button id="adminPanel">Admin Panel</button>
        `

        document.querySelector(".main").insertBefore(ujElement, document.querySelector(".main").firstChild)


        
        document.getElementById("adminPanel").addEventListener("click", (e) => {
            window.location.pathname = "/admin"
        })
    }
}

