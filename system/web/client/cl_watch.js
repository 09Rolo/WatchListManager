var API_KEY = ""
var isLoggedin = false


window.onload = async () => {
    const token = localStorage.getItem("token")
    isLoggedin = await checkLogin(token)

    if (isLoggedin) {
        loggedIn()
    } else {
        window.location.pathname = "/"
    }
}




async function loggedIn() {
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





async function getDIR() {
    var amiMegy = {
        path: ""
    }


    try {
        const response = await fetch(`${location.origin}/listDIR`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(amiMegy)
        })
    
        const result = await response.json()
    
        if (response.ok) {
            console.log(result)
        }
    } catch(e) {
        console.error(e)
    }
}

getDIR()
