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

    setTimeout( async () => {
        const token = localStorage.getItem("token");
        const isLoggedin = await checkLogin(token)

        if (isLoggedin) {
            window.location.pathname = "/"
        }
    }, 1000);
    
}


registerButton.onclick = async () => {
    const registerDetails = {
        email: emailRegister.value,
        username: usernameRegister.value,
        password: passwordRegister.value
    }

    await register(registerDetails)

    await login(registerDetails, "no-notify")

    setTimeout( async () => {
        const token = localStorage.getItem("token");
        const isLoggedin = await checkLogin(token)

        if (isLoggedin) {
            window.location.pathname = "/"
        }
    }, 1000);
}



window.onload = async () => {
    const token = localStorage.getItem("token");

    const isLoggedin = await checkLogin(token)

    if (isLoggedin) {
        window.location.pathname = "/"
    }

    const sectionParts = window.location.pathname.split("/")
    const section = sectionParts[2]

    if (section && section == "login") {
        SwitchToLogin()
    } else if (section && section == "register") {
        SwitchToRegister()
    } else if (section && section == "recover") {
        SwitchToRecover()
    }
}



document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".toggle-password").forEach(button => {
        button.addEventListener("click", function () {
            const targetId = this.getAttribute("data-target");
            const passwordField = document.getElementById(targetId);

            if (passwordField.type === "password") {
                passwordField.type = "text";
                this.textContent = "🙊";
            } else {
                passwordField.type = "password";
                this.textContent = "🙈";
            }
        });
    });
});



//kinézetért felelős cuccok ...
const loginSide = document.getElementById("login_side")
const registerSide = document.getElementById("register_side")

const loginSmall = document.getElementById("login_small")
const registerSmall = document.getElementById("register_small")

const loginBig = document.getElementById("login_big")
const registerBig = document.getElementById("register_big")

const switchToLogin = document.getElementById("switch_to_login")
const switchToRegister = document.getElementById("switch_to_register")
const vissza = document.getElementById("vissza")


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
    if (window.innerWidth >= 660) {
        registerSide.style.width = "35%"
        loginSide.style.width = "65%"


        loginBig.style.opacity = "0"
        loginBig.style.display = ""
        setTimeout(() => {
            loginBig.style.opacity = "1"
        }, 500);

        registerSmall.style.opacity = "0"
        registerSmall.style.display = ""
        setTimeout(() => {
            registerSmall.style.opacity = "1"
        }, 500);
        
        
        loginSmall.style.display = "none"
        registerBig.style.display = "none"

        vissza.style.top = "0"
    } else {
        //kicsi
        loginSide.style.transition = "height 1s ease-in-out"
        registerSide.style.transition = "height 1s ease-in-out"

        registerSide.style.height = "30%"
        loginSide.style.height = "75%"


        loginBig.style.opacity = "0"
        loginBig.style.display = ""
        setTimeout(() => {
            loginBig.style.opacity = "1"
        }, 500);

        registerSmall.style.opacity = "0"
        registerSmall.style.display = ""
        setTimeout(() => {
            registerSmall.style.opacity = "1"
        }, 500);
        
        
        loginSmall.style.display = "none"
        registerBig.style.display = "none"


        vissza.style.opacity = "0"

        setTimeout(() => {
            vissza.style.top = "0"
            vissza.style.bottom = ""
            vissza.style.opacity = "1"
        }, 500);
    }
}

function SwitchToRegister() {
    if (window.innerWidth >= 660) {
        registerSide.style.width = "65%"
        loginSide.style.width = "35%"

        loginSmall.style.opacity = "0"
        loginSmall.style.display = ""
        setTimeout(() => {
            loginSmall.style.opacity = "1"
        }, 500);

        registerBig.style.opacity = "0"
        registerBig.style.display = ""
        setTimeout(() => {
            registerBig.style.opacity = "1"
        }, 500);
        

        loginBig.style.display = "none"
        registerSmall.style.display = "none"

        vissza.style.top = "0"
    } else {
        //kicsi
        loginSide.style.transition = "height 1s ease-in-out"
        registerSide.style.transition = "height 1s ease-in-out"

        registerSide.style.height = "80%"
        loginSide.style.height = "15%"


        loginSmall.style.opacity = "0"
        loginSmall.style.display = ""
        setTimeout(() => {
            loginSmall.style.opacity = "1"
        }, 500);

        registerBig.style.opacity = "0"
        registerBig.style.display = ""
        setTimeout(() => {
            registerBig.style.opacity = "1"
        }, 500);
        
        
        loginBig.style.display = "none"
        registerSmall.style.display = "none"


        vissza.style.opacity = "0"

        setTimeout(() => {
            vissza.style.top = ""
            vissza.style.bottom = "0"
            vissza.style.opacity = "1"
        }, 500);
        
    }
}


vissza.onclick = () => {
    window.location.pathname = "/"
}




document.getElementById("forgetpassbtn").onclick = async () => {
    if (emailLogin.value != "") {

        try {
            const response = await fetch(`${location.origin}/recoverPass`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: emailLogin.value,
                    url: location.origin
                })
            })

            const result = await response.json()

            notify(result.message, result.type)

        } catch(e) {
            console.log("Error: ", e)
        }
    } else {
        notify("Írd be az email címedet", "info")
    }
}



var urlToken = new URLSearchParams(window.location.search).get("token")

function SwitchToRecover() {
    document.getElementById("register_login_container").style.display = "none"

    if (urlToken || urlToken != "" || urlToken != undefined) {
        document.getElementById("recoverThings").style.display = "flex"

        document.getElementById("recover_button").addEventListener("click", doTheRecovering)
    }
}


async function doTheRecovering() {
    if (document.getElementById("password_recover").value != "" && document.getElementById("email_recover").value != "") {
        try {
            const response = await fetch(`${location.origin}/doRecover`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: urlToken,
                    newpass: document.getElementById("password_recover").value,
                    email: document.getElementById("email_recover").value
                })
            })

            const result = await response.json()

            notify(result.message, result.type)

            window.location.search = ""
            window.location.pathname = "/"

        } catch(e) {
            console.log("Error: ", e)
        }
    } else {
        notify("Írd be az új jelszót és az email címedet!", "error")
    }
    
}
