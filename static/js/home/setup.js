let targetFeeds;

if (!localStorage.readItems) { localStorage.readItems = JSON.stringify([]) }
if (!localStorage.bookmarkedItems) { localStorage.bookmarkedItems = JSON.stringify([]) }
if (!localStorage.allFeedItems) { localStorage.allFeedItems = JSON.stringify([]) }
let allFeedItems = JSON.parse(localStorage.allFeedItems)
let targetFeedItems = []
let latestFeedLoad; // This will be used to cancel loading a feed(s) overview if a new view is requested (e.g. first loading all feeds and then clicking on one specific feed.)

window.addEventListener('message', (e) => {
    if (e.data?.type === 'load-feeds') {
      initLoadFeeds(e.data?.ids !== undefined && !JSON.parse(e.data?.ids).isTrusted ? JSON.parse(e.data?.ids) : [])
    }
    if (e.data?.type === 'load-bookmarks') {
      loadBookmarks()
    }
});
