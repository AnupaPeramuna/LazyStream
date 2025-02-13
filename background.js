chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ scriptInjected: false });
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
        try {
            let queryOptions = {active: true, currentWindow: true};
            let [tab] = await chrome.tabs.query(queryOptions);

            // Check if valid netflix page
            if (tab?.url.includes("netflix.com/watch")) {
                if(request.action == "startSkip"){

                    chrome.storage.local.get(["scriptInjected"], async (data) => {
                        if(!data.scriptInjected){
                        
                            // Inject the script
                            await chrome.scripting.executeScript({
                                target: { tabId: tab.id },
                                files: ["netflixSkipObserver.js"]
                            });

                            chrome.storage.local.set({ scriptInjected: true });

                            // Send start message to script
                            chrome.tabs.sendMessage(tab.id, { action: "startSkip" }, (response) => {
                                if (chrome.runtime.lastError) {
                                    chrome.runtime.sendMessage({ type: "error", message: "Error -  try refreshing the Netflix tab and restarting the extension" });
                                    console.error("Error sending message to content script:", chrome.runtime.lastError);
                                }
                            });
                        }

                        else if(data.scriptInjected) {

                            // Send start message to script (already loaded)
                            chrome.tabs.sendMessage(tab.id, { action: "startSkip" }, (response) => {
                                if (chrome.runtime.lastError) {
                                    chrome.runtime.sendMessage({ type: "error", message: "Error -  try refreshing the Netflix tab and restarting the extension" });
                                    console.error("Error sending message to content script:", chrome.runtime.lastError);
                                }
                            });

                        }
                    })
                }

                // Script already injected, so only send message
                else if (request.action == "stopSkip"){
                    chrome.storage.local.get(["scriptInjected"], async (data) => {
                        if(data.scriptInjected){

                            // Send stop message to script
                            chrome.tabs.sendMessage(tab.id, {action: "stopSkip"})
                        }

                        else {
                            chrome.runtime.sendMessage({ type: "error", message: "LazyStream is not running yet. Please click the start button first." });
                            console.error("Script has not been injected yet")
                        }
                    })
                }
            }

            else {
                chrome.runtime.sendMessage({ type: "error", message: "Please go to a netflix.com/watch before clicking start." });
                console.error("Netflix watch page is not found")
            }

        } catch (err) {
            chrome.runtime.sendMessage({ type: "error", message: "Error -  try refreshing the Netflix tab and restarting the extension." });
            console.error("Error in runtime:", err)
        }
    }
);


