
kurzor()


//--------------------------------------------------------Loading cuccok
document.addEventListener("DOMContentLoaded", (event) => {
    loaded()
});


function loaded() {
    let betolto = document.getElementById("betolto")

    betolto.remove()
}



let lastActive = Date.now();

document.addEventListener("visibilitychange", function() {
    if (!document.hidden) {
        const now = Date.now();
        const idleTime = now - lastActive;

        if (idleTime > 300000 && window.innerWidth > 760) { //gépen nem kell újratölteni, mert csak idegesítő lesz
            location.reload();
        }
    } else {
        lastActive = Date.now();
    }
});



function checkImgLoaded(diffTime) {
    if (!diffTime) {diffTime = 10000}

    const allImages = document.querySelectorAll("img")

    allImages.forEach(img => {
        setTimeout(() => {
            if(img.complete && img.naturalHeight !== 0) {
                //loaded
            } else {
                img.src = "/imgs/placeholder.png"
                img.src = "/imgs/placeholder.png"
            }
        }, diffTime);
    })
}



//-------------------------------------------------------------------------------Kurzor
//var mouseButtonState

function kurzor() {
    let body = document.querySelector("body")
    body.id = "body"
    body = document.getElementById("body")
    


    body.innerHTML += `
        <div class='cursor'></div>
        <div class='cursor-border'></div>
    `

    
    
    const cursor = document.querySelector(".cursor")
    const cursor_border = document.querySelector(".cursor-border")

    document.addEventListener("mousemove", (merre) => {
        handleOnMove(merre)
    
        const posX = merre.clientX
        const posY = merre.clientY
    
        
        //cursor.setAttribute("style", "top: " + merre.clientY + "px" +    "; left: " + merre.clientX + "px;")
        cursor.style.left = posX + "px"
        cursor.style.top = posY + "px"
    
        cursor_border.style.left = posX + "px"
        cursor_border.style.top = posY + "px"
    
    
        cursor_border.animate({
            left: posX + "px",
            top: posY + "px"
        }, {duration: 500, fill: "forwards"})
    })



/*
    document.addEventListener("mousedown", (merre) => {
        mouseButtonState = "Down"
    })


    document.addEventListener("mouseup", (merre) => {
        mouseButtonState = "Up"
    })
*/




    document.addEventListener("click", (args) => {
        //console.log(args)

        if (args.target.localName == "img") {
            //cursor_border.classList.add("clicked_img")


            //setTimeout(() => {
            //    cursor_border.classList.remove("clicked_img")
            //}, 1000)


            cursor_border.classList.add("clicked_cursor")

            setTimeout(() => {
                cursor_border.classList.remove("clicked_cursor")
            }, 400)

        } else {
            cursor_border.classList.add("clicked_cursor")

            setTimeout(() => {
                cursor_border.classList.remove("clicked_cursor")
            }, 400)
        }

        
    })






    setTimeout(() => {
        let buttons = document.getElementsByTagName("button")

        for(let i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener("mouseenter", () => {

                cursor.classList.remove("mouse_leave_buttons")
                cursor.classList.add("mouse_enter_buttons")
                cursor_border.style.border = "none"
                cursor_border.style.width = "0px"
                cursor_border.style.height = "0px"
            })
    
            
    
            buttons[i].addEventListener("mouseleave", () => {

                cursor.classList.add("mouse_leave_buttons")
                cursor.classList.remove("mouse_enter_buttons")
                cursor_border.style.width = "30px"
                cursor_border.style.height = "30px"
                cursor_border.style.border = "2px solid rgba(255, 255, 255, 0.5)"
            })
        }




        let ak = document.getElementsByTagName("a")

        for(let i = 0; i < ak.length; i++) {
            ak[i].addEventListener("mouseenter", () => {

                cursor.classList.remove("mouse_leave_buttons")
                cursor.classList.add("mouse_enter_buttons")
                cursor_border.style.border = "none"
                cursor_border.style.width = "0px"
                cursor_border.style.height = "0px"
            })
    
            
    
            ak[i].addEventListener("mouseleave", () => {

                cursor.classList.add("mouse_leave_buttons")
                cursor.classList.remove("mouse_enter_buttons")
                cursor_border.style.width = "30px"
                cursor_border.style.height = "30px"
                cursor_border.style.border = "2px solid rgba(255, 255, 255, 0.5)"
            })
        }

    }, 2000);


}




const handleOnMove = e => {
    const p = e.clientX / window.innerWidth * 100
}
document.ontouchmove = e => handleOnMove(e.touches[0])



//-------------------------------------------------------------------------------



//-------------------------------------------------------------------------------notify
async function notify(message, type, time) {
    const msg = message
    const tipus = type || "info"
    const ms = time || 3000

    let notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        document.body.appendChild(notificationContainer);
    }


    const notification = document.createElement('div');
    notification.classList.add("cant_select")
    notification.textContent = msg;

    if (tipus == "info") {
        notification.style.background = 'rgba(35, 120, 160, 0.8)';
        notification.style.color = 'white';
    } else if (tipus == "error") {
        notification.style.background = 'rgba(250, 30, 30, 0.8)';
        notification.style.color = 'white';
    } else if (tipus == "success") {
        notification.style.background = 'rgba(0, 205, 10, 0.8)';
        notification.style.color = 'white';
    } else {
        notification.style.background = 'rgba(35, 120, 160, 0.8)';
        notification.style.color = 'white';
    }


    notificationContainer.appendChild(notification);

    notification.style.opacity = "1"

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 500);
    }, ms);
}
//-------------------------------------------------------------------------------

//elforgatásos cucc
var previousOrientation = window.orientation;
var checkOrientation = function(){
    if(window.orientation !== previousOrientation){
        if (window.location.pathname.split("/")[1] != "watch") {

            if (document.getElementById("videok_container") && document.getElementById("videok_container").classList.contains("showing")) {} else {

                previousOrientation = window.orientation;
                window.location.reload()

            }
        }
    }
};

window.addEventListener("resize", checkOrientation, false);
window.addEventListener("orientationchange", checkOrientation, false);





//-------------------------------------------------------------------------------Iras

function iras(element, arg) {


    if (!element) {
        let alltype = document.querySelectorAll(".type")

        if (alltype) {
            alltype.forEach(specelem => {
                let elem = specelem

                var txt = elem.innerHTML
                elem.innerHTML = ""
            
                var speed = 30;
            
                for (let i = 0; i < txt.length; i++) {
                    setTimeout(() => {
                        elem.innerHTML += txt.charAt(i);  
                    }, 500 + i*speed);
                }
            });
        }
    }


    if (element) {
        var elem = document.getElementById(element)


        if (!arg) {
            var elem = document.getElementById(element)
            
            if (elem) {
                var txt = elem.innerHTML
                elem.innerHTML = ""
            
                var speed = 30;
            
                for (let i = 0; i < txt.length; i++) {
                    setTimeout(() => {
                        elem.innerHTML += txt.charAt(i);  
                    }, 1500 + i*speed);
                }
            }
        }




        if (arg == "eleje") {
            if (elem) {
                var txt = elem.innerHTML
                elem.innerHTML = ""
            
                var speed = 1000;
            
                for (let i = 0; i < txt.length; i++) {
                    setTimeout(() => {
                        elem.innerHTML += txt.charAt(i);
                    }, 1500 + i*speed);
                }
            }
        }


        if (arg == "gyorsabb") {
            if (elem) {
                var txt = elem.innerHTML
                elem.innerHTML = ""
            
                var speed = 100;
            
                for (let i = 0; i < txt.length; i++) {
                    setTimeout(() => {
                        elem.innerHTML += txt.charAt(i);
                    }, 500 + i*speed);
                }
            }
        }


        if (arg == "observeres") {
            let alltype = document.querySelectorAll(".type")
            let already = false

            if (alltype) {
                alltype.forEach(specelem => {


                    for(let i = 0; i <= specelem.classList.length; i++) {
                        if (specelem.classList[i] == "typed") {
                            already = false
                            break
                        } else {
                            already = true
                        }
                    }



                    if (already == true) {
                        elem = specelem

                        var txt = elem.innerHTML
                        elem.innerHTML = ""
                        
                        var speed = 30;
                        
                        for (let i = 0; i < txt.length; i++) {
                            setTimeout(() => {
                                elem.innerHTML += txt.charAt(i);  
                            }, 500 + i*speed * 2);
                        }



                        elem.classList.remove("type")
                        elem.classList.remove("needtype")
                        elem.classList.add("typed")
                    }
                });
            }
        }
    }
}



const obsever = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        //console.log(entry)

        if(entry.isIntersecting) {
            entry.target.classList.add("show")
        } else {
            entry.target.classList.remove("show")
        }
    })
})


const needtypeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        //console.log(entry)

        if(entry.isIntersecting) {
            entry.target.classList.add("type")

            iras(entry.target, "observeres")
        } else {
            
        }
    })
})



const hiddenElements = document.querySelectorAll(".hidden")
hiddenElements.forEach((el) => {obsever.observe(el)})

const needtypeElements = document.querySelectorAll(".needtype")
needtypeElements.forEach((el) => {needtypeObserver.observe(el)})
//-------------------------------------------------------------------------------




//----------------------------------------------------Kuki

function setLanguageCookie(language) {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 100); // Set to expire in 100 years
    document.cookie = `language=${encodeURIComponent(language)}; expires=${date.toUTCString()}; path=/`;
}


function getLanguageCookie() {
    const match = document.cookie.match(/(?:^|; )language=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
}


function setSpecialCookie(state) {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 100); // Set to expire in 100 years
    document.cookie = `special=${encodeURIComponent(state)}; expires=${date.toUTCString()}; path=/`;
}


function getSpecialCookie() {
    const match = document.cookie.match(/(?:^|; )special=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
}



//------------------------------------------------Rating cucc

function ratingColor(rating) {
    if (rating >= 8.8) {
        return "var(--rating-awesome)"
    } else if (rating >=7.8) {
        return "var(--rating-great)"
    } else if (rating >= 6.8) {
        return "var(--rating-good)"
    } else if (rating >= 5.4) {
        return "var(--rating-regular)"
    } else if (rating >= 3.8) {
        return "var(--rating-bad)"
    } else if (rating == 0) {
        return "var(--rating-upcoming)"
    } else {
        return "var(--rating-garbage)"
    }
}


function setUpcomingErtekelesCucc() {
    setTimeout(() => {
        document.querySelectorAll(".rating").forEach(rating => {
            if (rating.style.backgroundColor == "var(--rating-upcoming)" || rating.style.color == "var(--rating-upcoming)") {
                rating.innerHTML = "?"
            }
        })
    }, 100);
}
