function editFeed(feedId) {
    feedId = parseInt(feedId)
    let feed = getFeed(parseInt(feedId))
    feed.name = document.querySelector(`#editFeedFormInputs input.name`).value;
    if ("includeShorts" in feed) {
        feed.includeShorts = document.querySelector(`#editCheckShorts`).checked
        feed.url = feed.includeShorts ? feed.urlShorts : feed.urlNoShorts
    }
    if ("plusOnly" in feed) {
        feed.plusOnly = document.querySelector(`#editCheckPlus`).checked
        feed.url = feed.plusOnly ? feed.urlPlus : feed.urlAll
    }

    // Edit folder
    let selectedFolder = parseInt(document.querySelector(`#editFeedFolders`).value)
    if (selectedFolder != getFeedLocation(feedId)) { moveFeed(feedId, selectedFolder) }

    iframeElem.contentWindow.clearFeedItems(feedId)
    refreshFeeds()
}