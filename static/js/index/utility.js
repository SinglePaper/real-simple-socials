// Find the maximum ID used in the feedList
function getMaxId(feedList) {
  if (feedList.folders.length === 0 && feedList.root.length === 0) return -1
  return Math.max(
    ...feedList.folders.map(f => f.id),
    ...feedList.folders.flatMap(f => f.feeds.map(feed => feed.id)),
    ...feedList.root.map(feed => feed.id)
  );
}

function safeId(value) {
  return String(value).replace(/[^\w-]/g, "");
}

function getFeed(targetId, copy = false) {
  const feed =
    feedList.root.find(f => f.id === targetId) ??
    feedList.folders.flatMap(folder => folder.feeds).find(f => f.id === targetId);

  if (!feed) return null;
  return copy ? { ...feed } : feed;
}

function getFolder(targetId, copy = false) {
  const folder =
    feedList.folders.find(f => f.id === targetId);

  if (!folder) return null;
  return copy ? { ...folder } : folder;
}

function getFeedLocation(feedId) {
  const rootFeed = feedList.root.find(f => f.id === feedId);
  if (rootFeed) return -1;

  const folder = feedList.folders.find(folder =>
    folder.feeds.some(feed => feed.id === feedId)
  );

  return folder ? folder.id : null;
}

async function getFeedName(url) {
    return await document.getElementById("frame").contentWindow.fetchRSS({
        "url": url
    }, nameOnly=true)
}

// (Code from edebu on GitHub: https://github.com/edebu/youtube-channel-id-finder)
async function fetchChannelId(url) {
    const response = await fetch('/api/get-channel-id', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
    });

    const data = await response.json();

    if (!response.ok) {
        // Throw error to be caught by the catch block
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    return data.channelId
}