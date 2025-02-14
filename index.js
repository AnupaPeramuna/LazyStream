document.getElementById("start-skip").addEventListener("click", async () => {
    chrome.runtime.sendMessage({ action: "startSkip" });
  });
  

  document.getElementById("stop-skip").addEventListener("click", async () => {
    chrome.runtime.sendMessage({ action: "stopSkip" });
  });
