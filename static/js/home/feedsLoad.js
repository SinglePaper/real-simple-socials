function loadUrls(ids=[]) {
  let feedList = JSON.parse(localStorage.feedList)
  // console.log(feedList)
  if (feedList.folders.length === 0 && feedList.root.length === 0) return []
  let feeds = [
    ...feedList.folders.flatMap(f => f.feeds),
    ...feedList.root.map(feed => feed)
  ]

  if (ids.length > 0) {
    feeds = feeds.filter(item => ids.includes(item.id))
  }
  return feeds
}

function handleYouTube(xmlDoc, targetFeed, nameOnly = false) {
    let feedName = xmlDoc.querySelector("author").querySelector("name").textContent;
    if (nameOnly) {return feedName}

    let feed = parent.getFeed(targetFeed.id)
    if (!"name" in feed) { feed.name = feedName }

    const items = xmlDoc.querySelectorAll("entry");
    let feedItems = [];

    items.forEach(item => {
        const title = item.querySelector("title").textContent;
        const link = item.querySelector("link").attributes.href.value;
        const description = item.querySelector("description").textContent;
        const guid = item.querySelector("id").textContent;
        const pubDate = new Date(item.querySelector("published").textContent);
        const hosturl = new URL(item.querySelector("link").attributes.href.value)
        const feedIcon = "../images/favicon_yt.png"
        const thumbnail = item.querySelector("thumbnail").attributes.url.value.replace("hqdefault", "hq720")
        // const feedItemDesktop = createFeedItem(title,feedTitle,description,link,guid,pubDate,feedIcon,targetFeed.id,thumbnail);
        // const feedItemMobile = createFeedItem(title,feedTitle,description,link,guid,pubDate,feedIcon,targetFeed.id,thumbnail, mobile=true);
        let isRead = false;
        feedItems.push([title,feed.name,description,link,guid,pubDate,feedIcon,targetFeed.id,isRead,thumbnail]);

        // Store information for feeds list in sidebar
        feed.icon = feedIcon
    });


    return feedItems
}

function handleTwitch(xmlDoc, targetFeed, nameOnly = false) {
    let feedName = xmlDoc.querySelector("title").textContent.split("'s Twitch")[0]
    if (nameOnly) {return feedName}

    let feed = parent.getFeed(targetFeed.id)
    if (!"name" in feed) { feed.name = feedName }

    const items = xmlDoc.querySelectorAll("item");
    let feedItems = [];

    items.forEach(item => {
        const title = item.querySelector("title").textContent;
        const description = `New stream by ${feedName}`
        const guid = item.querySelector("guid").textContent;
        const pubDate = new Date(item.querySelector("pubDate").textContent);
        const hosturl = new URL(item.querySelector("link").textContent)
        const feedIcon = "../images/favicon_twitch.png";

        let thumbnail = "../images/default_thumbnail.svg";
        // Extracting thumbnail
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = item.querySelector("description").textContent;

        // Find the first image tag
        const img = tempDiv.querySelector('img');
        let currentlyLive = false
        if (img && img.src) {
            currentlyLive = img.src.includes("404_processing")
            thumbnail = currentlyLive ? `https://static-cdn.jtvnw.net/previews-ttv/live_user_${feedName}.jpg` : img.src
        }
        const link = currentlyLive ? `https://www.twitch.tv/${feedName}` : item.querySelector("link").textContent;

        // const feedItemDesktop = createFeedItem(title,feedTitle,description,link,guid,pubDate,feedIcon,targetFeed.id,thumbnail);
        // const feedItemMobile = createFeedItem(title,feedTitle,description,link,guid,pubDate,feedIcon,targetFeed.id,thumbnail, mobile=true);
        let isRead = false;
        feedItems.push([title,feed.name,description,link,guid,pubDate,feedIcon,targetFeed.id,isRead,thumbnail]);

        // Store information for feeds list in sidebar
        feed.icon = feedIcon

        // feedInfos[targetFeed.id] = {
        //   "displayName": targetFeed.name,
        //   "originalName": feedTitle,
        //   "icon": feedIcon,
        //   "nItems": items.length
        // }
        
    });
    return feedItems
}

function handleBluesky(xmlDoc, targetFeed, nameOnly = false) {
    let feedName = xmlDoc.querySelector("title").textContent
    if (nameOnly) {return feedName}

    let feed = parent.getFeed(targetFeed.id)
    if (!"name" in feed) { feed.name = feedName }

    const items = xmlDoc.querySelectorAll("item");
    let feedItems = [];

    items.forEach(item => {
        const title = "New Post on Bluesky"
        const link = item.querySelector("link").textContent;
        const description = item.querySelector("description") ? item.querySelector("description").textContent : "";
        const postPreview = shortenString(description, 7)
        const guid = item.querySelector("guid").textContent;
        const pubDate = new Date(item.querySelector("pubDate").textContent);
        const feedIcon = "../images/favicon_bsky.png"
        // const feedItemDesktop = createFeedItem(title,feedTitle,description,link,guid,pubDate,feedIcon,targetFeed.id);
        // const feedItemMobile = createFeedItem(title,feedTitle,description,link,guid,pubDate,feedIcon,targetFeed.id);\
        let isRead = false;
        feedItems.push([title,feed.name,description,link,guid,pubDate,feedIcon,targetFeed.id,isRead]);

        // Store information for feeds list in sidebar
        feed.icon = feedIcon
    });
    return feedItems
}

function handleRDF(xmlDoc, targetFeed, nameOnly = false) {
    let feedName = xmlDoc.querySelector("title").textContent
    if (nameOnly) {return feedName}

    let feed = parent.getFeed(targetFeed.id)
    if (!"name" in feed) { feed.name = feedName }
    
    const items = xmlDoc.querySelectorAll("item");
    let feedItems = [];

    items.forEach(item => {
        const title = item.querySelector("title").textContent;
        const link = item.querySelector("link").textContent;
        let description = item.querySelector("description").textContent;
        const guid = item.querySelector("link").textContent;
        const pubDate = new Date(item.querySelector("date").textContent);
        const hosturl = new URL(xmlDoc.querySelectorAll("link")[0].innerHTML || xmlDoc.querySelectorAll("link")[0].attributes.href.value);
        const feedIcon = new URL(hosturl.protocol+"//"+hosturl.hostname+"/favicon.ico").href ;

        let thumbnail = "../images/default_thumbnail.svg";
        // Extracting thumbnail
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = description;

        // Find the first image tag
        const img = tempDiv.querySelector('img');
        if (img && img.src) {
            thumbnail = img.src
        }

        description = removeHTML(description)
        // const feedItemDesktop = createFeedItem(title,feedTitle,description,link,guid,pubDate,feedIcon,targetFeed.id,thumbnail);
        // const feedItemMobile = createFeedItem(title,feedTitle,description,link,guid,pubDate,feedIcon,targetFeed.id,thumbnail,mobile=true);
        let isRead = false;
        feedItems.push([title,feed.name,description,link,guid,pubDate,feedIcon,targetFeed.id,isRead,thumbnail]);

        // Store information for feeds list in sidebar
        feed.icon = feedIcon

        // feedInfos[targetFeed.id] = {
        //   "displayName": targetFeed.name,
        //   "originalName": feedTitle,
        //   "icon": feedIcon,
        //   "nItems": items.length
        // }
    });
    return feedItems
}

// Adapted from - https://stackoverflow.com/a/78602700
// Posted by Martin Honnen
// Retrieved 2026-05-23, License - CC BY-SA 4.0
// Modified by SinglePaper
async function fetchRSS(targetFeed, nameOnly = false) {
    const protocol = window.location.protocol;
    const host = window.location.host;
    const fetchUrl = `${protocol}//${host}/api/rss-proxy?url=${encodeURIComponent(targetFeed.url)}`;
    
    if (targetFeed.url === undefined || encodeURIComponent(targetFeed.url) == "undefined") return
    if (targetFeed.url === host) return

    try {
        // console.log('Fetching URL:', fetchUrl); // Debugging 1: Log the request URL
        const response = await fetch(fetchUrl);
        const data = await response.text();

        // console.log('Data fetched:', data); // Debugging 2: Log the raw data
        
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, "application/xml");
        // console.log(xmlDoc)
        // console.log('Parsed XML:', xmlDoc); // Debugging 3: Log the parsed XML

        // YouTube is weird, so we'll handle it in a separate function.
        if (targetFeed.url.includes("youtube.com/feeds")) {
            return handleYouTube(xmlDoc, targetFeed, nameOnly)
        }        
        // Twitch is weird, so we'll handle it in a separate function.
        if (targetFeed.url.includes("twitchrss")) {
            return handleTwitch(xmlDoc, targetFeed, nameOnly)
        }
        // Bluesky is weird, so we'll handle it in a separate function.
        if (targetFeed.url.includes("bsky.app")) {
            return handleBluesky(xmlDoc, targetFeed, nameOnly)
        }
        // RDF works a little differently
        if (xmlDoc.querySelector("RDF")) {
            return handleRDF(xmlDoc, targetFeed, nameOnly)
        }

        let feedName;
        try {
          feedName = xmlDoc.querySelector("channel").querySelector("title").textContent
        } catch (error) {
          feedName = xmlDoc.querySelector("feed").querySelector("title").textContent
        }
        if (nameOnly) {return feedName}
        
        let feed = parent.getFeed(targetFeed.id)
        if (!"name" in feed) { feed.name = feedName }
        
        
        let items = xmlDoc.querySelectorAll("item");
        if (items.length == 0) {
          items = xmlDoc.querySelectorAll("entry");
        }
        let feedItems = [];

        items.forEach(item => {
            const title = item.querySelector("title").textContent;
            let link = item.querySelector("link").textContent;
            if (link.length == 0) {
              link = item.querySelector("link").attributes.href.value
            }
            let description;
            try {
              description = item.querySelector("description").textContent;
            } catch (error) {
              description = item.querySelector("summary").textContent;
            }
            let guid;
            try {
              guid = item.querySelector("guid").textContent;
            } catch (error) {
              guid = item.querySelector("id").textContent;
            }
            let pubDate;
            try {
              pubDate = new Date(item.querySelector("pubDate").textContent);
            } catch (error) {
              pubDate = new Date(item.querySelector("published").textContent);
            }

            let hosturl
            if (targetFeed.url.includes(encodeURIComponent(window.location.host))) { hosturl = new URL(xmlDoc.querySelectorAll("link")[0].innerHTML || xmlDoc.querySelectorAll("link")[0].attributes.href.value) }
            else { hosturl = new URL(xmlDoc.querySelectorAll("link")[0].innerHTML || xmlDoc.querySelectorAll("link")[0].attributes.href.value); }
            const feedIcon = new URL(hosturl.protocol+"//"+hosturl.hostname+"/favicon.ico").href ;


            let thumbnail = "../images/default_thumbnail.svg";
            // Extracting thumbnail
            let tempDiv = document.createElement('div');
            tempDiv.innerHTML = description;

            // Find the first image tag
            let img = tempDiv.querySelector('img');
            if (img && img.src) {
                thumbnail = img.src
            } else {
              // console.log("Last attempt to get thumbnail")
              // Find the first image tag
              let img = xmlDoc.getElementsByTagName('image')[0];
              if (img && extractFirstUrl(img.innerHTML)) {
                  thumbnail = extractFirstUrl(img.innerHTML)
              }
            }

            description = removeHTML(description)
            let isRead = false;

            feedItems.push([title,feed.name,description,link,guid,pubDate,feedIcon,targetFeed.id,isRead,thumbnail]);
            
            // Store information for feeds list in sidebar
            feed.icon = feedIcon
            

            // feedInfos[targetFeed.id] = {
            //   "displayName": targetFeed.name,
            //   "originalName": feedTitle,
            //   "icon": feedIcon,
            //   "nItems": items.length
            // }
        });


        return feedItems
    } catch (error) {
        console.error(`Error fetching the RSS feed ( ${fetchUrl} ):`, error);
    }
}

async function loadFeeds(ids = []) {
    targetFeedItems = []
    latestFeedLoad = new Date()
    let currentFeedLoad = latestFeedLoad

    // Display saved items
    allFeedItems = allFeedItems.filter((item) => parent.getFeed(item[7]) !== null) // Filter out saved items from deleted feeds.
    bookmarkedGuids = JSON.parse(localStorage.bookmarkedItems)
    localStorage.bookmarkedItems = JSON.stringify(bookmarkedGuids.filter((guid) => getFeedItem(guid) !== null))
    readGuids = JSON.parse(localStorage.readItems)
    localStorage.readItems = JSON.stringify(readGuids.filter((guid) => getFeedItem(guid) !== null))
    if (allFeedItems.length > 0 && ids.length == 0) {displayItems(allFeedItems, currentFeedLoad)}

    // Fetch items in small batches to avoid freezing
    const batchSize = 10
    let fetchPromises = []

    for (let i in targetFeeds) {
        if (currentFeedLoad != latestFeedLoad) { return }
        let targetFeed = targetFeeds[i]
        if (targetFeed === undefined) continue

        fetchPromises.push(fetchRSS(targetFeed))

        if (fetchPromises.length >= batchSize) {
            const fetchedLists = await Promise.all(fetchPromises)
            fetchPromises = []

            for (const items of fetchedLists) {
                if (currentFeedLoad != latestFeedLoad) { return }
                if (items === undefined) { continue }
                items.forEach(item => {
                    if (!allFeedItems.find((existingItem) => existingItem[4] == item[4])) { allFeedItems.push(item) } 
                    if (ids.length != 0) targetFeedItems.push(item)
                })
            }

            await new Promise(requestAnimationFrame)
        }
    }

    if (fetchPromises.length > 0) {
        const fetchedLists = await Promise.all(fetchPromises)
        for (const items of fetchedLists) {
            if (currentFeedLoad != latestFeedLoad) { return }
            if (items === undefined) { continue }
            items.forEach(item => {
                if (!allFeedItems.find((existingItem) => existingItem[4] == item[4])) { allFeedItems.push(item) } 
                if (ids.length != 0) targetFeedItems.push(item)
            })
        }
    }

    const textEncoder = new TextEncoder();
    console.log("Feed items list size: ",textEncoder.encode(JSON.stringify(allFeedItems)).length);

    // Store info
    allFeedItems.sort(function(a,b){return new Date(b[5]) - new Date(a[5])})
    while (textEncoder.encode(JSON.stringify(allFeedItems)).length > 5000000) { 
      let deletedItem = allFeedItems.pop() 
      if (getBookmarkStatus(deletedItem[4]) && getSettings().preventBookmarkDeletion) { allFeedItems.unshift(deletedItem) }
    }
    saveFeedItems()

    // Display updated items
    if (currentFeedLoad != latestFeedLoad) { return }
    displayItems(ids.length == 0 ? allFeedItems : targetFeedItems, currentFeedLoad)

    window.parent.postMessage({ type: 'populate-feeds-menu' }, '*') // Repopulate feeds menu with updated icons and feed item counts
    
    toggleSpinner(false)
}


function clearFeedItems(feedId) {
  allFeedItems = allFeedItems.filter((item) => item[7] != feedId)
}

function initLoadFeeds(ids) {
  toggleSpinner(true)

  targetFeeds = loadUrls(ids = ids)  // The argument 'ids' can be used to load items with only specific ids
  loadFeeds(ids = ids)
}

function loadBookmarks() {
  toggleSpinner(false); 
  // console.log("Loading bookmarks...")
  const bookmarkedGuids = JSON.parse(localStorage.bookmarkedItems)
  console.log(bookmarkedGuids)
  let feedItems = []
  for (let guid of bookmarkedGuids) {
    try { // This can catch items that are no longer stored, but still marked as bookmarked (it should be prevented that these are deleted, though!)
      let item = getFeedItem(guid)
      feedItems.push(item)
    } catch {
      continue
    }
  }
  latestFeedLoad = new Date()
  let currentFeedLoad = latestFeedLoad
  displayItems(feedItems = feedItems, currentFeedLoad, bookmarksView=true)
}