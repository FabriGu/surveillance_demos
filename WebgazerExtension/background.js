// background.js - Handles extension initialization and cleanup

// Initialize extension state
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ eyeTrackerState: "idle" });
  console.log("Eye-tracking tag game extension installed");
});

// Listen for tab updates to reinject content scripts if needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active) {
    chrome.storage.local.get(["eyeTrackerState"], function (result) {
      if (
        result.eyeTrackerState === "training" ||
        result.eyeTrackerState === "active"
      ) {
        // Re-activate on the tab if it was active before
        chrome.tabs.sendMessage(tabId, {
          action:
            result.eyeTrackerState === "training"
              ? "startTraining"
              : "activateGame",
        });
      }
    });
  }
});
