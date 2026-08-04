function createFeedItem(title, feedTitle, description, link, guid, pubDate, feedIcon, feedId, isRead = false, thumbnail = "../images/default_thumbnail_720p.png", mobile = false) {
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

  let DESKTOP_CARD = `
      <div class="mb-4">
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

            <div class="dropdown position-absolute img-fluid" style="width:15%; height:auto;right:0">
            
              <button class="btn border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" style="width:1em;right:0" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
                </svg>
              </button>
              <ul class="dropdown-menu">
                <li><button class="dropdown-item" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="me-1 bi bi-justify-left" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/>
                  </svg>
                  Description
                </button></li>
                <li><button class="dropdown-item" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="me-1 bi bi-eye" viewBox="0 0 16 16">
                      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                  </svg>
                  Mark as Read
                </button></li>
                <li><button class="dropdown-item" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="me-1 bi bi-bookmark-star" viewBox="0 0 16 16">
                    <path d="M7.84 4.1a.178.178 0 0 1 .32 0l.634 1.285a.18.18 0 0 0 .134.098l1.42.206c.145.021.204.2.098.303L9.42 6.993a.18.18 0 0 0-.051.158l.242 1.414a.178.178 0 0 1-.258.187l-1.27-.668a.18.18 0 0 0-.165 0l-1.27.668a.178.178 0 0 1-.257-.187l.242-1.414a.18.18 0 0 0-.05-.158l-1.03-1.001a.178.178 0 0 1 .098-.303l1.42-.206a.18.18 0 0 0 .134-.098z"/>
                    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z"/>
                  </svg>
                  Add to Favorites
                </button></li>
              </ul>
            </div>
            <div onclick="markReadStatus('${guid}', true);" style="margin:0; padding:0; width:90%">
              <b>${safeTitle}</b>
            </div>
          </a>
          <small><a onclick="initLoadFeeds(ids=[${safeFeedId}])" style="cursor:pointer">${shortenString(safeFeedName, 15)}</a><br>${timeSince(pubDate)} ago</small>
        </div>
      </div>
    `
  let PHONE_CARD = `
    <div class="row mb-3">
        <div class="col-6" onclick="markReadStatus('${guid}', true);">
          <a href="${safeLink}" target="_blank" rel="noopener noreferrer">
            <div class="position-relative">
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
        <a onclick="initLoadFeeds(ids=[${safeFeedId}])" style="cursor:pointer">${shortenString(safeFeedName, 15)}</a> • ${timeSince(pubDate)} ago
      </small>
      
    </div>
    
    `

  feedItem.innerHTML = `
        <div class='${safeGuid} ${isRead ? "text-body-tertiary" : ""}'>
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
function displayItems(feedItems = allFeedItems, currentFeedLoad) {
  feedItems.sort(function (a, b) { return new Date(b[5]) - new Date(a[5]) });

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
      mobileHTML += createFeedItem(...item, "../images/default_thumbnail_720p.png", true);
    }

    feedContainerDesktop.insertAdjacentHTML('beforeend', desktopHTML);
    feedContainerMobile.insertAdjacentHTML('beforeend', mobileHTML);

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

function markReadStatus(guid, status) {
  // Update long-term storage
  getFeedItem(guid)[8] = status
  saveFeedItems()

  // Update current display
  let safeGuid = escapeHTML(guid)
  let elems = document.getElementsByClassName(`${safeGuid.toString()}`)
  console.log(elems)
  for (let elem of elems) {
    if (status) { elem.classList.add("text-body-tertiary") }
    else { elem.classList.remove("text-body-tertiary") }
    console.log(elem)
  }
  return
}