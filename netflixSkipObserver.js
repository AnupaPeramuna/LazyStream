class netflixSkipObserver {
  constructor() {
    this.observer = null;
    this.timer = 0;
  }

  getButtonContainer() {
    const buttonContainer = document.querySelector(".ltr-fntwn3");

    if (!buttonContainer) {
      return;
    }

    return buttonContainer;
  }

  clickSkipButtons() {
    const skipButton = document.querySelector(
      "[data-uia='player-skip-intro'], [data-uia='player-skip-recap'], [data-uia='next-episode-seamless-button']"
    );

    if (skipButton) {
      skipButton.click();
    }
  }

  netflixPaused() {
    const paused = document.querySelector(
      "[data-uia='watch-video-notification-pause']"
    );

    if (paused) {
      return true;
    }

    return false;
  }

  useObserver(buttonContainer) {
    this.observer = new MutationObserver(() => {
      // stop looking for skip buttons when video paused
      if (this.netflixPaused()) {
        return;
      }

      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.clickSkipButtons(), 500);
    });

    this.observer.observe(buttonContainer, { childList: true, subtree: true });
  }

  autoSkipNetflix() {
    const buttonContainer = this.getButtonContainer();

    if (!buttonContainer) {
      return;
    }

    this.useObserver(buttonContainer);
    this.clickSkipButtons();
  }

  disconnectObserver() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  checkObserverStatus() {
    if (this.observer) {
      return true;
    }

    return false;
  }
}

const netflixObserver = new netflixSkipObserver();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "ping") {
    sendResponse({ status: "active" });
  } else if (request.action == "observerStatus") {
    sendResponse({
      status: netflixObserver.checkObserverStatus()
        ? "observerOnline"
        : "observerOffline",
    });
  } else if (request.action === "startSkip") {
    netflixObserver.autoSkipNetflix();
    sendResponse({ status: "Skipping started" });
  } else if (request.action === "stopSkip") {
    netflixObserver.disconnectObserver();
    sendResponse({ status: "Skipping stopped" });
  } else {
    sendResponse({ status: "Unknown action" });
  }

  return true;
});
