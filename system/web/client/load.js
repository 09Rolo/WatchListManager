
kurzor()

document.addEventListener("DOMContentLoaded", (event) => {
    loaded()
});


function loaded() {
    let betolto = document.getElementById("betolto")

    betolto.remove()
}


//-------------------------------------------------------------------------------Kurzor
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

