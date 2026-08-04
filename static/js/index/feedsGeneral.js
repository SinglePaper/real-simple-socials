iframeElem.addEventListener('load', () => {
    refreshFeeds()
});

window.addEventListener('message', (e) => {
    if (e.data?.type === 'populate-feeds-menu') {
      populateFeedsMenu(feedList)
    }
});