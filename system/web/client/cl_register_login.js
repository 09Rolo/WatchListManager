
const loginButton = document.getElementById("login_button")
const registerButton = document.getElementById("register_button")

const emailLogin = document.getElementById("email_l")
const usernameLogin = document.getElementById("username_l")
const passwordLogin = document.getElementById("password_l")

const emailRegister = document.getElementById("email_r")
const usernameRegister = document.getElementById("username_r")
const passwordRegister = document.getElementById("password_r")

loginButton.onclick = async () => {
    try {
        const response = await fetch(`${location.origin}/login`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: emailLogin.value,
                username: usernameLogin.value,
                password: passwordLogin.value
            })
        })

        const result = await response.json()

        alert(result.message)  //nem alert nyílván hanem valami saját error box vagy valami
    } catch(e) {
        console.log("Error:", e)
    }
}


registerButton.onclick = async () => {
    try {
        const response = await fetch(`${location.origin}/register`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: usernameRegister.value,
                email: emailRegister.value,
                password: passwordRegister.value
            })
        })

        const result = await response.json()

        alert(result.message)  //nem alert nyílván hanem valami saját error box vagy valami
    } catch(e) {
        console.log("Error: ", e)
    }
}

//localstoragebe storeolni a tokent amit visszaad a szerver, és utána logoutot is csinálni, ami ennyi:
//localStorage.removeItem('token')
// vagy cookieba megcsinálni ?
