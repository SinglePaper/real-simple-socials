function addNewFolder(name) {
    feedList.folders.push({
        id: getMaxId(feedList)+1,
        name: name,
        feeds: []
    })
    localStorage.setItem("feedList", JSON.stringify(feedList)) 
    populateFeedsMenu(feedList)
    return true
}

function editFolder(targetId, name) {
    targetId = parseInt(targetId)
    let folder = getFolder(targetId)
    folder.name = name
    localStorage.setItem("feedList", JSON.stringify(feedList)) 
    populateFeedsMenu(feedList)
    return true
}

function deleteFolder(targetId) {
    targetId = parseInt(targetId)
    console.log("Deleting folder", targetId)
    let deletedFolder = getFolder(targetId, copy=true)
    feedList.folders = feedList.folders.filter(folder => folder.id !== targetId)

    refreshFeeds()
    return deletedFolder
}