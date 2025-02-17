document.getElementById("start-skip").addEventListener("click", async () => {
  chrome.runtime.sendMessage({ action: "startSkip" });
});

document.getElementById("stop-skip").addEventListener("click", async () => {
  chrome.runtime.sendMessage({ action: "stopSkip" });
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
