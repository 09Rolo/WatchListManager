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

const profile = document.getElementById("profile")
const filmek = document.getElementById("filmek")

var API_KEY = ""


const koszonto1 = document.getElementById("koszonto1")
const koszonto2 = document.getElementById("koszonto2")




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



//welcomer.innerHTML = `Üdvözlet ${JSON.parse(localStorage.getItem("user")).username}!`
async function loggedIn() {
    menu_login_register.style.display = "none"
    menu_account.style.display = ""
    menu_logout.style.display = ""

    menu_account_href.href = `/u/${JSON.parse(localStorage.getItem("user")).username}`
    menu_username.innerHTML = JSON.parse(localStorage.getItem("user")).username


    if(window.location.pathname.split("/")[2] == JSON.parse(localStorage.getItem("user")).username) { //saját magad vagy
        filmek.style.display = "none"
        profile.style.display = ""


        koszonto1.innerHTML = `Üdvözlet ${JSON.parse(localStorage.getItem("user")).username}!`

    } else {
        profile.style.display = "none"
        filmek.style.display = ""

        koszonto2.innerHTML = `${window.location.pathname.split("/")[2]} filmjei!`
    }



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



