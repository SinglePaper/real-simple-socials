const frame = document.getElementById("frame");
const colorModeBtn = document.getElementById("colorModeBtn");
let curColorMode = document.documentElement.getAttribute("data-bs-theme");
colorModeBtn.innerHTML =
    localStorage.getItem("colorMode") == "dark" ? darkModeIcon : lightModeIcon;

frame.addEventListener("load", () => {
    frame.contentWindow.postMessage(
        {
            type: "set-theme",
            theme: document.documentElement.getAttribute("data-bs-theme"),
        },
        "*",
    );
});

function toggleColorMode() {
    curColorMode = document.documentElement.getAttribute("data-bs-theme");
    localStorage.setItem("colorMode", curColorMode == "dark" ? null : "dark");
    document.documentElement.setAttribute(
        "data-bs-theme",
        localStorage.getItem("colorMode"),
    );
    frame.contentWindow.postMessage(
        { type: "set-theme", theme: localStorage.getItem("colorMode") },
        "*",
    );
    colorModeBtn.innerHTML =
        localStorage.getItem("colorMode") == "dark" ? darkModeIcon : lightModeIcon;
}

// From GeeksForGeeks
function copyUrlToClipboard() {
    // Get the text field
    var copyText = document.getElementById("editModalFeedUrl");

    // Select the text field
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);
}
