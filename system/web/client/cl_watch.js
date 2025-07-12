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



const folders = document.getElementById("folders")
const files = document.getElementById("files")

const sectionParts = window.location.pathname.split("/")
const tipusa = sectionParts[2]
const id = sectionParts[3]
var serverPath

var PathTraveling = ""



async function getLink() {
    if (tipusa == "tv") {
        var amiMegy = {tipus: "tv"}
    } else if(tipusa == "movie") {
        var amiMegy = {tipus: "movie"}
    }


    if (amiMegy && amiMegy.tipus) {
        try {
            const response = await fetch(`${location.origin}/getServerLink`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(amiMegy)
            })
        
            const result = await response.json()
        
            if (response.ok) {
                for(let i in result.dataVissza) {
                    if (result.dataVissza[i].media_id == id) {
                        serverPath = result.dataVissza[i].link.replace(/\\/g, '/')

                        PathTraveling += serverPath

                        for (let sec in sectionParts) {
                            if (sec > 3) {
                                PathTraveling += "/" + sectionParts[sec]
                            }
                        }
                        PathTraveling = PathTraveling.replace(/([^:])\/{2,}/g, '$1/')

                        getDIR(PathTraveling)
                    }
                }
            }
        } catch(e) {
            console.error(e)
        }
    }
}

getLink()





async function getDIR(pathja) {
    var amiMegy = {
        path: pathja
    }


    try {
        const response = await fetch(`${location.origin}/listDIR`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(amiMegy)
        })
    
        const result = await response.json()

        if (result.hibaok && result.hibaok == "esetleg file") {

            //console.log("FILE")
            
            videoKezelese()

        } else {
    
            if (response.ok) {
                console.log(result)

                folders.innerHTML = ""
                files.innerHTML = ""

                for (let i in result.files) {
                    //if (result.files[i].split(".")[result.files[i].split(".").length - 1] != "mkv") {
                        files.innerHTML += `
                            <div class="file" id="folder:${result.files[i]}"> <i class="bi bi-file-earmark-play"></i> <b>${result.files[i]}</b> </div>
                        `
                    //}
                }

                for (let i in result.folders) {
                    folders.innerHTML += `
                        <div class="folder" id="file:${result.folders[i]}"> <i class="bi bi-folder-symlink-fill"></i> <b>${result.folders[i]}</b> </div>
                    `
                }


                makeClickableDivs()

            }

        }
    } catch(e) {
        console.error(e)
    }
}



function makeClickableDivs() {
    document.querySelectorAll(".folder").forEach(folder => {
        folder.addEventListener("click", (e) => {
            window.location.pathname = (window.location.pathname + "/" + folder.id.split(":")[1]).replace(/([^:])\/{2,}/g, '$1/').replace(/([^:])\/{2,}/g, '$1/')
        })
    })



    document.querySelectorAll(".file").forEach(file => {
        file.addEventListener("click", (e) => {
            window.location.pathname = (window.location.pathname + "/" + file.id.split(":")[1]).replace(/([^:])\/{2,}/g, '$1/')
        })
    })
}




async function videoKezelese() {
    document.getElementById("boldInfo").innerHTML = "Kérlek szépen várj egy pár percet itt vagy vissza is jöhetsz később!"


    try {
        const response = await fetch(`${location.origin}/videoKezeles`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({vidPath: PathTraveling})
        })


    
        const result = await response.json()
    


        if(result.type && result.type == "oksa") {
            createVid(result.message)
            document.getElementById("boldInfo").innerHTML = ""

        } else if(result.type && result.type == "vidlink") {
            createVid(result.message)
            document.getElementById("boldInfo").innerHTML = ""

        } else if(result.type && result.type == "lepjenvissza") {
            let pathssplitted = window.location.pathname.split("/")
            let pathspopped = pathssplitted.pop()
            let newpath = ""

            for(let i in pathssplitted) {
                newpath += pathssplitted[i] + "/"
            }

            window.location.pathname = newpath

        } else if (result.type) {
            notify(result.message, result.type)
        }
            
    } catch(e) {
        console.error(e)
    }

}


async function createVid(videoSRC) {
    console.log(videoSRC)
    document.getElementById("boldInfo").innerHTML = ""

    document.getElementById("videoContainer").innerHTML = `
        <video src="/media/${videoSRC}" controls></video>
    `
}
