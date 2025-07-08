var API_KEY = ""
var isLoggedin = false
var userGroup


window.onload = async () => {
    const token = localStorage.getItem("token")
    isLoggedin = await checkLogin(token)

    if (isLoggedin) {
        loggedIn()
    } else {
        window.location.pathname = "/404"
    }
}




async function loggedIn() {
    try {
        const response = await fetch(`${location.origin}/getUserGroup`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username: JSON.parse(localStorage.getItem("user")).username})
        })
    
        const result = await response.json()
    
        if (response.ok) {
            userGroup = result.group

            manageUserByGroup()

            if (userGroup && userGroup != "user") {
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
        }

    } catch(e) {
        console.error(e)
    }
}





function manageUserByGroup() {
    if(userGroup && userGroup == "user") {
        window.location.pathname = "/404"
    }
}
