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

            makeClickableDivs()

        } else {
    
            if (response.ok) {
                console.log(result)

                folders.innerHTML = ""
                files.innerHTML = ""

                for (let i in result.files) {
                    if (getExtension(result.files[i]) == "png" || getExtension(result.files[i]) == "txt" || getExtension(result.files[i]) == "mp4" || getExtension(result.files[i]) == "jpg") {
                        files.innerHTML += `
                            <div class="file" id="folder:${result.files[i]}"> <i class="bi bi-filetype-${getExtension(result.files[i])}"></i> <b>${result.files[i]}</b> </div>
                        `
                    } else {//<i class="bi bi-file-earmark-play"></i>
                        files.innerHTML += `
                            <div class="file" id="folder:${result.files[i]}"> <i class="bi bi-file-earmark-play"></i> <b>${result.files[i]}</b> </div>
                        `
                    }
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



function getExtension(path) {
    return path.split(".")[path.split(".").length - 1]
}



function makeClickableDivs() {

    document.getElementById("visszalepes").addEventListener("click", (e) => {
        let pathssplitted = window.location.pathname.split("/")

        if (pathssplitted[pathssplitted.length-1] == "") {
            let pop1 = pathssplitted.pop()
        }


        if (pathssplitted.length > 4) {
            let newpath = ""

            for(let i in pathssplitted) {
                if (i < pathssplitted.length - 1)
                newpath += pathssplitted[i] + "/"
            }

            window.location.pathname = newpath
        } else {
            window.close()
        }
    })



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
    document.getElementById("boldInfo").innerHTML = "Kérlek szépen <span class='bigger'>várj</span> egy pár percet itt vagy vissza is jöhetsz később!"


    try {
        const response = await fetch(`${location.origin}/videoKezeles`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({vidPath: PathTraveling})
        })


    
        const result = await response.json()
    


        if(result.type && result.type == "oksa") {
            if (getExtension(result.message) == "mp4") {
                createVid(result.message)
            } else if (getExtension(result.message) == "txt") {
                createText(result.message)
            } else {
                createPic(result.message)
            }

        } else if(result.type && result.type == "playlistbe") {
            if (getExtension(result.message) == "mkv" || getExtension(result.message) == "mp4" || getExtension(result.message) == "webm") {
                createPlaylistesVid(result.message)
            } else if(getExtension(result.message) == "txt") {
                createText(result.message)
            } else {
                createPic(result.message)
            }

        }else if(result.type && result.type == "vidlink") {
            createVid(result.message)

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
    document.getElementById("boldInfo").innerHTML = ""

    let titlenakSplitted = videoSRC.split(".")
    let titlenakPopped = titlenakSplitted.pop()
    let titlenak = ""

    for (let i in titlenakSplitted) {
        titlenak += "." + titlenakSplitted[i]
    }

    document.getElementById("vidTitle").innerHTML = titlenak

    document.getElementById("mediaContainer").innerHTML = `
        <video id="vid" src="/media/${videoSRC}" controls></video>
    `


    //Subtitles?
    const vid = document.getElementById("vid")

    console.log(vid.textTracks)

}



async function createPlaylistesVid(videoSRC) {
    document.getElementById("boldInfo").innerHTML = "Mivel ez egy nem támogatott videó formátumban van, ezért ha letöltöd ezt a filet (vagy az egész videót) akkor meg tudod nyitni <span class='bigger'>VLC</span> program használatával"

    let titlenakSplitted = videoSRC.split(".")
    let titlenakPopped = titlenakSplitted.pop()
    let titlenak = ""

    for (let i in titlenakSplitted) {
        titlenak += "." + titlenakSplitted[i]
    }

    document.getElementById("vidTitle").innerHTML = titlenak

    document.getElementById("mediaContainer").innerHTML = `
        <video src="/media/${videoSRC}" controls></video>
    `

    document.getElementById("downgomb").innerHTML = `
        <a href="/playlist/${window.location.origin}|${videoSRC}" download>Nyisd meg VLC-vel</a>
        <hr>
        <a href="/media/${videoSRC}" download>Teljes videó letöltése</a>

        <br><br>
    `
}



function createPic(path) {
    document.getElementById("mediaContainer").innerHTML = `
        <img id="img" src="/media/${path}"></img>
    `
}

function createText(path) {
    document.getElementById("mediaContainer").innerHTML = `
        <p>${window.location.origin}/media/${path}</p>
    `
}
