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
var oneYearLater = new Date();
oneYearLater.setFullYear(now.getFullYear() + 1);

var allSeries = []
var Series = [] //ezzel kellene dolgozni csak
var Seasons = [] //ezek amiket displayelni kellene
var Datumok = []



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


    console.log(allSeries)
    
    

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
                if (season.episodes[season.episodes.length -1].air_date == null || new Date(season.episodes[season.episodes.length -1].air_date) >= now) {
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

            if (airdate >= now && airdate <= oneYearLater) {
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
    

    const item = document.createElement("div");
    item.className = "timeline-item";
    item.style.left = `${leftPx}px`;

    item.innerHTML = `
      <h5>${date}</h5>
      <img src="${poster}">
      <h4>${sname}</h4>
      <p>${mettolmeddigtxt}</p>
      <a class="adatlap-button" id="${id}" href="">Adatlap</a>
      <div></div>
    `;


    if (document.querySelector(`#idovonal_${formatDate(date, true, "year_and_month")}`)) {
        document.querySelector(`#idovonal_${formatDate(date, true, "year_and_month")}`).appendChild(item);
    } else {
        var realDate = new Date(date)

        document.querySelector(".idovonalak").innerHTML += `
            <div class="idovonal" style="display: none" id="idovonal_${formatDate(date, true, "year_and_month")}">
                <div class="timeline-start" id="timelineStartDate">${formatDate(new Date(realDate.getFullYear(), realDate.getMonth(), 1))}</div>
                <div class="timeline-end" id="timelineEndDate">${formatDate(new Date(realDate.getFullYear(), realDate.getMonth() + 1, 0))}</div>
            </div>
        `

        document.querySelector(`#idovonal_${formatDate(date, true, "year_and_month")}`).appendChild(item);
    }
}





function ManageTimelineBeforeData() {
    document.getElementById("timeline-kulso").style.display = ""


    var evek = document.getElementById("evek")
    if (now.getMonth() > 0) {
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

        if (newDate == currMonthText) {
            honapok.innerHTML += `
                <li class="honap selected" id="honap_${formatDate(new Date(currYear, currMonth + i), true, "year_and_month")}"><span>${newDate}</span></li>
            `
        } else {
            honapok.innerHTML += `
                <li class="honap" id="honap_${formatDate(new Date(currYear, currMonth + i), true, "year_and_month")}"><span>${newDate}</span></li>
            `
        }
    }

}



function ManageTimelineAfterData() {
    document.getElementById("timeline").innerHTML += `<div class="timeline-end" id="timelineEndDate"></div>`
    document.getElementById("timelineEndDate").innerHTML = formatDate(oneYearLater)
    document.getElementById("timelineStartDate").innerHTML = formatDate(now)


    const year = now.getFullYear();
    const month = now.getMonth(); // current month (0-based)
    const day = now.getDate();
    
    // Number of days in current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Calculate the remaining ratio of the current month (days left)
    const remainingRatio = (daysInMonth - day + 1) / daysInMonth;
    
    // Width per month block in px (must match CSS)
    const monthWidth = 913;
    
    // Calculate pixel width for the remaining space of current month
    const remainingPx = remainingRatio * monthWidth;
    
    const monthsToShow = 12;
    
    // Add a blank spacer div for the partial current month space
    const spacer = document.createElement('div');
    spacer.style.display = 'inline-block';
    spacer.style.width = remainingPx + 'px';
    spacer.style.height = '50px';
    timeline.appendChild(spacer);
    
    // Now add next 12 months starting from next month (month + 1)
    for (let i = 1; i <= monthsToShow; i++) {
        const date = new Date(year, month + i);
        const div = document.createElement('div');
        div.className = 'month-marker';
    
        const label = document.createElement('div');
        label.className = 'month-label';
        label.textContent = date.toLocaleDateString('hu-HU', { year: 'numeric', month: 'short' });
    
        div.appendChild(label);
        timeline.appendChild(div);
    }


    GiveHrefToAdatlapButton()

    GiveClickFunctionToMonths()

    switchMonth(formatDate(now, true, "year_and_month"))
}



function GiveClickFunctionToMonths() {
    document.querySelectorAll(".honap").forEach(ho => {
        ho.addEventListener("click", (e) => {
            switchMonth(ho.id.split("_")[1])
        })
    })
}


function switchMonth(date) {
    document.querySelector(".idovonalak").style.display = "none"
    document.querySelectorAll(".idovonal").forEach(vonal => {vonal.style.display = "none"})

    if (!document.querySelector(`#honap_${date}`).classList.contains("selected")) {
        if (document.querySelector(`#idovonal_${date}`)) {
                document.querySelector(".idovonalak").style.display = ""
                document.querySelector(`#idovonal_${date}`).style.display = ""

                document.querySelectorAll(`.honap`).forEach(ho => ho.classList.remove("selected"))
                document.querySelector(`#honap_${date}`).classList.add("selected")
        } else {
            notify("Ebben a hónapban nem jelenik meg semmi!", "info")

            document.querySelectorAll(`.honap`).forEach(ho => ho.classList.remove("selected"))
            document.querySelector(`#honap_${date}`).classList.add("selected")
        }
    } else {
        document.querySelectorAll(`.honap`).forEach(ho => ho.classList.remove("selected"))
    }
}
