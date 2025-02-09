
function checkButtonContainer() {
    const buttonContainer = document.querySelector(".ltr-fntwn3");

    if (!buttonContainer) {
        return;
    }

    return buttonContainer;
}

function clickSkipButtons() {
    const skipIntroButton = document.querySelector("[data-uia='player-skip-intro']");

    if (skipIntroButton) {
        skipIntroButton.click();
    }
}

function useObserver(targetContainer) {
    let delay; 
    const observer = new MutationObserver(() => {
        clearTimeout(delay);
        delay = setTimeout(clickSkipButtons, 200);
    });

    observer.observe(targetContainer, { childList: true, subtree: true });
}

function autoSkipNetflix() {
    const buttonContainer = checkButtonContainer();

    if (!buttonContainer) {
        return;
    }

    useObserver(buttonContainer);
    clickSkipButtons();
}

autoSkipNetflix();
