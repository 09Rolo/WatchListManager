
//Alap DOM cuccok
const loginButton = document.getElementById("login_button")
const registerButton = document.getElementById("register_button")
const logoutButton = document.getElementById("logout_button")

const emailLogin = document.getElementById("email_l")
const usernameLogin = document.getElementById("username_l")
const passwordLogin = document.getElementById("password_l")

const emailRegister = document.getElementById("email_r")
const usernameRegister = document.getElementById("username_r")
const passwordRegister = document.getElementById("password_r")

const welcomer = document.getElementById("welcomer")


//loadnál
window.onload = async () => {
    const token = localStorage.getItem("token");

    checkLogin(token)
}



//Bejelentkezés dolgok
async function login(details) {
    try {
        const response = await fetch(`${location.origin}/login`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(details)
        })

        const result = await response.json()

        if (response.ok) {
            localStorage.setItem("token", result.token)
            localStorage.setItem("user", JSON.stringify({ username: details.username}))

            checkLogin(result.token)
        } else {
            logout()
        }

        alert(result.message)  //nem alert nyílván hanem valami saját error box vagy valami
    } catch(e) {
        console.log("Error:", e)
    }
}

//checker
async function checkLogin(token) {
    if (!token) {
        welcomer.innerHTML = "Nem vagy bejelentkezve!"
    } else {
        try {
            const response = await fetch(`${location.origin}/homepage`, {
                method: "GET",
                headers: {
                    "Authorization": token
                }
            })

            const result = await response.json()

            if (response.ok) {
                welcomer.innerHTML = result.message
            } else {
                alert("Lejárt a munkaidő")
                localStorage.removeItem("token"); // Remove invalid token
            }

        } catch(e) {
            console.error(e)
        }
    }
}




//Regisztrációs cuccok
async function register(details) {
    try {
        const response = await fetch(`${location.origin}/register`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: details.username,
                email: details.email,
                password: details.password
            })
        })

        const result = await response.json()

        alert(result.message)  //nem alert nyílván hanem valami saját error box vagy valami

        login({
            username: details.username,
            email: details.email,
            password: details.password
        })

    } catch(e) {
        console.log("Error: ", e)
    }
}



//Logout
function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    checkLogin()
}





//Buttons
loginButton.onclick = async () => {
    const loginDetails = {
        email: emailLogin.value,
        username: usernameLogin.value,
        password: passwordLogin.value
    }

    login(loginDetails)
}


registerButton.onclick = async () => {
    const registerDetails = {
        email: emailRegister.value,
        username: usernameRegister.value,
        password: passwordRegister.value
    }

    register(registerDetails)
}


logoutButton.onclick = () => {
    logout()
}




//dev
function getStorageItems() {
    console.log(localStorage.user, localStorage.token)
}