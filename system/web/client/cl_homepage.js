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


window.onload = async () => {
    menu_account.style.display = "none"
    menu_login_register.style.display = "none"
    menu_logout.style.display = "none"

    sorozatok_starthere_button.href = "/auth/login"
    sorozatok_starthere_button.innerHTML = "Jelentkezz be a kezdéshez"
    filmek_starthere_button.href = "/auth/login"
    filmek_starthere_button.innerHTML = "Jelentkezz be a kezdéshez"

    CheckHashtag()


    const token = localStorage.getItem("token")
    const isLoggedin = await checkLogin(token)

    if (isLoggedin) {
        loggedIn()
    } else {
        loggedOut()
    }
}



//welcomer.innerHTML = `Üdvözlet ${JSON.parse(localStorage.getItem("user")).username}!`
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




//reszek
const info = document.getElementById("info")
const sorozatok = document.getElementById("sorozatok")
const filmek = document.getElementById("filmek")

const info_small = document.getElementById("info_small")
const sorozatok_small = document.getElementById("sorozatok_small")
const filmek_small = document.getElementById("filmek_small")

const info_big = document.getElementById("info_big")
const sorozatok_big = document.getElementById("sorozatok_big")
const filmek_big = document.getElementById("filmek_big")

const info_small_button = document.getElementById("info_small_button")
const sorozatok_small_button = document.getElementById("sorozatok_small_button")
const filmek_small_button = document.getElementById("filmek_small_button")


sorozatok_small.style.display = "none"
filmek_small.style.display = "none"
SwitchToInfo()



info_small_button.onclick = () => {
    SwitchToInfo()
}

sorozatok_small_button.onclick = () => {
    SwitchToSorozatok()
}

filmek_small_button.onclick = () => {
    SwitchToFilmek()
}


function SwitchToInfo() {
    info.classList.add("active");
    sorozatok.classList.remove("active");
    filmek.classList.remove("active");

    info.style.height = "50vh"
    sorozatok.style.height = "100px"
    filmek.style.height = "100px"
    

    //sorozatok nagy nem, filmek nagy nem, sorozatok kicsi igen, filmek kicsi igen, infó kicsi nem, infó nagy igen
    sorozatok_big.style.display = "none"
    filmek_big.style.display = "none"
    info_small.style.display = "none"
    
    sorozatok_small.style.display = ""
    filmek_small.style.display = ""


    info_big.style.opacity = "0"
    info_big.style.display = ""
    setTimeout(() => {
        info_big.style.opacity = "1"
    }, 500);

    info.scrollIntoView()
}

function SwitchToSorozatok() {
    sorozatok.classList.add("active");
    info.classList.remove("active");
    filmek.classList.remove("active");

    info.style.height = "100px"
    sorozatok.style.height = "50vh"
    filmek.style.height = "100px"


    //sorozatok nagy igen, filmek nagy nem, sorozatok kicsi nem, filmek kicsi igen, infó kicsi igen, infó nagy nem
    filmek_big.style.display = "none"
    sorozatok_small.style.display = "none"
    info_big.style.display = "none"
    
    filmek_small.style.display = ""
    info_small.style.display = ""


    sorozatok_big.style.opacity = "0"
    sorozatok_big.style.display = ""
    setTimeout(() => {
        sorozatok_big.style.opacity = "1"
    }, 500);

    sorozatok.scrollIntoView()
}


function SwitchToFilmek() {
    filmek.classList.add("active");
    info.classList.remove("active");
    sorozatok.classList.remove("active");

    info.style.height = "100px"
    sorozatok.style.height = "100px"
    filmek.style.height = "50vh"

    
    //sorozatok nagy nem, filmek nagy igen, sorozatok kicsi igen, filmek kicsi nem, infó kicsi igen, infó nagy nem
    sorozatok_big.style.display = "none"
    filmek_small.style.display = "none"
    info_big.style.display = "none"
    
    sorozatok_small.style.display = ""
    info_small.style.display = ""


    filmek_big.style.opacity = "0"
    filmek_big.style.display = ""
    setTimeout(() => {
        filmek_big.style.opacity = "1"
    }, 500);

    filmek.scrollIntoView()
}



function CheckHashtag() {
    setTimeout(() => {
        if (window.location.href.split("#")[1]) {
            if (window.location.href.split("#")[1] == "info") {
                SwitchToInfo()
            } else if(window.location.href.split("#")[1] == "sorozatok") {
                SwitchToSorozatok()
            } else if(window.location.href.split("#")[1] == "filmek") {
                SwitchToFilmek()
            }
        }
    }, 200);
}