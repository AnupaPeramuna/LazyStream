class netflixSkipObserver {
    constructor() {
        this.skipActive = false;
        this.observer = null;
    }

    toggleSkipActive() {
        this.skipActive = !this.skipActive;
        chrome.storage.local.set({ skipActive: this.skipActive });
    }

    checkButtonContainer() {
        const buttonContainer = document.querySelector(".ltr-fntwn3");
    
        if (!buttonContainer) {
            return;
        }

        return buttonContainer;
    }

    clickSkipButtons() {
        const skipButton = document.querySelector("[data-uia='player-skip-intro'], [data-uia='player-skip-recap'], [data-uia='next-episode-seamless-button']" )
    
        if (skipButton) {
            skipButton.click();
        }
    }

    
    useObserver(targetContainer) {
    let delay; 
    this.observer = new MutationObserver(() => {
        clearTimeout(delay);
        delay = setTimeout(clickSkipButtons, 200);
    });

    
    this.observer.observe(targetContainer, { childList: true, subtree: true });
    }   

    autoSkipNetflix() {
        const buttonContainer = checkButtonContainer();
    
        if (!buttonContainer) {
            return;
        }
    
        useObserver(buttonContainer);
        clickSkipButtons();
    }

    disconnectObserver() {
        this.observer.disconnect();
    }
}

const netflixObserver = new netflixSkipObserver();
