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






//Timeline
