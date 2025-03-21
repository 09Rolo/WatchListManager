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
