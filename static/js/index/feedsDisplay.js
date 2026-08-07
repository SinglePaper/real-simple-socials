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