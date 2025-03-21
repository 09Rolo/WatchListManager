
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
            localStorage.setItem("user", JSON.stringify({ user_id: result.user_id, username: result.username, email: result.email }))

            checkLogin(result.token)
        } else {
            logout()
        }

        notify(result.message, result.type)
    } catch(e) {
        console.log("Error:", e)
    }
}

//checker
async function checkLogin(token) {
    if (!token) {
        return false
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
                return true
            } else {
                notify("Lejárt a munkaidő", "error")
                localStorage.removeItem("token");
                return false
            }

        } catch(e) {
            console.error(e)
            return false
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

        notify(result.message, result.type)

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

/*
logoutButton.onclick = () => {
    logout()
}
*/
