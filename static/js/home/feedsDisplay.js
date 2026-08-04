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
          <a onclick="markReadStatus('${guid}', true);" href="${safeLink}" target="_blank" rel="noopener noreferrer">
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

            <b>${safeTitle}</b><br>
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