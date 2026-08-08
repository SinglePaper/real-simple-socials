//// Mark All As Read Swiper (Phone view)

// Initialize variables
let startX;
let buttonsStartX;
let moveThreshold;
let activationThreshold; // The point at which a button should be marked as pressed
let distance = 0;
let buttonElem = document.querySelector('#markAllAsReadCollapse .mark-all-as-read-btn')
let swipeBarElem = document.querySelector('#markAllAsReadCollapse .mark-all-as-read-swipe-bar')

// Set event listeners
buttonElem.addEventListener("pointerdown", startTouch);
buttonElem.addEventListener("pointermove", trackMovement);
buttonElem.addEventListener("pointerup", finishTouch);
buttonElem.addEventListener("pointercancel", (event) => {
    finishTouch(event, true)
});

function startTouch(event) {
    let buttonElemLoc = buttonElem.getBoundingClientRect() 
    let swipeBarElemLoc = swipeBarElem.getBoundingClientRect()
    startX = event.clientX
    if (!buttonsStartX) { buttonsStartX = buttonElemLoc.x }
    moveThreshold = swipeBarElemLoc.width * 0.05
    activationThreshold = swipeBarElemLoc.width - buttonElemLoc.width // calc(78vw - 28px)
    buttonElem.style.setProperty("transition",  "right .075s") // Make button move speed fast
}

function trackMovement(event) {
    if (activationThreshold < 50) return
    distance = event.clientX - startX
    if (event.buttons == 0) { updateMarkAllAsReadSwipeBarPhone(0, buttonsStartX, activationThreshold) } // Reset buttons
    if (Math.abs(distance) > moveThreshold) {
        updateMarkAllAsReadSwipeBarPhone(distance, buttonsStartX, activationThreshold)
    } else {
        updateMarkAllAsReadSwipeBarPhone(0, buttonsStartX, activationThreshold)
    }
}

function finishTouch(event, cancel = false) {
    if (activationThreshold < 50) return
    if (!cancel && distance < -activationThreshold) {
        buttonElem.style.setProperty("transition",  "right .3s") // Make button move speed line up with collapse elem
        markAllAsRead()
        console.log("Marking All As Read!")
        buttonElem.click()
    }
    updateMarkAllAsReadSwipeBarPhone(0, buttonsStartX, activationThreshold) // Reset buttons position
}