async function checkObserverActive(tab, requestAction) {
  try {
    // Send a message to the content script to see if the observer is already active
    const observerStatus = await new Promise((resolve) => {
      chrome.tabs.sendMessage(
        tab.id,
        { action: "observerStatus" },
        (response) => {
          if (chrome.runtime.lastError) {
            resolve(null);
          } else {
            resolve(response);
          }
        }
      );
    });

    return (
      (observerStatus.status === "observerOnline" &&
        requestAction === "stopSkip") ||
      (observerStatus.status === "observerOffline" &&
        requestAction === "startSkip")
    );
  } catch (err) {
    chrome.runtime.sendMessage({
      type: "error",
      message:
        "Error -  try refreshing the Netflix tab and restarting the extension.",
    });
    console.error(
      "Error checking if observer is active",
      JSON.stringify(err, null, 2)
    );
  }
}

async function checkScriptActive(tab) {
  try {
    // Send a "ping" message to the content script to see if it is already injected in current tab
    const scriptStatus = await new Promise((resolve) => {
      chrome.tabs.sendMessage(tab.id, { action: "ping" }, (response) => {
        //error occurs if receiving end doesn't exist (script not injected)
        if (chrome.runtime.lastError) {
          resolve(null);
        } else {
          resolve(response);
        }
      });
    });

    if (!scriptStatus || scriptStatus.status !== "active") {
      // content script not in current tab, so inject
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["netflixSkipObserver.js"],
      });

      // Wait briefly before sending message to ensure script fully loaded
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  } catch (err) {
    chrome.runtime.sendMessage({
      type: "error",
      message:
        "Error -  try refreshing the Netflix tab and restarting the extension.",
    });
    console.error(
      "Error injecting content script:",
      JSON.stringify(err, null, 2)
    );
  }
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  try {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);

    // Check if valid netflix page
    if (tab?.url.includes("netflix.com/watch")) {
      await checkScriptActive(tab);
      if (request.action == "startSkip") {
        //checks if observer active
        const observerActive = await checkObserverActive(tab, request.action);
        if (observerActive) {
          // Send start message to script (already injected)
          chrome.tabs.sendMessage(
            tab.id,
            { action: "startSkip" },
            (response) => {
              if (chrome.runtime.lastError) {
                chrome.runtime.sendMessage({
                  type: "error",
                  message:
                    "Error -  try refreshing the Netflix tab and restarting the extension",
                });
                console.error(
                  "Error sending message to content script:",
                  JSON.stringify(chrome.runtime.lastError, null, 2)
                );
              } else {
                chrome.runtime.sendMessage({
                  type: "success",
                  message: "LazyStream is now running!",
                });
              }
            }
          );
        } else {
          chrome.runtime.sendMessage({
            type: "error",
            message: "LazyStream is already running!",
          });
        }

        // Script already injected, so only send message
      } else if (request.action == "stopSkip") {
        //checks if observer active
        const observerActive = await checkObserverActive(tab, request.action);
        if (observerActive) {
          // Send stop message to script
          chrome.tabs.sendMessage(
            tab.id,
            { action: "stopSkip" },
            (response) => {
              if (chrome.runtime.lastError) {
                chrome.runtime.sendMessage({
                  type: "error",
                  message:
                    "Sorry, the program failed to stop -  try refreshing the Netflix tab and restarting the extension",
                });
                console.error(
                  "Error sending message to content script:",
                  JSON.stringify(chrome.runtime.lastError, null, 2)
                );
              } else {
                chrome.runtime.sendMessage({
                  type: "success",
                  message: "LazyStream has been stopped successfully!",
                });
              }
            }
          );
        } else {
          chrome.runtime.sendMessage({
            type: "error",
            message: "LazyStream has not started yet!",
          });
        }
      }
    } else {
      chrome.runtime.sendMessage({
        type: "error",
        message:
          "Please go to a netflix.com/watch page before clicking start or stop.",
      });
      console.error("Netflix watch page is not found");
    }
  } catch (err) {
    chrome.runtime.sendMessage({
      type: "error",
      message:
        "Error -  try refreshing the Netflix tab and restarting the extension.",
    });
    console.error("Error in runtime:", JSON.stringify(err, null, 2));
  }
});
