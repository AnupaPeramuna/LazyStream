class netflixSkipObserver {
    constructor() {
        this.observer = null;
        this.timer = 0
    }

    checkButtonContainer() {
        const buttonContainer = document.querySelector(".ltr-fntwn3");
    
        if (!buttonContainer) {
            return;
        }

        return buttonContainer;
    }

    clickSkipButtons(buttonContainer) {
        const skipButton = buttonContainer.querySelector("[data-uia='player-skip-intro'], [data-uia='player-skip-recap'], [data-uia='next-episode-seamless-button']" )
    
        if (skipButton) {
            skipButton.click();
        }
    }

    
    useObserver(buttonContainer) {
        this.observer = new MutationObserver(() => {
            clearTimeout(this.timer);
            this.timer = setTimeout(this.clickSkipButtons(buttonContainer), 200);
        });

        this.observer.observe(buttonContainer, { childList: true, subtree: true });
    }   

    autoSkipNetflix() {
        const buttonContainer = this.checkButtonContainer();
    
        if (!buttonContainer) {
            return;
        }
    
        this.useObserver(buttonContainer);
        this.clickSkipButtons();
    }

    disconnectObserver() {
        if(this.observer){
       this.observer.disconnect();
        this.observer = null;
        }
    }
}


const netflixObserver = new netflixSkipObserver();


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "startSkip") {
        netflixObserver.autoSkipNetflix();
        sendResponse({ status: "Skipping started" });

    }

    else if (request.action === "stopSkip") {
        netflixObserver.disconnectObserver();
        sendResponse({ status: "Skipping stopped" });

    }
    else {
        sendResponse({ status: "Unknown action" });
    }

});


chrome.runtime.sendMessage({ action: "scriptReady" });





