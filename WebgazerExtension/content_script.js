// content_script.js
// This script injects WebGazer and our main functionality into the page

// First, inject our actual implementation into the page context
function injectScript() {
  // Create a script element to load WebGazer
  const webgazerScript = document.createElement("script");
  webgazerScript.src = chrome.runtime.getURL("webgazer.js");
  webgazerScript.onload = function () {
    // Once WebGazer is loaded, inject our main functionality
    const mainScript = document.createElement("script");
    mainScript.src = chrome.runtime.getURL("main.js");
    document.head.appendChild(mainScript);

    console.log("WebGazer and main script injected successfully");
  };
  document.head.appendChild(webgazerScript);

  // Add our status elements
  createStatusElements();
}

// Create UI elements for feedback and status
function createStatusElements() {
  // Create eye tracker indicator
  const indicator = document.createElement("div");
  indicator.id = "eye-tracker-indicator";
  indicator.style.display = "none";
  document.body.appendChild(indicator);

  // Create status overlay
  const status = document.createElement("div");
  status.id = "eye-tracker-status";
  status.style.display = "none";
  document.body.appendChild(status);
}

// Add CSS to the page
function injectCSS() {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = chrome.runtime.getURL("content.css");
  document.head.appendChild(link);
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // Forward messages to the page script using window events
  window.dispatchEvent(
    new CustomEvent("eyeTrackerExtensionMessage", {
      detail: request,
    })
  );
});

// Initialize everything
injectCSS();
injectScript();

console.log("Eye-tracking content script initialized");
