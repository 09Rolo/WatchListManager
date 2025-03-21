//Alap DOM cuccok
const loginButton = document.getElementById("login_button")
const registerButton = document.getElementById("register_button")

const emailLogin = document.getElementById("email_l")
const passwordLogin = document.getElementById("password_l")

const emailRegister = document.getElementById("email_r")
const usernameRegister = document.getElementById("username_r")
const passwordRegister = document.getElementById("password_r")


//buttons
loginButton.onclick = async () => {
    const loginDetails = {
        email: emailLogin.value,
        password: passwordLogin.value
    }

    await login(loginDetails)


    const token = localStorage.getItem("token");
    const isLoggedin = await checkLogin(token)

    if (isLoggedin) {
        window.location.pathname = "/"
    }
}


registerButton.onclick = async () => {
    const registerDetails = {
        email: emailRegister.value,
        username: usernameRegister.value,
        password: passwordRegister.value
    }

    await register(registerDetails)

    await login(registerDetails)

    const token = localStorage.getItem("token");
    const isLoggedin = await checkLogin(token)

    if (isLoggedin) {
        window.location.pathname = "/"
    }
}



window.onload = async () => {
    const token = localStorage.getItem("token");

    const isLoggedin = await checkLogin(token)

    if (isLoggedin) {
        window.location.pathname = "/"
    }
}


//kinézetért felelős cuccok ...
const loginSide = document.getElementById("login_side")
const registerSide = document.getElementById("register_side")

const loginSmall = document.getElementById("login_small")
const registerSmall = document.getElementById("register_small")

const loginBig = document.getElementById("login_big")
const registerBig = document.getElementById("register_big")

const switchToLogin = document.getElementById("switch_to_login")
const switchToRegister = document.getElementById("switch_to_register")



loginSmall.style.display = "none"
registerBig.style.display = "none"
SwitchToLogin()



switchToLogin.onclick = () => {
    SwitchToLogin()
}

switchToRegister.onclick = () => {
    SwitchToRegister()
}

function SwitchToLogin() {
    registerSide.style.width = "35%"
    loginSide.style.width = "65%"

    loginBig.style.display = ""
    loginSmall.style.display = "none"

    registerBig.style.display = "none"
    registerSmall.style.display = ""
}

function SwitchToRegister() {
    registerSide.style.width = "65%"
    loginSide.style.width = "35%"

    loginBig.style.display = "none"
    loginSmall.style.display = ""

    registerBig.style.display = ""
    registerSmall.style.display = "none"
}


const vissza = document.getElementById("vissza")
vissza.onclick = () => {
    window.location.pathname = "/"
}
