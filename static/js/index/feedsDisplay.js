const collapseDesktopEl = document.getElementById('collapseMarkAllAsRead');
const collapsePhoneEl = document.getElementById('collapseMarkAllAsReadPhone');
const buttonDesktopEl = document.querySelectorAll('[data-bs-target="#collapseMarkAllAsRead"]')[1];
const buttonPhoneEl = document.querySelector('[data-bs-target="#collapseMarkAllAsReadPhone"]');

function refreshFeeds() {
    localStorage.setItem("feedList", JSON.stringify(feedList)) 
    populateFeedsMenu(feedList)
    iframeElem.contentWindow.postMessage({ type: 'load-feeds' }, '*');
}

function loadSubsetFeeds(ids=[]) {
    iframeElem.contentWindow.postMessage({ type: 'load-feeds', ids: JSON.stringify(ids) }, '*');
    document.getElementById("menu-btn-close").click()
}

function loadBookmarks() {
    iframeElem.contentWindow.postMessage({ type: 'load-bookmarks' }, '*');
    document.getElementById("menu-btn-close").click()
}

async function markAllAsRead() {
    for (let guid of iframeElem.contentWindow.getDisplayedGuids()) {
        iframeElem.contentWindow.markReadStatus(guid, true)
        await new Promise(requestAnimationFrame) // Allows collapse closing animation to happen and prevents lag
    }
}

function closeMarkAllAsReadCollapse(e) {
    const open = collapseDesktopEl.classList.contains('show') || collapsePhoneEl.classList.contains('show');
    const clickedInsideCollapse = collapseDesktopEl.contains(e.target) || collapsePhoneEl.contains(e.target) ;
    const clickedButton = buttonDesktopEl.contains(e.target) || buttonPhoneEl.contains(e.target);
    if (open && !clickedInsideCollapse && !clickedButton) {
        bootstrap.Collapse.getOrCreateInstance(collapseDesktopEl).hide();
        bootstrap.Collapse.getOrCreateInstance(collapsePhoneEl).hide();
    }
}

// Cancel 'mark all as read' if click anywhere else on the screen
document.addEventListener('click', closeMarkAllAsReadCollapse);

function updateMarkAllAsReadSwipeBarPhone(distance, startX, activationThreshold) {
    // Move the button 'distance' distance across x-axis
    buttonElem.style.setProperty("right",  `
        ${Math.max(
            0,
            Math.min(
            -distance,
            activationThreshold
            )
        )
        }px`)


    // Give both buttons color when Math.abs(distance) > activationThreshold
    if (Math.abs(distance) > activationThreshold) {
        buttonElem.classList.add("bg-primary")
        swipeBarElem.children[0].children[0].classList.add("bg-primary-subtle")
    } else {
        buttonElem.classList.remove("bg-primary")
        swipeBarElem.children[0].children[0].classList.remove("bg-primary-subtle")
    }
    return distance
}