async function lazyStreamPlay() {
    let queryOptions = {active: true, currentWindow: true};
    let [tab] = await chrome.tabs.query(queryOptions);

    if (tab.url.includes("netflix.com/watch")) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["netflixSkipScript.js"]
        });
    }
    else {
        alert("Please start watching a video to start the extension.");
    }
}

document.getElementById("start-skip").addEventListener("click", lazyStreamPlay);
