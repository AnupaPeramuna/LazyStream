document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("start-skip");
  const stopButton = document.getElementById("stop-skip");

  startButton.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "startSkip" });
    startButton.disabled = true;
    stopButton.disabled = false;
  });

  stopButton.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "stopSkip" });
    startButton.disabled = false;
    stopButton.disabled = true;
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const statusContainer = document.querySelector(".status-message");

  if (message.type === "success") {
    statusContainer.textContent = message.message;
    statusContainer.style.color = "green";
  } else if (message.type === "error") {
    statusContainer.textContent = message.message;
    statusContainer.style.color = "red";
  }
});
