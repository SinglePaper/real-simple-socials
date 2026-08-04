document.getElementById('opmlBtn').addEventListener('click', openDialog);

function openDialog() {
  document.getElementById('opmlFile').click();
}

document.getElementById('opmlFile').addEventListener('change', handleUpload);
function handleUpload() {
  const reader = new FileReader();
  reader.onload = (e) => {
    importOPML(e.target.result)
  }
  reader.readAsText(this.files[0])
}

function downloadOPML() {
  console.log("Downloading OPML...")
  console.log(feedList)
  function makeStringSafe(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  let opmlString = `\
<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>Subscriptions</title>
  </head>
  <body>  
  `

  feedList.folders.forEach(folder => {
    opmlString += `\
      <outline title="${makeStringSafe(folder.name)}" text="${makeStringSafe(folder.name)}">
    `

    folder.feeds.forEach(feed => {
      opmlString += `\
        <outline title="${makeStringSafe(feed.name)}" text="${makeStringSafe(feed.name)}" type="rss" xmlUrl="${feed.url}" htmlUrl="${feed.url}"/>
      `
    });

    opmlString += `\
      </outline>
    `
  });

  feedList.root.forEach(feed => {
    opmlString += `\
      <outline title="${makeStringSafe(feed.name)}" text="${makeStringSafe(feed.name)}" type="rss" xmlUrl="${feed.url}" htmlUrl="${feed.url}"/>
    `
  });


  opmlString += `\
  </body>
</opml>
  `
  const blob = new Blob([opmlString], { type: "text/opml" });

  // Create a temporary URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create an <a> element
  const a = document.createElement("a");
  a.href = url;
  a.download = `feedslist-${Date.now()}.opml`; // Filename

  // Append to the DOM (required for older browsers)
  document.body.appendChild(a);

  // Trigger the download
  a.click();

  // Cleanup: Revoke the temporary URL and remove the element
  URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

function downloadLocalStorage() {
  const blob = new Blob([JSON.stringify(localStorage)], { type: "text/plain" });

  // Create a temporary URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create an <a> element
  const a = document.createElement("a");
  a.href = url;
  a.download = `localStorage-${Date.now()}.opml`; // Filename

  // Append to the DOM (required for older browsers)
  document.body.appendChild(a);

  // Trigger the download
  a.click();

  // Cleanup: Revoke the temporary URL and remove the element
  URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

// This functions will import feeds from a provided OPML file from the user's device
function importOPML(opmlString) {
    // Parse OPML string
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(opmlString, "application/xml");
    const items = xmlDoc.querySelector("body").children
    let nextId = getMaxId(feedList)+1

    // Loop over main Elements (either folders or root feeds)
    for (let i in items) {
        let item = items[i]
        if (!(item instanceof Element)) continue

        // Root feeds
        if (item.attributes.getNamedItem("type") && item.attributes.getNamedItem("type").value == "rss") {
            // Add feeds to root
            feedList.root.push(
                {
                    name: item.attributes.title.value,
                    id: nextId,
                    url: item.attributes.xmlUrl.value
                }
            )
            nextId++

        } else { // Folders
            // Create new folder
            let folder = {
                name: item.attributes.title.value,
                id: nextId,
                feeds: []
            }
            nextId++
            
            // Add feeds to folder
            let feeds = item.querySelectorAll("outline")
            feeds.forEach(feed => {
                let feedInfo = {
                    name: feed.attributes.title.value,
                    id: nextId,
                    url: feed.attributes.xmlUrl.value
                }
                folder.feeds.push(feedInfo)
                nextId++
            })

            // Add folder to list
            feedList.folders.push(folder)
        }
    }
    refreshFeeds()
}