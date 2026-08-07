let curGuid;
let startX;
let buttonsStartX;
let moveThreshold;  // The point at which the buttons should start moving
let activationThreshold; // The point at which a button should be marked as pressed
let distance = 0;
let doMarkRead = false
let doBookmark = false

function addTouchListeners(nLatest = 0) {
    let feedItemsPhone = document.querySelectorAll(".phone")
    feedItemsPhone = [ ...feedItemsPhone ].slice(0,nLatest)
    console.log(feedItemsPhone)
    for (let feedItemElem of feedItemsPhone) {
        let guid = feedItemElem.attributes.label.value
        // console.log(feedItemElem.getBoundingClientRect())
        feedItemElem.addEventListener("pointerdown", (event) => {
            // console.log(`Pointer down event (${guid})`,event);
            startTouch(event, guid, feedItemElem)
        });
        feedItemElem.addEventListener("pointermove", (event) => {
            trackMovement(event)
        });
        feedItemElem.addEventListener("pointerup", (event) => {
            // console.log(`Pointer up event (${guid})`,event);
            finishTouch(event)
        });        
        feedItemElem.addEventListener("pointercancel", (event) => {
            // console.log(`Pointer up event (${guid})`,event);
            finishTouch(event, cancel=true)
        });
    }
}

function startTouch(event, guid, feedItemElem) {
    let feedItemLoc = feedItemElem.getBoundingClientRect()
    let feedButtonsLoc = feedItemElem.getElementsByClassName("item-buttons")[0].getBoundingClientRect()
    startX = event.clientX
    if (!buttonsStartX) { buttonsStartX = feedButtonsLoc.x }
    moveThreshold = feedItemLoc.width * 0.05
    activationThreshold = feedItemLoc.width * 0.25
    curGuid = guid
}

function trackMovement(event) {
    distance = event.clientX - startX
    if (event.buttons == 0) { updateItemButtonsPhone(curGuid, 0, buttonsStartX, activationThreshold) } // Reset buttons
    if (Math.abs(distance) > moveThreshold) {
        updateItemButtonsPhone(curGuid, distance, buttonsStartX, activationThreshold)
    } else {
        updateItemButtonsPhone(curGuid, 0, buttonsStartX, activationThreshold)
    }
}

function finishTouch(event, cancel = false) {
    if (!cancel && distance < -activationThreshold) {
        markReadStatus(curGuid, !getReadStatus(curGuid))
    } 
    else if (!cancel && distance > activationThreshold) {
        markBookmarkStatus(curGuid, !getBookmarkStatus(curGuid))
    }
    updateItemButtonsPhone(curGuid, 0, buttonsStartX, activationThreshold) // Reset buttons position
}