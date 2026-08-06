let curGuid;
let startX;
let buttonsStartX;
let moveThreshold;  // The point at which the buttons should start moving
let activationThreshold; // The point at which a button should be marked as pressed
let distance = 0;
let doMarkRead = false
let doBookmark = false

function addTouchListeners() {
    let feedItemsPhone = document.querySelectorAll(".phone")  
    for (let feedItemElem of feedItemsPhone) {
        let guid = feedItemElem.attributes.label.value
        // console.log(feedItemElem.getBoundingClientRect())
        feedItemElem.addEventListener("pointerdown", (event) => {
            console.log(`Pointer down event (${guid})`,event);
            startTouch(event, guid, feedItemElem)
        });
        feedItemElem.addEventListener("pointermove", (event) => {
            trackMovement(event)
        });
        feedItemElem.addEventListener("pointerup", (event) => {
            console.log(`Pointer up event (${guid})`,event);
            finishTouch(event)
        });
    }
}

function startTouch(event, guid, feedItemElem) {
    let feedItemLoc = feedItemElem.getBoundingClientRect()
    console.log(feedItemLoc)
    let feedButtonsLoc = feedItemElem.getElementsByClassName("item-buttons")[0].getBoundingClientRect()
    startX = event.clientX
    buttonsStartX = feedButtonsLoc.x
    moveThreshold = feedItemLoc.width * 0.05
    activationThreshold = feedItemLoc.width * 0.25
    curGuid = guid
}

function trackMovement(event) {
    distance = event.clientX - startX
    if (Math.abs(distance) > moveThreshold) {
        updateItemButtonsPhone(curGuid, distance, buttonsStartX, activationThreshold)
    } else {
        updateItemButtonsPhone(curGuid, 0, buttonsStartX, activationThreshold)
    }
}

function finishTouch(event) {
    if (distance < -activationThreshold) {
        markReadStatus(curGuid, !getReadStatus(curGuid))
    } 
    else if (distance > activationThreshold) {
        markBookmarkStatus(curGuid, !getBookmarkStatus(curGuid))
    }
    updateItemButtonsPhone(curGuid, 0, buttonsStartX, activationThreshold) // Reset buttons position
    console.log(event)
}