function deleteFeed(targetId) {
    targetId = parseInt(targetId)
    console.log("Deleting feed", targetId)
    let deletedFeed = getFeed(targetId, copy=true)
    feedList.root = feedList.root.filter(feed => feed.id !== targetId);
    feedList.folders = feedList.folders.map(folder => ({
    ...folder, feeds: folder.feeds.filter(feed => feed.id !== targetId)
    }));

    refreshFeeds()
    return deletedFeed
}

function moveFeed(targetId, folder = -1) {
    if (folder !== -1) {
        const selectedFolder = feedList.folders.find(f => f.id === folder);
        if (!selectedFolder) return false;
    }
    let deletedFeed = deleteFeed(targetId)
    addFeed(deletedFeed, folder)
    return true
}

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