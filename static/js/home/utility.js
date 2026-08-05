// Source - https://stackoverflow.com/a/3177838
// Posted by Sky Sanders, modified by community. See post 'Timeline' for change history
// Retrieved 2026-05-23, License - CC BY-SA 4.0

function timeSince(date) {
  date = new Date(date)
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (Math.floor(interval) == 1) {
    return Math.floor(interval) + " year";
  }
  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (Math.floor(interval) == 1) {
    return Math.floor(interval) + " month";
  }
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (Math.floor(interval) == 1) {
    return Math.floor(interval) + " day";
  }
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (Math.floor(interval) == 1) {
    return Math.floor(interval) + " hour";
  }
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (Math.floor(interval) == 1) {
    return Math.floor(interval) + " minute";
  }
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }

  if (Math.floor(seconds) == 1) {
    return Math.floor(seconds) + " second";
  }
  return Math.floor(seconds) + " seconds";
}

// Source - https://stackoverflow.com/a/27778372
// Posted by Per Kristian, modified by community. See post 'Timeline' for change history
// Retrieved 2026-05-23, License - CC BY-SA 4.0

function getBaseUrl(url) {
    var re = new RegExp(/^.*\//);
    return re.exec(url);
}

function removeHTML(text) {
  return text.replace(/<[^>]*>/g, ' ')
}

function escapeHTML(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function safeURL(value) {
  try {
    const u = new URL(String(value), window.location.origin);
    if (u.protocol === 'http:' || u.protocol === 'https:') return u.href;
  } catch (e) {}
  return '#';
}

function shortenString(string, n){
  let splitString = string.split(" ")
  if (splitString.length <= n) return string
  return splitString.slice(0,n).join(" ") + "..."
}

function extractFirstUrl(str) {
  const match = str.match(/https?:\/\/[^\s<>"']+/i);
  return match ? match[0] : '';
}

function getFeedItem(targetGuid, copy = false) {
  console.log(targetGuid)
  const feedItem = allFeedItems.find(f => f[4] === targetGuid)
  console.log(feedItem)
  if (!feedItem) return null;
  return copy ? [ ...feedItem ] : feedItem
}

function saveFeedItems() {
  localStorage.allFeedItems = JSON.stringify(allFeedItems)
}

function getReadStatus(guid) {
  let readItems = JSON.parse(localStorage.readItems)
  return readItems.includes(guid)
}

function getBookmarkedStatus(guid) {
  let bookmarkedItems = JSON.parse(localStorage.bookmarkedItems)
  return bookmarkedItems.includes(guid)
}