const feedsMenuElem = document.getElementById("feedsMenu")
const iframeElem = document.getElementById("frame")
let feedList = {
    "folders": [],
    "root": []
}

if (localStorage.getItem("feedList") === null) { 
  localStorage.setItem("feedList", JSON.stringify(feedList)) 
  
  let tutorialFeed = {
        source: "Other",
        name: "Tutorial",
        url: `${window.location.protocol}//${window.location.host}/feed`,
        id: 0
    }
  
  addFeed(tutorialFeed)
}
feedList = JSON.parse(localStorage.getItem("feedList"))

function populateFeedsMenu(feedList) {
  feedsMenuElem.replaceChildren();

  // Home
  const topUl = document.createElement("ul");
  topUl.className = "list-group";

  const homeLi = document.createElement("li");
  homeLi.className = "list-group-item d-flex justify-content-left align-items-center border-0";

  homeLi.insertAdjacentHTML(
    "beforeend",
    `<svg class="me-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 1em; height: 1em;"><path fill="currentColor" d="M19.469 12.594l3.625 3.313c0.438 0.406 0.313 0.719-0.281 0.719h-2.719v8.656c0 0.594-0.5 1.125-1.094 1.125h-4.719v-6.063c0-0.594-0.531-1.125-1.125-1.125h-2.969c-0.594 0-1.125 0.531-1.125 1.125v6.063h-4.719c-0.594 0-1.125-0.531-1.125-1.125v-8.656h-2.688c-0.594 0-0.719-0.313-0.281-0.719l10.594-9.625c0.438-0.406 1.188-0.406 1.656 0l2.406 2.156v-1.719c0-0.594 0.531-1.125 1.125-1.125h2.344c0.594 0 1.094 0.531 1.094 1.125v5.875z"/></svg>`
  );

  const homeLink = document.createElement("a");
  homeLink.style.cursor = "pointer";
  homeLink.textContent = "All Feeds";
  homeLink.onclick = loadSubsetFeeds;
  homeLi.appendChild(homeLink);
  topUl.appendChild(homeLi);

  // Bookmarks
  const bookmarksUl = document.createElement("ul");
  bookmarksUl.className = "list-group";

  const bookmarksLi = document.createElement("li");
  bookmarksLi.className = "list-group-item d-flex justify-content-left align-items-center border-0";

  bookmarksLi.insertAdjacentHTML(
    "beforeend",
    `<svg class="me-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark-fill" viewBox="0 0 16 16">
      <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2"/>
    </svg>`  
  );

  const bookmarksLink = document.createElement("a");
  bookmarksLink.style.cursor = "pointer";
  bookmarksLink.textContent = "Bookmarks";
  bookmarksLink.onclick = loadBookmarks;
  bookmarksLi.appendChild(bookmarksLink);
  topUl.appendChild(bookmarksLi);
  feedsMenuElem.appendChild(topUl);

  // Folders
  const folderElem = document.createElement("div");
  folderElem.classList.add("accordion", "accordion-flush", "mb-1", "w-100");

  for (const folder of feedList.folders) {
    const folderSafe = safeId(folder.name);
    const btnId = `${folderSafe}_btn_${folder.id}`;
    const collapseId = `${folderSafe}_${folder.id}`;

    const item = document.createElement("div");
    item.className = "accordion-item";

    const h2 = document.createElement("h2");
    h2.className = "accordion-header";

    const btn = document.createElement("button");
    btn.id = btnId;
    btn.className = "accordion-button collapsed shadow-none";
    btn.type = "button";
    btn.setAttribute("data-bs-toggle", "collapse");
    btn.setAttribute("data-bs-target", `#${collapseId}`);
    btn.setAttribute("aria-expanded", "false");

    const title = document.createElement("div");
    title.className = "flex-grow-1";
    title.onmouseenter = () => btn.setAttribute("data-bs-toggle", "");
    title.onmouseleave = () => btn.setAttribute("data-bs-toggle", "collapse");
    title.onclick = () => loadSubsetFeeds(folder.feeds.map(feed => feed.id));
    title.textContent = folder.name;
    btn.appendChild(title);

    const editLink = document.createElement("a");
    editLink.className = "flex-shrink-0 me-2";
    editLink.style.cursor = "pointer";
    editLink.setAttribute("data-bs-toggle", "modal");
    editLink.setAttribute("data-bs-target", "#editFolderModal");
    editLink.onmouseenter = () => btn.setAttribute("data-bs-toggle", "");
    editLink.onmouseleave = () => btn.setAttribute("data-bs-toggle", "collapse");
    editLink.onclick = () => updateFolderModal(folder.id);
    editLink.insertAdjacentHTML(
      "beforeend",
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="1em" width="1em" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path fill="currentColor" d="M9.5 13a1.5 1.5 0 1 1-3 0zm0-5a1.5 1.5 0 1 1-3 0zm0-5a1.5 1.5 0 1 1-3 0z"/></svg>`
    );
    btn.appendChild(editLink);

    h2.appendChild(btn);
    item.appendChild(h2);

    const collapse = document.createElement("div");
    collapse.id = collapseId;
    collapse.className = "accordion-collapse collapse";
    collapse.setAttribute("data-bs-parent", "#accordionFlushExample");

    const ul = document.createElement("ul");
    ul.className = "list-group";
    ul.style.width = "95%";
    ul.style.marginLeft = "5%";

    for (const feedInfo of folder.feeds) {
      const feed = getFeed(feedInfo.id);

      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center border-0";

      const img = document.createElement("img");
      img.src = feed.icon || "";
      img.className = "me-2";
      img.style.width = "1rem";
      img.style.height = "auto";
      img.alt = "";

      const wrap = document.createElement("div");
      wrap.className = "flex-grow-1";
      wrap.style.textOverflow = "ellipsis";
      wrap.style.overflow = "hidden";
      wrap.style.display = "-webkit-box";
      wrap.style.webkitLineClamp = "1";
      wrap.style.webkitBoxOrient = "vertical";

      const a = document.createElement("a");
      a.style.cursor = "pointer";
      a.textContent = feed.name;
      a.onclick = () => loadSubsetFeeds([feed.id]);

      const badge = document.createElement("span");
      badge.className = `badge text-bg-primary rounded-pill ${!feed.nItems ? "d-none" : ""}`;
      badge.textContent = String(feed.nItems || "");

      const more = document.createElement("a");
      more.className = "flex-shrink-0 ms-2";
      more.style.cursor = "pointer";
      more.setAttribute("data-bs-toggle", "modal");
      more.setAttribute("data-bs-target", "#editFeedModal");
      more.onclick = () => updateEditFeedForm(feed.id);
      more.insertAdjacentHTML(
        "beforeend",
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="1em" width="1em" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path fill="currentColor" d="M9.5 13a1.5 1.5 0 1 1-3 0zm0-5a1.5 1.5 0 1 1-3 0zm0-5a1.5 1.5 0 1 1-3 0z"/></svg>`
      );

      wrap.appendChild(a);
      li.appendChild(img);
      li.appendChild(wrap);
      li.appendChild(badge);
      li.appendChild(more);
      ul.appendChild(li);
    }

    collapse.appendChild(ul);
    item.appendChild(collapse);
    folderElem.appendChild(item);
  }

  // Root feeds
  const rootUl = document.createElement("ul");
  rootUl.className = "list-group";

  for (const feedInfo of feedList.root) {
    const feed = getFeed(feedInfo.id);
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center border-0";

    const img = document.createElement("img");
    img.src = feed.icon || "";
    img.className = "me-2";
    img.style.width = "1rem";
    img.style.height = "auto";
    img.alt = "";

    const wrap = document.createElement("div");
    wrap.className = "flex-grow-1";
    wrap.style.textOverflow = "ellipsis";
    wrap.style.overflow = "hidden";
    wrap.style.display = "-webkit-box";
    wrap.style.webkitLineClamp = "1";
    wrap.style.webkitBoxOrient = "vertical";

    const a = document.createElement("a");
    a.style.cursor = "pointer";
    a.textContent = feed.name;
    a.onclick = () => loadSubsetFeeds([feed.id]);

    const badge = document.createElement("span");
    badge.className = `badge text-bg-primary rounded-pill ${!feed.nItems ? "d-none" : ""}`;
    badge.textContent = String(feed.nItems || "");

    const more = document.createElement("a");
    more.className = "flex-shrink-0 ms-2";
    more.style.cursor = "pointer";
    more.setAttribute("data-bs-toggle", "modal");
    more.setAttribute("data-bs-target", "#editFeedModal");
    more.onclick = () => updateEditFeedForm(feed.id);
    more.insertAdjacentHTML(
      "beforeend",
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="1em" width="1em" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path fill="currentColor" d="M9.5 13a1.5 1.5 0 1 1-3 0zm0-5a1.5 1.5 0 1 1-3 0zm0-5a1.5 1.5 0 1 1-3 0z"/></svg>`
    );

    wrap.appendChild(a);
    li.appendChild(img);
    li.appendChild(wrap);
    li.appendChild(badge);
    li.appendChild(more);
    rootUl.appendChild(li);
  }

  // Add feed button
  const addFeedUl = document.createElement("ul");
  addFeedUl.className = "list-group";

  const addFeedLi = document.createElement("li");
  addFeedLi.className = "list-group-item d-flex justify-content-left align-items-center border-0";
  addFeedLi.insertAdjacentHTML(
    "beforeend",
    `<svg class="me-2" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="4 2 16 20"><path fill="currentColor" d="m19.74 7.33l-4.44-5a1 1 0 0 0-.74-.33h-8A2.53 2.53 0 0 0 4 4.5v15A2.53 2.53 0 0 0 6.56 22h10.88A2.53 2.53 0 0 0 20 19.5V8a1 1 0 0 0-.26-.67M14 15h-1v1a1 1 0 0 1-2 0v-1h-1a1 1 0 0 1 0-2h1v-1a1 1 0 0 1 2 0v1h1a1 1 0 0 1 0 2m.71-7a.79.79 0 0 1-.71-.85V4l3.74 4Z"/></svg>`
  );

  const addFeedLink = document.createElement("a");
  addFeedLink.style.cursor = "pointer";
  addFeedLink.textContent = "Add Feed";
  addFeedLink.setAttribute("onclick", "document.querySelectorAll('#sourcePicker .source-btn').forEach(b => {b.classList.remove('active'); b.disabled = true; window.setTimeout(()=>{b.disabled = false},500)}); document.getElementById('addFeedForm').hidden = true;")
  addFeedLink.setAttribute("data-bs-toggle", "modal");
  addFeedLink.setAttribute("data-bs-target", "#addFeedModal");
  addFeedLi.appendChild(addFeedLink);
  addFeedUl.appendChild(addFeedLi);

  // Add folder button
  const addFolderUl = document.createElement("ul");
  addFolderUl.className = "list-group";

  const addFolderLi = document.createElement("li");
  addFolderLi.className = "list-group-item d-flex justify-content-left align-items-center border-0";
  addFolderLi.insertAdjacentHTML(
    "beforeend",
    `<svg class="me-2" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="4 2 16 20"><path fill="currentColor" d="M19.5 7.05h-7L9.87 3.87a1 1 0 0 0-.77-.37H4.5A2.47 2.47 0 0 0 2 5.93v12.14a2.47 2.47 0 0 0 2.5 2.43h15a2.47 2.47 0 0 0 2.5-2.43V9.48a2.47 2.47 0 0 0-2.5-2.43M14 15h-1v1a1 1 0 0 1-2 0v-1h-1a1 1 0 0 1 0-2h1v-1a1 1 0 0 1 2 0v1h1a1 1 0 0 1 0 2"/></svg>`
  );

  const addFolderLink = document.createElement("a");
  addFolderLink.style.cursor = "pointer";
  addFolderLink.textContent = "Add Folder";
  addFolderLink.setAttribute("data-bs-toggle", "modal");
  addFolderLink.setAttribute("data-bs-target", "#addFolderModal");
  addFolderLink.onclick = () => {
    document.getElementById("newFolderNameInput").value = "";
    document.getElementById("addFolderBtn").disabled = true;
  };
  addFolderLi.appendChild(addFolderLink);
  addFolderUl.appendChild(addFolderLi);

  feedsMenuElem.appendChild(topUl);
  feedsMenuElem.appendChild(folderElem);
  feedsMenuElem.appendChild(rootUl);
  feedsMenuElem.appendChild(addFeedUl);
  feedsMenuElem.appendChild(addFolderUl);
}