iframeElem.addEventListener('load', () => {
    refreshFeeds()
});

window.addEventListener('message', (e) => {
    if (e.data?.type === 'populate-feeds-menu') {
      populateFeedsMenu(feedList)
    }
    if (e.data?.type === 'show-description') {
      console.log(`Showing description... (${e.data?.safeGuid})`)
      updateDescriptionModal(e.data?.safeGuid)
      new bootstrap.Modal(document.querySelector("#descriptionModal")).show()
    }
});