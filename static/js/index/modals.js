// Updates feed modal when menu is opened
function updateFeedModal(id) {
    let feed = getFeed(id)
    let feedModalElem = document.getElementById("editFeedModal")
    let feedModalLabelElem = document.getElementById("editFeedModalLabel")
    let feedModalBodyElem = document.getElementById("editFeedModalBody")
    feedModalLabelElem.textContent = feed.name
    feedModalElem.setAttribute("label", id)
    console.log("Opened modal for feed", id)
}

// Updates feed modal when menu is opened
function updateFolderModal(id) {
    let folderInfo = getFolder(id) // id, name, feeds
    // console.log(folderInfo)
    let folderModalElem = document.getElementById("editFolderModal")
    let folderModalLabelElem = document.getElementById("editFolderModalLabel")
    let folderModalNameElem = document.getElementById("editFolderNameInput")
    folderModalNameElem.value = folderInfo.name
    folderModalElem.setAttribute("label", id)
    console.log("Opened modal for folder", id)
}

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

async function updateAddFeedForm(source, btn) {
    document.querySelectorAll('#sourcePicker .source-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll(`#addFeedFormInputs div`).forEach(b => b.hidden=true);
    document.querySelectorAll(`#addFeedFormInputs .${source}`).forEach(b => b.hidden=false);

    // Populate feed folders dropdown
    let foldersElem = document.getElementById("addFeedFolders")
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


    // Populate Dropout sources
    let dropoutSourcesElem = document.getElementById("selectDropoutSources")
    dropoutSourcesElem.innerHTML = ""
    $.getJSON('https://singlepaper.github.io/dropout-rss/feeds.json', function(data) {
        // Sort the sources alphabetically (except "All Releases", which should always be first!)
        let sources = Object.entries(data)
        sources.sort(function(a, b) {
            if (a[0] === "All Releases") return -1;
            if (b[0] === "All Releases") return 1;
            return a[0].localeCompare(b[0]);
        });
        
        // Add options to dropdown menu
        for (const [name, url] of sources) {
            let optionElem = document.createElement("option") // <option value="0">...</option>
            optionElem.value = url
            optionElem.textContent = name.replace(/\b\w/, (c) => c.toUpperCase())
            dropoutSourcesElem.appendChild(optionElem)
        }
    });

    document.getElementById("addFeedBtn").onclick = async function () {
        switch (source) {
            case "youtube": await addYouTubeFeed(); break
            case "dropout": await addDropoutFeed(); break
            case "nebula": await addNebulaFeed(); break
            case "twitch": await addTwitchFeed(); break
            case "bluesky": await addBlueskyFeed(); break
            case "other": await addOtherFeed(); break
        }
    }

    // Enable/Disable the confirmed 'Add' button when appropriate
    const addFeedBtn = document.getElementById("addFeedBtn") 
    const inputs = document.querySelectorAll(`div.${source} .url`);
    inputs.forEach(function (input) {
        input.value = ""
    })
    
    const check = () => {
        addFeedBtn.disabled = [...inputs].some(input => input.value.trim() === "");
    };

    inputs.forEach(input => {
        input.addEventListener("keyup", check);
        input.addEventListener("change", check);
    });

    check();

    // Show form
    document.getElementById('addFeedForm').hidden = false
}

function updateDescriptionModal(safeGuid) {
    let feedItem = iframeElem.contentWindow.getFeedItem(safeGuid) // Is this function in index?
    let descriptionModalBodyElem = document.getElementById("descriptionModalBody")
    descriptionModalBodyElem.innerHTML = `
        ${feedItem[2]}
    `
}

function updateSettingsModal() {
    let settingsElem = document.getElementById("settingsModalBody")
    let settings = getSettings()
    
    settingsElem.querySelector('#checkMostRecent').checked = settings['showMostRecentOnly']
    settingsElem.querySelector('#nMostRecent').value = settings['nMostRecent']
    settingsElem.querySelector('#checkUnreadOnly').checked = settings['showUnreadOnly']
    settingsElem.querySelector('#checkHideButton').checked = settings['hideButton']

    settingsElem.querySelector('#checkHideReadBookmarksAll').checked = settings['hideReadBookmarksAll']
    settingsElem.querySelector('#checkHideReadBookmarksView').checked = settings['hideReadBookmarksView']
    settingsElem.querySelector('#checkPreventBookmarkDeletion').checked = settings['preventBookmarkDeletion']
}