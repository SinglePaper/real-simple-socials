function addFeed(feed, folder = -1) { // Feed is a dictionary containing name, url, and id)
    if (folder === -1) {
        feedList.root.push(feed);
    } else {
        const selectedFolder = feedList.folders.find(f => f.id === folder);
        console.log("Failed to add feed to non-existent folder.")
        if (!selectedFolder) return false;

        selectedFolder.feeds.push(feed);
    }

    // Refresh feeds and menu
    refreshFeeds()
    
    return true
}

async function addYouTubeFeed() {
    const formUrl = document.querySelector(`div.youtube .url`).value;
    const includeShorts = document.querySelector(`div.youtube .form-check-input`).checked;
    const targetFolder = parseInt(document.querySelector(`#addFeedFolders`).value);
    let feed;

    const isChannel = !formUrl.includes("playlist?list=")
    const isRSS = formUrl.includes("feeds/videos.xml?")
    if (isChannel && !isRSS) {
        const channelId = await fetchChannelId(formUrl)
        let rssUrlShorts = `https://www.youtube.com/feeds/videos.xml?${"channel_id"}=${channelId}`
        let rssUrlNoShorts = `https://www.youtube.com/feeds/videos.xml?${"playlist_id"}=${"UULF"+channelId.substring(2)}` 

        // Fetch URL to get feed name
        let name = await getFeedName(rssUrlNoShorts)

        // Assemble feed
        feed = {
            source: "YouTube",
            type: "channel",
            name: name,
            url: includeShorts ? rssUrlShorts : rssUrlNoShorts,
            urlShorts: rssUrlShorts,
            urlNoShorts: rssUrlNoShorts,
            includeShorts: includeShorts,
            id: getMaxId(feedList) + 1
        }
    } else if (!isChannel && !isRSS) {
        let rssUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${formUrl.split("playlist?list=")[1]}`
        // console.log(rssUrl)
        // Fetch URL to get feed name
        let name = await getFeedName(rssUrl)
        // Assemble feed
        feed = {
            source: "YouTube",
            type: "playlist",
            name: name,
            url: rssUrl,
            id: getMaxId(feedList) + 1
        }
    } else {
        // Fetch URL to get feed name
        let name = await getFeedName(formUrl)

        // Assemble feed
        feed  = {
            source: "YouTube",
            type: "rss",
            name: name,
            url: formUrl,
            id: getMaxId(feedList) + 1
        }
    }
    console.log("Adding YouTube")

    return addFeed(feed, targetFolder)
}

function addDropoutFeed() {
    let rssUrl = `https://singlepaper.github.io/dropout-rss/${document.getElementById("selectDropoutSources").value}` // check this
    let feedTitle = document.getElementById("selectDropoutSources").selectedOptions[0].textContent
    const targetFolder = parseInt(document.querySelector(`#addFeedFolders`).value);
    
    console.log("Adding Dropout")
    let feed  = {
        source: "Dropout",
        name: feedTitle,
        url: rssUrl,
        id: getMaxId(feedList) + 1
    }

    return addFeed(feed, targetFolder)
}

async function addNebulaFeed() {
    const formUrl = document.querySelector(`div.nebula .url`).value;
    const nebulaPlusOnly = document.querySelector(`#checkPlus`).checked;
    const targetFolder = parseInt(document.querySelector(`#addFeedFolders`).value);
    let rssUrl, rssUrlAll, rssUrlPlus, name;
    let isChannel = !formUrl.includes("?category=")

    if (isChannel) {
        let channelName = formUrl.split("nebula.tv/")[1].replace("/","")
        name = channelName
        rssUrlAll = `https://rss.nebula.app/video/channels/${channelName}.rss`
        rssUrlPlus = `https://rss.nebula.app/video/channels/${channelName}.rss?plus=true`
        rssUrl = nebulaPlusOnly ? rssUrlPlus: rssUrlAll
    } else {
        let categoryName = formUrl.split("videos?category=")[1].replace("/","")
        name = categoryName
        console.log(categoryName)
        rssUrlAll = `https://rss.nebula.app/video/categories/${categoryName}.rss`
        rssUrlPlus = `https://rss.nebula.app/video/categories/${categoryName}.rss?plus=true`
        rssUrl = nebulaPlusOnly ? rssUrlPlus: rssUrlAll
        console.log(rssUrl)
    }

    // Fetch URL to get feed name
    name = await getFeedName(rssUrl)

    // Assemble feed
    console.log("Adding Nebula")
    let feed  = {
        source: "Nebula",
        isChannel: isChannel,
        name: name,
        url: rssUrl,
        urlAll: rssUrlAll,
        urlPlus: rssUrlPlus,
        plusOnly: nebulaPlusOnly,
        id: getMaxId(feedList) + 1
    }
    // console.log(feed)
    return addFeed(feed, targetFolder)
}

async function addTwitchFeed() {
    const formUrl = document.querySelector(`div.twitch .url`).value;
    const targetFolder = parseInt(document.querySelector(`#addFeedFolders`).value);
    console.log("Adding Twitch")
    const channelName = formUrl.split("twitch.tv/")[1].replace("/","")
    const rssUrl = `https://twitchrss.appspot.com/vod/${channelName}`

    // Fetch URL to get feed name (not really necessary)
    let name = await getFeedName(rssUrl)

    // Assemble feed
    let feed = {
        source: "Twitch",
        name: name,
        url: rssUrl,
        id: getMaxId(feedList) + 1 
    }

    return addFeed(feed, targetFolder)
}

async function addBlueskyFeed() {
    const formUrl = document.querySelector(`div.bluesky .url`).value;
    const targetFolder = parseInt(document.querySelector(`#addFeedFolders`).value);

    console.log("Adding Bluesky")
    const rssUrl = `${formUrl}/rss`

    // Fetch URL to get feed name (not really necessary)
    let name = await getFeedName(rssUrl)

    // Assemble feed
    let feed = {
        source: "Bluesky",
        name: name,
        url: rssUrl,
        id: getMaxId(feedList) + 1 
    }

    return addFeed(feed, targetFolder)
}

async function addOtherFeed() {
    const formUrl = document.querySelector(`div.other .url`).value;
    const rssUrl = formUrl
    const targetFolder = parseInt(document.querySelector(`#addFeedFolders`).value);
    console.log("Adding Other")

    // Fetch URL to get feed name (not really necessary)
    let name = await getFeedName(rssUrl)

    // Assemble feed
    let feed = {
        source: "Other",
        name: name,
        url: rssUrl,
        id: getMaxId(feedList) + 1 
    }

    return addFeed(feed, targetFolder)
}