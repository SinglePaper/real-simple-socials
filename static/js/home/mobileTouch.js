// Feed Items
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
    console.log(feedItemsPhone)
    for (let feedItemElem of feedItemsPhone) {
        let guid = feedItemElem.attributes.label.value
        
        feedItemElem._listenersController?.abort();
        const controller = new AbortController();
        feedItemElem._listenersController = controller;

        feedItemElem.addEventListener("pointerdown", (event) => {
            startTouch(event, guid, feedItemElem);
        }, { signal: controller.signal });

        feedItemElem.addEventListener("pointermove", (event) => {
            trackMovement(event);
        }, { signal: controller.signal });

        feedItemElem.addEventListener("pointerup", (event) => {
            finishTouch(event);
        }, { signal: controller.signal });

        feedItemElem.addEventListener("pointercancel", (event) => {
            finishTouch(event, true);
        }, { signal: controller.signal });
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