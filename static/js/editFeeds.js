// Updates add feed form when source is chosen
async function updateEditFeedForm(feedId) {
    let feed = getFeed(feedId)
    document.getElementById("editFeedModal").setAttribute("label", feedId)
    console.log(feed)
    document.querySelectorAll(`#editFeedFormInputs div`).forEach(b => b.hidden=true);
    document.querySelectorAll(`#editFeedFormInputs .all`).forEach(b => b.hidden=false);
    document.querySelectorAll(`#editFeedFormInputs .${feed.source.toLowerCase()}`).forEach(b => b.hidden=false);
    console.log(document.querySelectorAll(`#editFeedFormInputs .${feed.source.toLowerCase()}`))
    if (feed.type == "playlist") document.querySelectorAll(`#editFeedFormInputs .youtubeShorts`).forEach(b => b.hidden=true);

    // Populate feed folders dropdown
    let foldersElem = document.getElementById("editFeedFolders")
    foldersElem.innerHTML = ""

    // Add root folder option
    let optionElem = document.createElement("option") // <option value="0">...</option>
    optionElem.value = -1
    optionElem.textContent = "Root folder"
    foldersElem.appendChild(optionElem)

    JSON.parse(localStorage.feedList).folders.forEach(
        folder => {
            let optionElem = document.createElement("option") // <option value="0">...</option>
            optionElem.value = folder.id
            optionElem.textContent = folder.name
            foldersElem.appendChild(optionElem)
        })
    
    foldersElem.value = getFeedLocation(feedId) // Make current selection current folder

    // Update name field
    let nameInput = document.querySelector("#editFeedFormInputs div.all .name")
    nameInput.value = feed.name
    let urlInput = document.querySelector("#editFeedFormInputs div.all .url")
    urlInput.value = feed.url
    if (feed.source == "YouTube") {
        let editCheckShorts = document.getElementById("editCheckShorts")
        editCheckShorts.checked = feed.includeShorts
    }
    if (feed.source == "Nebula") {
        let editCheckPlus = document.getElementById("editCheckPlus")
        editCheckPlus.checked = feed.plusOnly
    }



    let saveFeedBtn = document.getElementById("editFeedBtn")
    const inputs = document.querySelectorAll(`#editFeedFormInputs div.all .name`);

    const check = () => {
        saveFeedBtn.disabled = [...inputs].some(input => input.value.trim() == "");
    };

    inputs.forEach(input => {
        input.addEventListener("keyup", check);
        input.addEventListener("change", check);
    });

    check();

    // // Show form
    // document.getElementById('addFeedForm').hidden = false
}

function editFeed(feedId) {
    feedId = parseInt(feedId)
    let feed = getFeed(parseInt(feedId))
    feed.name = document.querySelector(`#editFeedFormInputs input.name`).value;
    if ("includeShorts" in feed) {
        feed.includeShorts = document.querySelector(`#editCheckShorts`).checked
        feed.url = feed.includeShorts ? feed.urlShorts : feed.urlNoShorts
    }
    if ("plusOnly" in feed) {
        feed.plusOnly = document.querySelector(`#editCheckPlus`).checked
        feed.url = feed.plusOnly ? feed.urlPlus : feed.urlAll
    }

    // Edit folder
    let selectedFolder = parseInt(document.querySelector(`#editFeedFolders`).value)
    if (selectedFolder != getFeedLocation(feedId)) { moveFeed(feedId, selectedFolder) }

    iframeElem.contentWindow.clearFeedItems(feedId)
    refreshFeeds()
}