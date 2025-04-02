// popup.js
document.addEventListener("DOMContentLoaded", function () {
  const startTrainingBtn = document.getElementById("startTraining");
  const activateGameBtn = document.getElementById("activateGame");
  const stopGameBtn = document.getElementById("stopGame");
  const statusDiv = document.getElementById("status");

  // Initialize buttons and status based on current state
  // We'll use chrome.storage to maintain state between popup opens
  chrome.storage.local.get(["eyeTrackerState"], function (result) {
    const state = result.eyeTrackerState || "idle";
    updateUIState(state);
  });

  // Start Training button
  startTrainingBtn.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "startTraining" });
    });

    // Update state
    chrome.storage.local.set({ eyeTrackerState: "training" });
    updateUIState("training");
  });

  // Activate Game button
  activateGameBtn.addEventListener("click", function () {
    // console.log(document.getElementById("webgazerFaceOverlay"));
    // if (document.getElementById("webgazerFaceOverlay")) {
    //     document.getElementById("webgazerFaceOverlay").style.display = "none";
    // }
    
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "activateGame" });
    });

    // Update state
    chrome.storage.local.set({ eyeTrackerState: "active" });
    updateUIState("active");
  });

  // Stop Game button
  stopGameBtn.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "stopGame" });
    });

    // Update state
    chrome.storage.local.set({ eyeTrackerState: "idle" });
    updateUIState("idle");
  });

  // Function to update UI based on current state
  function updateUIState(state) {
    switch (state) {
      case "training":
        statusDiv.textContent =
          "Training Mode: Click while looking at elements";
        statusDiv.className = "status training";
        startTrainingBtn.disabled = true;
        activateGameBtn.disabled = false;
        stopGameBtn.disabled = false;
        break;
      case "active":
        statusDiv.textContent = "Game Active: Elements will dodge your gaze";
        statusDiv.className = "status active";
        startTrainingBtn.disabled = false;
        activateGameBtn.disabled = true;
        stopGameBtn.disabled = false;
        break;
      case "idle":
      default:
        statusDiv.textContent = "Extension ready";
        statusDiv.className = "status";
        startTrainingBtn.disabled = false;
        activateGameBtn.disabled = false;
        stopGameBtn.disabled = true;
        break;
    }
  }
});
