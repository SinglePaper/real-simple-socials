let curDisplayedGuids = [];

function createFeedItem(title, feedTitle, description, link, guid, pubDate, feedIcon, feedId, legacy = false, thumbnail = "../images/default_thumbnail.svg", mobile = false) {
  const feed = parent.getFeed(feedId)
  const feedItem = document.createElement('div');
  if (mobile) {
    feedItem.classList.add('row');
  } else {
    feedItem.classList.add('col-12');
    feedItem.classList.add('col-md-6');
    feedItem.classList.add('col-lg-3');
    feedItem.classList.add('col-xl-3');
  }

  const safeTitle = escapeHTML(title);
  const safeFeedName = escapeHTML(feed?.name ?? '');
  const safeDescription = escapeHTML(description);
  const safeLink = safeURL(link);
  const safeFeedIcon = safeURL(feed?.icon ?? '');
  const safeThumb = safeURL(thumbnail);
  const safeGuid = escapeHTML(guid);
  const safeFeedId = Number(feedId);

  const isRead = getReadStatus(guid.toString())
  const isBookmarked = getBookmarkStatus(guid.toString());

  let DESKTOP_CARD = `
      <div class="desktop mb-4">
        <div class="text-start position-relative">
          <a href="${safeLink}" target="_blank" rel="noopener noreferrer">
            <div onclick="markReadStatus('${guid}', true);" class="position-relative">
              <div class="ratio ratio-16x9 mb-2">
                <img
                  src="${safeThumb}"
                  class="w-100 shadow-1-strong rounded img-fluid"
                  style="display:block; object-fit: cover"
                  alt=""
                >
              </div>

              <img
                src="${safeFeedIcon}"
                class="position-absolute m-2 img-fluid"
                style="width:15%; height:auto; top:0; left:0;"
                alt=""
              >
            </div>
          </a>
          <div class="dropdown position-absolute img-fluid" style="width:15%; height:auto;right:-3%;margin-top:-0.5em">
          
            <button class="btn border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <svg xmlns="http://www.w3.org/2000/svg" style="width:1em;right:0;top:0" fill="currentColor" class="bi bi-chevron-down p-0 m-0" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
              </svg>
            </button>
            <ul class="dropdown-menu">
              <li><button class="dropdown-item" type="button" onclick="showDescription('${guid}')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="me-1 bi bi-justify-left" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/>
                </svg>
                Description
              </button></li>
              <li class="readBtn">
                ${isRead ?
                  `<button class="dropdown-item" type="button" onclick="markReadStatus('${guid}',false)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="me-1 bi bi-eye-slash" viewBox="0 0 16 16"\>
                      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
                      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
                      <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
                </svg>
                Mark as Unread
                </button>
                ` : `
                <button class="dropdown-item" type="button" onclick="markReadStatus('${guid}',true)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="me-1 bi bi-eye" viewBox="0 0 16 16"\>
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                </svg>
                  Mark as Read
                </button>`
                }
              </li>
              <li class="bookmarkBtn">
                ${isBookmarked ?
                  `
                <button class="dropdown-item" type="button" onclick="markBookmarkStatus('${guid}',false)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="me-1 bi bi-bookmark" viewBox="0 0 16 16">
                    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z"/>
                  </svg>
                  Delete Bookmark
                </button>
                ` : `
                <button class="dropdown-item" type="button" onclick="markBookmarkStatus('${guid}',true)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="me-1 bi bi-bookmark" viewBox="0 0 16 16">
                      <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2"/>
                  </svg>
                  Add Bookmark
                </button>
                `
                }
              </li>
            </ul>
          </div>

          <a href="${safeLink}" target="_blank" rel="noopener noreferrer">
            <div onclick="markReadStatus('${guid}', true);" style="margin:0; padding:0; width:90%">
              <b>${safeTitle}</b>
            </div>
          </a>
          <small>
            <a onclick="initLoadFeeds(ids=[${safeFeedId}])" style="cursor:pointer">
              ${shortenString(safeFeedName, 15)}
            </a>
            <br>
            ${timeSince(pubDate)} ago <span class="bookmarkIcon">${isBookmarked ? `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark-star-fill" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5M8.16 4.1a.178.178 0 0 0-.32 0l-.634 1.285a.18.18 0 0 1-.134.098l-1.42.206a.178.178 0 0 0-.098.303L6.58 6.993c.042.041.061.1.051.158L6.39 8.565a.178.178 0 0 0 .258.187l1.27-.668a.18.18 0 0 1 .165 0l1.27.668a.178.178 0 0 0 .257-.187L9.368 7.15a.18.18 0 0 1 .05-.158l1.028-1.001a.178.178 0 0 0-.098-.303l-1.42-.206a.18.18 0 0 1-.134-.098z"/>
                </svg>
              ` : ""}
            </span>
          </small>
        </div>
      </div>
    `
  let PHONE_CARD = `
    <div class="phone row mb-3" label="${guid}" style="overflow:hidden">
        <div class="col-6" onclick="markReadStatus('${guid}', true);">
          <a href="${safeLink}" target="_blank" rel="noopener noreferrer">
            <div class="position-relative">
              <div class="ratio ratio-16x9 mb-2">
                <div class="container z-1" height="100%">
                  <div class="row item-buttons position-absolute d-flex justify-content-between align-items-center" style="width:135vw; height:inherit; left:-17.5vw; transition: left .15s;">
                    <div class="bookmark-button rounded-circle bg-secondary justify-content-center align-content-center" style="width: 20%; max-width: 3.8em;aspect-ratio:1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="75%" height="75%" fill="white" class="bi bi-bookmark-fill" viewBox="0 0 16 16">
                        <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2"/>
                      </svg>
                    </div>
                    <div class="read-button p-0 m-0 rounded-circle bg-secondary justify-content-center align-content-center" style="width: 20%; max-width: 3.8em;aspect-ratio:1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="70%" height="70%" fill="white" class="bi bi-eye-fill" viewBox="0 0 16 16">
                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <img
                  src="${safeThumb}"
                  class="w-100 z-0 shadow-1-strong rounded img-fluid"
                  style="display:block; object-fit: cover"
                  alt=""
                >
              </div>
              <img
                src="${safeFeedIcon}"
                class="position-absolute m-2 img-fluid"
                style="width:15%; height:auto; top:0; left:0;"
                alt=""
              >
            </div>
          </a>
        </div>
        <div class="col-6" onclick="markReadStatus('${guid}', true);">
          <a href="${safeLink}" target="_blank" rel="noopener noreferrer">
            <p style="text-align:left; text-overflow: ellipsis; overflow: hidden;display: -webkit-box; -webkit-line-clamp: 4; line-clamp: 4; -webkit-box-orient: vertical;">
              <b>${safeTitle}</b><br>
              <small>${safeDescription}</small>
            </p>
          </a>
        </div>
      <small class="text-body-secondary" style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
        <a onclick="initLoadFeeds(ids=[${safeFeedId}])" style="cursor:pointer">
        ${shortenString(safeFeedName, 15)}</a> • ${timeSince(pubDate)} ago 
        <span class="bookmarkIcon">
          ${isBookmarked ? `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark-star-fill" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5M8.16 4.1a.178.178 0 0 0-.32 0l-.634 1.285a.18.18 0 0 1-.134.098l-1.42.206a.178.178 0 0 0-.098.303L6.58 6.993c.042.041.061.1.051.158L6.39 8.565a.178.178 0 0 0 .258.187l1.27-.668a.18.18 0 0 1 .165 0l1.27.668a.178.178 0 0 0 .257-.187L9.368 7.15a.18.18 0 0 1 .05-.158l1.028-1.001a.178.178 0 0 0-.098-.303l-1.42-.206a.18.18 0 0 1-.134-.098z"/>
            </svg>
          ` : ""}
        </span>
      </small>
      
    </div>
    
    `

  feedItem.innerHTML = `
        <div id='${safeGuid}' class='${safeGuid} ${isRead ? "text-body-tertiary" : ""}'>
          <div class="d-none d-md-block">
            ${DESKTOP_CARD}
          </div>
          <div class="d-block d-md-none">
            ${PHONE_CARD}
          </div>
        </div>
    `

  return feedItem.outerHTML
}

// Displays items that have been previously retrieved (could have been saved)
function displayItems(feedItems = allFeedItems, currentFeedLoad, bookmarksView=false) {
  // Sort items
  feedItems.sort(function (a, b) { return new Date(b[5]) - new Date(a[5]) });

  // Filter items that should be displayed based on settings
  let settings = getSettings()
  let isAllFeedsView = feedItems == allFeedItems

  // SETTING: Show unread items only & Hide Bookmarks if read (Bookmarks view)
  if (bookmarksView && settings.hideReadBookmarksView) {
    feedItems = feedItems.filter(item => !getReadStatus(item[4]))
  } else if (isAllFeedsView) {
    // SETTING: Hide Bookmarks if read (All Feeds view)
    if (settings.showUnreadOnly) feedItems = feedItems.filter(
      item => (!getReadStatus(item[4])) || (getBookmarkStatus(item[4]) && !settings.hideReadBookmarksAll)
    )

    // SETTING: Show n most recent items per feed only
    if (settings.showMostRecentOnly) {
      let feedCount = {}

      function checkCount(item) {
        if (!(item[7] in feedCount)) feedCount[item[7]] = 0
        feedCount[item[7]]++
        return feedCount[item[7]] <= settings.nMostRecent
      }

      feedItems = feedItems.filter(item => checkCount(item))
    }
  }

  // Show 'No items' screen
  document.getElementById("noItems").hidden = feedItems.length > 0

  // Display items
  curDisplayedGuids = feedItems.map(feedItem => feedItem[4])
  const feedContainerDesktop = document.getElementById('feed-container-desktop');
  const feedContainerMobile = document.getElementById('feed-container-mobile');
  feedContainerDesktop.innerHTML = '';
  feedContainerMobile.innerHTML = '';

  const chunkSize = 25;
  let index = 0;
  let loading = false;

  function renderChunk() {
    if (loading) return;
    if (currentFeedLoad != latestFeedLoad) return;
    loading = true;

    const end = Math.min(index + chunkSize, feedItems.length);
    let desktopHTML = '';
    let mobileHTML = '';

    for (; index < end; index++) {
      const item = feedItems[index];
      // console.log(item)
      desktopHTML += createFeedItem(...item);
      mobileHTML += createFeedItem(...item, "../images/default_thumbnail.svg", true);
    }

    feedContainerDesktop.insertAdjacentHTML('beforeend', desktopHTML);
    feedContainerMobile.insertAdjacentHTML('beforeend', mobileHTML);
    addTouchListeners() // Add listeners for swipes
    loading = false;
  }

  function onScroll() {
    if (currentFeedLoad != latestFeedLoad) {
      window.removeEventListener('scroll', onScroll);
      return;
    }

    const nearBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 800;

    if (nearBottom && index < feedItems.length) {
      renderChunk();
    }

    if (index >= feedItems.length) {
      window.removeEventListener('scroll', onScroll);
    }
  }

  renderChunk();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function showDescription(guid) {
  let safeGuid = escapeHTML(guid)
  window.parent.postMessage({ type: 'show-description', safeGuid: safeGuid }, '*')
}

function markReadStatus(guid, status) {
  console.log(`Marking ${guid} read status as ${status}!`)
  // Update long-term storage
  getFeedItem(guid)[8] = status
  saveFeedItems()
  let readItems = JSON.parse(localStorage.readItems)

  // Add/remove GUID (error handling for remove while not in there)
  if (status) {
    readItems.push(guid) // Add guid to list
  } else {
    readItems = readItems.filter(item => item !== guid) // Remove guid from list
  }

  // Remove duplicates
  readItems = [ ...new Set(readItems) ]

  // Store in localStorage again
  localStorage.readItems = JSON.stringify(readItems)

  // Update current display
  let safeGuid = escapeHTML(guid)
  let elems = document.getElementsByClassName(`${safeGuid.toString()}`)
  if (elems.length == 0) return

  for (let elem of elems) {
    if (status) { elem.classList.add("text-body-tertiary") }
    else { elem.classList.remove("text-body-tertiary") }
  }

  // Update button
  let readBtn = document.getElementById(safeGuid).querySelector(".readBtn")
  readBtn.innerHTML = 
  status ?
    `<button class="dropdown-item" type="button" onclick="markReadStatus('${guid}',false)">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="me-1 bi bi-eye-slash" viewBox="0 0 16 16"\>
        <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
        <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
        <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
  </svg>
  Mark as Unread
  </button>
  ` : `
  <button class="dropdown-item" type="button" onclick="markReadStatus('${guid}',true)">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="me-1 bi bi-eye" viewBox="0 0 16 16"\>
      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
  </svg>
    Mark as Read
  </button>`

  parent.updateFeedBadges()
  return
}

function markBookmarkStatus(guid, status) {
  console.log(`Marking ${guid} bookmarked status as ${status}!`)
  // Update long-term storage
  let bookmarkedItems = JSON.parse(localStorage.bookmarkedItems)

  // Add/remove GUID (error handling for remove while not in there)
  if (status) {
    bookmarkedItems.push(guid) // Add guid to list
  } else {
    bookmarkedItems = bookmarkedItems.filter(item => item !== guid) // Remove guid from list
  }

  // Remove duplicates
  bookmarkedItems = [ ...new Set(bookmarkedItems) ]

  // Store in localStorage again
  localStorage.bookmarkedItems = JSON.stringify(bookmarkedItems)

  // Update view
  let safeGuid = escapeHTML(guid)
  let elems = document.getElementsByClassName(safeGuid)
  for (let elem of elems) {
    // Update icon
    let icons = elem.querySelectorAll(".bookmarkIcon")
    for (let icon of icons) {
      icon.innerHTML =
        status ? `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark-star-fill" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5M8.16 4.1a.178.178 0 0 0-.32 0l-.634 1.285a.18.18 0 0 1-.134.098l-1.42.206a.178.178 0 0 0-.098.303L6.58 6.993c.042.041.061.1.051.158L6.39 8.565a.178.178 0 0 0 .258.187l1.27-.668a.18.18 0 0 1 .165 0l1.27.668a.178.178 0 0 0 .257-.187L9.368 7.15a.18.18 0 0 1 .05-.158l1.028-1.001a.178.178 0 0 0-.098-.303l-1.42-.206a.18.18 0 0 1-.134-.098z"/>
            </svg>
          ` : ""
    }

    // Update button
    let bookmarkBtn = elem.querySelector(".bookmarkBtn")
    bookmarkBtn.innerHTML =  // I just realized that this is really dumb because the only differences between these strings is a boolean and status is already a bool
      status ?
        `
          <button class="dropdown-item" type="button" onclick="markBookmarkStatus('${guid}',false)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="me-1 bi bi-bookmark" viewBox="0 0 16 16">
              <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z"/>
            </svg>
            Delete Bookmark
          </button>
        ` : `
          <button class="dropdown-item" type="button" onclick="markBookmarkStatus('${guid}',true)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="me-1 bi bi-bookmark" viewBox="0 0 16 16">
                <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2"/>
            </svg>
            Add Bookmark
          </button>
        `
  }
  
  return
}

function updateItemButtonsPhone(guid, distance, startX, activationThreshold) {
  let elems = document.getElementsByClassName(guid)
  
  for (let feedItemElem of elems) {
    let buttonsElem = feedItemElem.getElementsByClassName("item-buttons")[0]
    let bookmarkBtn = feedItemElem.getElementsByClassName("bookmark-button")[0]
    let readBtn = feedItemElem.getElementsByClassName("read-button")[0]
    
    // Move the buttons 'distance' distance across x-axis
    buttonsElem.style.setProperty("left",  `
      ${ distance < 0 ?
        Math.max(
          startX + distance,
          startX -activationThreshold
        ) :
        Math.min(
          startX + distance,
          startX + activationThreshold
        )
      }px`)


    // Give both buttons color when Math.abs(distance) > activationThreshold
    if (Math.abs(distance) > activationThreshold) {
      bookmarkBtn.classList.remove(getBookmarkStatus(guid) ? "bg-warning" : "bg-secondary")
      bookmarkBtn.classList.add(getBookmarkStatus(guid) ? "bg-secondary" : "bg-warning")
      readBtn.classList.remove(getReadStatus(guid) ? "bg-primary" : "bg-secondary")
      readBtn.classList.add(getReadStatus(guid) ? "bg-secondary" : "bg-primary")
    } else {
      bookmarkBtn.classList.remove(getBookmarkStatus(guid) ? "bg-secondary" : "bg-warning")
      bookmarkBtn.classList.add(getBookmarkStatus(guid) ? "bg-warning" : "bg-secondary")
      readBtn.classList.remove(getReadStatus(guid) ? "bg-secondary" : "bg-primary")
      readBtn.classList.add(getReadStatus(guid) ? "bg-primary" : "bg-secondary")
    }
  }
  return distance
}


// Hide 'Mark all as read' collapse when not interacting with it
document.addEventListener('click', parent.closeMarkAllAsReadCollapse);
document.addEventListener('scroll', parent.closeMarkAllAsReadCollapse);
document.addEventListener('touchmove', parent.closeMarkAllAsReadCollapse);